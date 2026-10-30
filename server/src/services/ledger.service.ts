import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import type { CreateLedgerEntryInput, UpdateLedgerEntryInput, QueryLedgerInput } from '../validation/ledger.schema.js';

export class LedgerService {
  static async listEntries(userId: string, filters?: QueryLedgerInput) {
    const where: any = { userId };

    if (filters?.jobId) {
      where.jobId = filters.jobId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.month) {
      const [year, month] = filters.month.split('-').map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0));
      where.paymentDate = {
        gte: start,
        lte: end,
      };
    } else if (filters?.startDate || filters?.endDate) {
      where.paymentDate = {};
      if (filters.startDate) {
        where.paymentDate.gte = new Date(filters.startDate + 'T00:00:00Z');
      }
      if (filters.endDate) {
        where.paymentDate.lte = new Date(filters.endDate + 'T00:00:00Z');
      }
    }

    const entries = await prisma.ledgerEntry.findMany({
      where,
      orderBy: { paymentDate: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            contractorName: true,
          },
        },
      },
    });

    return entries;
  }

  static async recordEntry(userId: string, input: CreateLedgerEntryInput) {
    // 1. Verify job exists and belongs to the worker
    const job = await prisma.job.findUnique({
      where: { id: input.jobId },
    });

    if (!job) {
      throw new NotFoundError('Selected job does not exist.');
    }

    if (job.userId !== userId) {
      throw new ForbiddenError('You do not have permission to add payment for this job.');
    }

    const paymentDate = new Date(input.paymentDate + 'T00:00:00Z');

    // 2. Create ledger entry
    const entry = await prisma.ledgerEntry.create({
      data: {
        userId,
        jobId: input.jobId,
        type: input.type,
        amountPaise: input.amountPaise,
        paymentDate,
        paymentMode: input.paymentMode,
        note: input.note || null,
      },
      include: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            contractorName: true,
          },
        },
      },
    });

    // 3. Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: 'LEDGER',
        entityId: entry.id,
        action: 'CREATE',
        newValues: entry as any,
      },
    });

    return entry;
  }

  static async getEntryById(userId: string, entryId: string) {
    const entry = await prisma.ledgerEntry.findUnique({
      where: { id: entryId },
      include: { job: true },
    });

    if (!entry) {
      throw new NotFoundError('Ledger entry not found.');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this entry.');
    }

    return entry;
  }

  static async updateEntry(userId: string, entryId: string, input: UpdateLedgerEntryInput) {
    const existing = await prisma.ledgerEntry.findUnique({
      where: { id: entryId },
    });

    if (!existing) {
      throw new NotFoundError('Ledger entry not found.');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this entry.');
    }

    const updated = await prisma.ledgerEntry.update({
      where: { id: entryId },
      data: {
        ...(input.amountPaise && { amountPaise: input.amountPaise }),
        ...(input.paymentDate && { paymentDate: new Date(input.paymentDate + 'T00:00:00Z') }),
        ...(input.paymentMode && { paymentMode: input.paymentMode }),
        ...(input.note !== undefined && { note: input.note }),
      },
      include: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            contractorName: true,
          },
        },
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: 'LEDGER',
        entityId: entryId,
        action: 'UPDATE',
        oldValues: existing as any,
        newValues: updated as any,
      },
    });

    return updated;
  }

  static async getLedgerSummary(userId: string, filters?: QueryLedgerInput) {
    const whereJob: any = { userId };
    if (filters?.jobId) {
      whereJob.jobId = filters.jobId;
    }

    // 1. Total Earned from all WorkDays
    const workDays = await prisma.workDay.findMany({
      where: whereJob,
      select: { earnedAmountPaise: true },
    });
    const totalEarnedPaise = workDays.reduce((acc, curr) => acc + curr.earnedAmountPaise, 0);

    // 2. Payments and Advances
    const entries = await this.listEntries(userId, filters);

    const totalPaymentsPaise = entries
      .filter((e) => e.type === 'PAYMENT')
      .reduce((acc, curr) => acc + curr.amountPaise, 0);

    const totalAdvancesPaise = entries
      .filter((e) => e.type === 'ADVANCE')
      .reduce((acc, curr) => acc + curr.amountPaise, 0);

    // Total recorded receipts = Payments + Advances (each counted exactly once!)
    const totalReceiptsPaise = totalPaymentsPaise + totalAdvancesPaise;

    // Outstanding recorded balance = Total earned - Total receipts
    const outstandingBalancePaise = totalEarnedPaise - totalReceiptsPaise;
    const isCreditBalance = totalReceiptsPaise > totalEarnedPaise;

    return {
      totalEntries: entries.length,
      totalEarnedPaise,
      totalEarnedRupees: Math.round(totalEarnedPaise / 100),
      totalPaymentsPaise,
      totalPaymentsRupees: Math.round(totalPaymentsPaise / 100),
      totalAdvancesPaise,
      totalAdvancesRupees: Math.round(totalAdvancesPaise / 100),
      totalReceiptsPaise,
      totalReceiptsRupees: Math.round(totalReceiptsPaise / 100),
      outstandingBalancePaise,
      outstandingBalanceRupees: Math.round(outstandingBalancePaise / 100),
      isCreditBalance,
    };
  }
}
