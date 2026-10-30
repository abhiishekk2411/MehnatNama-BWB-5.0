import { prisma } from '../config/database.js';
import { generateSecureToken, hashToken } from '../utils/crypto.util.js';
import { ReportService } from './report.service.js';
import type { CreateSharedAccessInput } from '../validation/helper.schema.js';

export class HelperAccessService {
  /**
   * Worker creates a time-limited read-only helper access link
   */
  static async createAccess(userId: string, input: CreateSharedAccessInput) {
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);

    const expiryDays = input.expiryDays || 7;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const access = await prisma.sharedReportAccess.create({
      data: {
        userId,
        jobId: input.jobId,
        helperName: input.helperName || 'Trusted Helper / Volunteer',
        tokenHash,
        expiresAt,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
      },
    });

    return {
      access,
      rawToken,
      shareUrl: `/shared/report/${rawToken}`,
    };
  }

  /**
   * Worker lists their active shared accesses
   */
  static async getWorkerAccesses(userId: string) {
    return await prisma.sharedReportAccess.findMany({
      where: { userId },
      include: {
        accessLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Worker revokes a shared access link immediately
   */
  static async revokeAccess(userId: string, accessId: string) {
    const access = await prisma.sharedReportAccess.findFirst({
      where: { id: accessId, userId },
    });

    if (!access) {
      const error: any = new Error('Shared access record not found');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.sharedReportAccess.update({
      where: { id: accessId },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Public helper view (Zero-login, strictly read-only scoped report)
   */
  static async getPublicSharedReport(rawToken: string, ipAddress?: string, userAgent?: string) {
    if (!rawToken || rawToken.length !== 64) {
      const error: any = new Error('Invalid report link');
      error.statusCode = 400;
      throw error;
    }

    const tokenHash = hashToken(rawToken);
    const access = await prisma.sharedReportAccess.findUnique({
      where: { tokenHash },
    });

    if (!access) {
      const error: any = new Error('Shared report link not found or invalid');
      error.statusCode = 404;
      throw error;
    }

    if (access.revokedAt) {
      const error: any = new Error('This helper access link has been revoked by the worker');
      error.statusCode = 410;
      throw error;
    }

    if (new Date() > access.expiresAt) {
      const error: any = new Error('This helper access link has expired');
      error.statusCode = 410;
      throw error;
    }

    // Log the read-only access
    await prisma.helperAccessLog.create({
      data: {
        accessId: access.id,
        action: 'REPORT_VIEWED',
        ipAddress: ipAddress?.slice(0, 45),
        userAgent: userAgent?.slice(0, 255),
      },
    });

    // Compile read-only report
    const reportData = await ReportService.generateReportData(access.userId, {
      jobId: access.jobId || undefined,
      startDate: access.startDate?.toISOString().split('T')[0],
      endDate: access.endDate?.toISOString().split('T')[0],
      language: 'hi',
    });

    return {
      helperName: access.helperName,
      expiresAt: access.expiresAt,
      report: reportData,
    };
  }
}
