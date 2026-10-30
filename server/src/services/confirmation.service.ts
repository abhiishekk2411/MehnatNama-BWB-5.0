import { prisma } from '../config/database.js';
import { generateSecureToken, hashToken } from '../utils/crypto.util.js';
import type { CreateConfirmationRequestInput, ContractorBatchResponseInput } from '../validation/confirmation.schema.js';

export class ConfirmationService {
  /**
   * Worker creates a confirmation request with cryptographic raw token returned once.
   */
  static async createRequest(userId: string, input: CreateConfirmationRequestInput) {
    // 1. Verify job ownership
    const job = await prisma.job.findFirst({
      where: { id: input.jobId, userId },
      include: { user: { include: { profile: true } } },
    });

    if (!job) {
      const error: any = new Error('Job not found or access denied');
      error.statusCode = 404;
      throw error;
    }

    // 2. Determine workdays to include
    let workDayWhere: any = { jobId: input.jobId, userId };
    if (input.workDayIds && input.workDayIds.length > 0) {
      workDayWhere.id = { in: input.workDayIds };
    } else {
      if (input.startDate || input.endDate) {
        workDayWhere.workDate = {};
        if (input.startDate) workDayWhere.workDate.gte = new Date(input.startDate);
        if (input.endDate) workDayWhere.workDate.lte = new Date(input.endDate);
      }
    }

    const eligibleWorkDays = await prisma.workDay.findMany({
      where: workDayWhere,
      orderBy: { workDate: 'asc' },
    });

    if (eligibleWorkDays.length === 0) {
      const error: any = new Error('No workday records found matching the specified parameters');
      error.statusCode = 400;
      throw error;
    }

    // 3. Generate raw 256-bit token and store only the SHA-256 hash
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);

    const expiryDays = input.expiryDays || 14;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    // 4. Create request and items in a single transaction
    const request = await prisma.$transaction(async (tx) => {
      const req = await tx.contractorConfirmationRequest.create({
        data: {
          userId,
          jobId: input.jobId,
          tokenHash,
          expiresAt,
          status: 'PENDING',
          title: input.title || `Verification: ${job.jobTitle} (${eligibleWorkDays.length} days)`,
          note: input.note,
        },
      });

      // Create confirmation items for each workday
      await tx.confirmationItem.createMany({
        data: eligibleWorkDays.map((wd) => ({
          requestId: req.id,
          workDayId: wd.id,
          status: 'PENDING',
        })),
        skipDuplicates: true,
      });

      // Audit log event
      await tx.confirmationAuditEvent.create({
        data: {
          requestId: req.id,
          eventType: 'REQUEST_CREATED',
          metadata: {
            jobId: input.jobId,
            itemCount: eligibleWorkDays.length,
            expiryDays,
          },
        },
      });

      return req;
    });

