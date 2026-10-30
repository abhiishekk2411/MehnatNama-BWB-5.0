import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import type { CreateJobInput, UpdateJobInput, UpdateJobStatusInput } from '../validation/job.schema.js';
import type { JobStatus } from '@prisma/client';

export class JobService {
  static async listJobs(userId: string, filters?: { status?: JobStatus; search?: string }) {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { jobTitle: { contains: filters.search, mode: 'insensitive' } },
        { contractorName: { contains: filters.search, mode: 'insensitive' } },
        { workLocation: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            workDays: true,
            ledgerEntries: true,
          },
        },
      },
    });

    // Compute live financial totals per job
    const jobStats = await Promise.all(
      jobs.map(async (job) => {
        const workDays = await prisma.workDay.findMany({
          where: { jobId: job.id, userId },
          select: { earnedAmountPaise: true, status: true },
        });

        const ledger = await prisma.ledgerEntry.findMany({
          where: { jobId: job.id, userId },
          select: { amountPaise: true, type: true },
        });

        const totalEarnedPaise = workDays.reduce((acc, curr) => acc + curr.earnedAmountPaise, 0);
        const totalPaymentsPaise = ledger
          .filter((l) => l.type === 'PAYMENT')
          .reduce((acc, curr) => acc + curr.amountPaise, 0);
        const totalAdvancesPaise = ledger
          .filter((l) => l.type === 'ADVANCE')
          .reduce((acc, curr) => acc + curr.amountPaise, 0);
        const totalReceiptsPaise = totalPaymentsPaise + totalAdvancesPaise;
        const outstandingBalancePaise = totalEarnedPaise - totalReceiptsPaise;

        const workingDaysCount = workDays.reduce((acc, curr) => {
          if (curr.status === 'FULL_DAY') return acc + 1;
          if (curr.status === 'HALF_DAY') return acc + 0.5;
          return acc;
        }, 0);

        return {
          ...job,
          stats: {
            totalDays: workingDaysCount,
            totalEarnedPaise,
            totalEarnedRupees: Math.round(totalEarnedPaise / 100),
            totalPaymentsPaise,
            totalAdvancesPaise,
            totalReceiptsPaise,
            totalReceiptsRupees: Math.round(totalReceiptsPaise / 100),
            outstandingBalancePaise,
            outstandingBalanceRupees: Math.round(outstandingBalancePaise / 100),
            isCreditBalance: totalReceiptsPaise > totalEarnedPaise,
          },
        };
      })
    );

    return jobStats;
  }

  static async createJob(userId: string, input: CreateJobInput) {
    const job = await prisma.job.create({
      data: {
        userId,
        jobTitle: input.jobTitle,
        contractorName: input.contractorName,
        contractorPhone: input.contractorPhone,
        workLocation: input.workLocation || null,
        workCategory: input.workCategory || 'Construction',
        skillLevel: input.skillLevel,
        agreedDailyRatePaise: input.agreedDailyRatePaise,
        startDate: new Date(input.startDate),
        expectedEndDate: input.expectedEndDate ? new Date(input.expectedEndDate) : null,
        status: 'ACTIVE',
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: 'JOB',
        entityId: job.id,
        action: 'CREATE',
        newValues: job as any,
      },
    });

    return job;
  }

  static async getJobById(userId: string, jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        workDays: {
          orderBy: { workDate: 'desc' },
          take: 10,
        },
        ledgerEntries: {
          orderBy: { paymentDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!job) {
      throw new NotFoundError('Job not found.');
    }

    if (job.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this job.');
    }

    // Financial totals for this job
    const allWorkDays = await prisma.workDay.findMany({
      where: { jobId },
      select: { earnedAmountPaise: true, status: true },
    });

    const allLedger = await prisma.ledgerEntry.findMany({
      where: { jobId },
      select: { amountPaise: true, type: true },
    });

    const totalEarnedPaise = allWorkDays.reduce((acc, curr) => acc + curr.earnedAmountPaise, 0);
    const totalPaymentsPaise = allLedger
      .filter((l) => l.type === 'PAYMENT')
      .reduce((acc, curr) => acc + curr.amountPaise, 0);
    const totalAdvancesPaise = allLedger
      .filter((l) => l.type === 'ADVANCE')
      .reduce((acc, curr) => acc + curr.amountPaise, 0);
    const totalReceiptsPaise = totalPaymentsPaise + totalAdvancesPaise;
    const outstandingBalancePaise = totalEarnedPaise - totalReceiptsPaise;

    return {
      ...job,
      stats: {
        totalEarnedPaise,
        totalEarnedRupees: Math.round(totalEarnedPaise / 100),
        totalPaymentsPaise,
        totalAdvancesPaise,
        totalReceiptsPaise,
        totalReceiptsRupees: Math.round(totalReceiptsPaise / 100),
        outstandingBalancePaise,
        outstandingBalanceRupees: Math.round(outstandingBalancePaise / 100),
        isCreditBalance: totalReceiptsPaise > totalEarnedPaise,
      },
    };
  }

  static async updateJob(userId: string, jobId: string, input: UpdateJobInput) {
    const existing = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existing) {
      throw new NotFoundError('Job not found.');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this job.');
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(input.jobTitle && { jobTitle: input.jobTitle }),
        ...(input.contractorName && { contractorName: input.contractorName }),
        ...(input.contractorPhone && { contractorPhone: input.contractorPhone }),
        ...(input.workLocation !== undefined && { workLocation: input.workLocation }),
        ...(input.workCategory && { workCategory: input.workCategory }),
        ...(input.skillLevel && { skillLevel: input.skillLevel }),
        ...(input.agreedDailyRatePaise && { agreedDailyRatePaise: input.agreedDailyRatePaise }),
        ...(input.startDate && { startDate: new Date(input.startDate) }),
        ...(input.expectedEndDate !== undefined && {
          expectedEndDate: input.expectedEndDate ? new Date(input.expectedEndDate) : null,
        }),
        ...(input.status && { status: input.status }),
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: 'JOB',
        entityId: jobId,
        action: 'UPDATE',
        oldValues: existing as any,
        newValues: updatedJob as any,
      },
    });

    return updatedJob;
  }

  static async updateJobStatus(userId: string, jobId: string, input: UpdateJobStatusInput) {
    return this.updateJob(userId, jobId, { status: input.status });
  }
}