    return {
      request,
      rawToken, // Sent to worker once to construct shareable link
      shareUrl: `/contractor/confirm/${rawToken}`,
    };
  }

  /**
   * Get all confirmation requests for a worker
   */
  static async getWorkerRequests(userId: string) {
    const requests = await prisma.contractorConfirmationRequest.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            contractorName: true,
            contractorPhone: true,
            agreedDailyRatePaise: true,
          },
        },
        items: {
          include: {
            workDay: {
              select: {
                id: true,
                workDate: true,
                status: true,
                earnedAmountPaise: true,
                dailyRateSnapshotPaise: true,
                note: true,
              },
            },
            responses: {
              orderBy: { submittedAt: 'desc' },
              take: 1,
            },
          },
        },
        auditEvents: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check expiry dynamically
    const now = new Date();
    return requests.map((req) => {
      let currentStatus = req.status;
      if (req.status === 'PENDING' && req.expiresAt < now && !req.revokedAt) {
        currentStatus = 'EXPIRED';
      }
      return {
        ...req,
        status: currentStatus,
      };
    });
  }

  /**
   * Get request details by ID for the worker
   */
  static async getRequestById(userId: string, requestId: string) {
    const req = await prisma.contractorConfirmationRequest.findFirst({
      where: { id: requestId, userId },
      include: {
        job: true,
        items: {
          include: {
            workDay: true,
            responses: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        auditEvents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!req) {
      const error: any = new Error('Confirmation request not found');
      error.statusCode = 404;
      throw error;
    }

    return req;
  }

  /**
   * Revoke an active confirmation link
   */
  static async revokeRequest(userId: string, requestId: string) {
    const req = await prisma.contractorConfirmationRequest.findFirst({
      where: { id: requestId, userId },
    });

    if (!req) {
      const error: any = new Error('Confirmation request not found');
      error.statusCode = 404;
      throw error;
    }

    if (req.status === 'REVOKED') {
      return req;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.contractorConfirmationRequest.update({
        where: { id: requestId },
        data: {
          status: 'REVOKED',
          revokedAt: new Date(),
        },
      });

      await tx.confirmationAuditEvent.create({
        data: {
          requestId,
          eventType: 'REQUEST_REVOKED',
          metadata: { revokedBy: 'WORKER' },
        },
      });

      return res;
    });

    return updated;
  }

  // ==========================================
  // PUBLIC CONTRACTOR PORTAL (ZERO LOGIN)
  // ==========================================

  /**
   * Retrieve request by raw token hash (Zero auth for contractor)
   * Enforces minimal data exposure (no worker PIN, no unrelated jobs, no full phone)
   */
  static async getPublicRequest(rawToken: string, ipAddress?: string, userAgent?: string) {
    if (!rawToken || rawToken.length !== 64) {
      const error: any = new Error('Invalid confirmation link');
      error.statusCode = 400;
      throw error;
    }

    const tokenHash = hashToken(rawToken);
    const req = await prisma.contractorConfirmationRequest.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            profile: {
              select: {
                fullName: true,
                workerType: true,
                skillLevel: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            jobTitle: true,
            contractorName: true,
            workLocation: true,
            workCategory: true,
            agreedDailyRatePaise: true,
          },
        },
        items: {
          include: {
            workDay: {
              select: {
                id: true,
                workDate: true,
                status: true,
                dailyRateSnapshotPaise: true,
                earnedAmountPaise: true,
                overtimeMinutes: true,
                note: true,
              },
            },
            responses: {
              orderBy: { submittedAt: 'desc' },
              take: 1,
            },
          },
          orderBy: { workDay: { workDate: 'asc' } },
        },
      },
    });

    if (!req) {
      const error: any = new Error('Confirmation link not found or invalid');
      error.statusCode = 404;
      throw error;
    }

    // Check revocation
    if (req.revokedAt || req.status === 'REVOKED') {
      const error: any = new Error('This confirmation link has been revoked by the worker');
      error.statusCode = 410; // Gone
      throw error;
    }

    // Check expiry
    if (new Date() > req.expiresAt) {
      const error: any = new Error('This confirmation link has expired');
      error.statusCode = 410; // Gone
      throw error;
    }

    // Also fetch relevant payments summary for this job strictly within scope
    const paymentsSummary = await prisma.ledgerEntry.aggregate({
      where: {
        jobId: req.jobId,
        userId: req.userId,
      },
      _sum: {
        amountPaise: true,
      },
    });

    // Record audit event: LINK_OPENED (append-only)
    await prisma.confirmationAuditEvent.create({
      data: {
        requestId: req.id,
        eventType: 'LINK_OPENED',
        ipAddress: ipAddress?.slice(0, 45),
        userAgent: userAgent?.slice(0, 255),
        metadata: { timestamp: new Date().toISOString() },
      },
    });

    // Return sanitized view for the contractor
    return {
      id: req.id,
      title: req.title,
      note: req.note,
      createdAt: req.createdAt,
      expiresAt: req.expiresAt,
      status: req.status,
      worker: {
        displayName: req.user.profile?.fullName || 'Worker',
        workerType: req.user.profile?.workerType || 'General Worker',
        skillLevel: req.user.profile?.skillLevel || 'SKILLED',
      },
      job: req.job,
      items: req.items.map((item) => ({
        id: item.id,
        status: item.status,
        workDate: item.workDay.workDate,
        workDayStatus: item.workDay.status,
        dailyRatePaise: item.workDay.dailyRateSnapshotPaise,
        earnedAmountPaise: item.workDay.earnedAmountPaise,
        overtimeMinutes: item.workDay.overtimeMinutes,
        note: item.workDay.note,
        latestResponse: item.responses[0] || null,
      })),
      totalPaymentsRecordedPaise: paymentsSummary._sum.amountPaise || 0,
    };
  }

  /**
   * Contractor submits responses (confirm/dispute) for items
   */
  static async submitPublicResponse(
    rawToken: string,
    input: ContractorBatchResponseInput,
    ipAddress?: string
  ) {
    if (!rawToken || rawToken.length !== 64) {
      const error: any = new Error('Invalid confirmation link');
      error.statusCode = 400;
      throw error;
    }

    const tokenHash = hashToken(rawToken);
    const req = await prisma.contractorConfirmationRequest.findUnique({
      where: { tokenHash },
      include: { items: true },
    });

    if (!req) {
      const error: any = new Error('Confirmation request not found');
      error.statusCode = 404;
      throw error;
    }

    if (req.revokedAt || req.status === 'REVOKED') {
      const error: any = new Error('This confirmation link has been revoked');
      error.statusCode = 410;
      throw error;
    }

    if (new Date() > req.expiresAt) {
      const error: any = new Error('This confirmation link has expired');
      error.statusCode = 410;
      throw error;
    }

    const validItemIds = new Set(req.items.map((i) => i.id));

    // Process all responses in a transaction
    await prisma.$transaction(async (tx) => {
      let hasDisputed = false;
      let hasConfirmed = false;

      for (const itemResp of input.responses) {
        if (!validItemIds.has(itemResp.itemId)) {
          continue; // Skip items not belonging to this request
        }

        const isDispute = itemResp.responseType === 'DISPUTED';
        if (isDispute) hasDisputed = true;
        else hasConfirmed = true;

        // Record individual response
        await tx.confirmationResponse.create({
          data: {
            itemId: itemResp.itemId,
            responseType: itemResp.responseType,
            disputeReason: isDispute ? itemResp.disputeReason : null,
            optionalComment: itemResp.optionalComment,
            responderIp: ipAddress?.slice(0, 45),
          },
        });

        // Update item status
        await tx.confirmationItem.update({
          where: { id: itemResp.itemId },
          data: {
            status: isDispute ? 'DISPUTED' : 'CONFIRMED',
          },
        });
      }

      // Determine overall request status
      const updatedItems = await tx.confirmationItem.findMany({
        where: { requestId: req.id },
      });

      const allConfirmed = updatedItems.every((i) => i.status === 'CONFIRMED');
      const anyDisputed = updatedItems.some((i) => i.status === 'DISPUTED');

      let overallStatus: 'CONFIRMED' | 'DISPUTED' | 'PENDING' = 'PENDING';
      if (anyDisputed) overallStatus = 'DISPUTED';
      else if (allConfirmed) overallStatus = 'CONFIRMED';

      await tx.contractorConfirmationRequest.update({
        where: { id: req.id },
        data: { status: overallStatus },
      });

      // Record audit event
      await tx.confirmationAuditEvent.create({
        data: {
          requestId: req.id,
          eventType: 'RESPONSES_SUBMITTED',
          ipAddress: ipAddress?.slice(0, 45),
          metadata: {
            overallStatus,
            responseCount: input.responses.length,
            hasDisputed,
            hasConfirmed,
            timestamp: new Date().toISOString(),
          },
        },
      });
    });

    return {
      success: true,
      message: 'Acknowledgement recorded successfully. Thank you for confirming.',
      timestamp: new Date().toISOString(),
    };
  }
}
