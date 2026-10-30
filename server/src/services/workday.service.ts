import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';
import type { CreateWorkDayInput, UpdateWorkDayInput, QueryWorkDayInput } from '../validation/workday.schema.js';

export class WorkDayService {
  static async listWorkDays(userId: string, filters?: QueryWorkDayInput) {
    const where: any = { userId };

    if (filters?.jobId) {
      where.jobId = filters.jobId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.month) {
      // Month format: YYYY-MM
      const [year, month] = filters.month.split('-').map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0));
      where.workDate = {
        gte: start,
        lte: end,
      };
    } else if (filters?.startDate || filters?.endDate) {
      where.workDate = {};
      if (filters.startDate) {
        where.workDate.gte = new Date(filters.startDate + 'T00:00:00Z');
      }
      if (filters.endDate) {
        where.workDate.lte = new Date(filters.endDate + 'T00:00:00Z');
      }
    }

    const workDays = await prisma.workDay.findMany({
      where,
      orderBy: { workDate: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            contractorName: true,
            workLocation: true,
            agreedDailyRatePaise: true,
          },
        },
      },
    });

    return workDays;
  }

  static async recordWorkDay(userId: string, input: CreateWorkDayInput) {
    // 1. Verify job exists and belongs to the user
    const job = await prisma.job.findUnique({
      where: { id: input.jobId },
    });

    if (!job) {
      throw new NotFoundError('Selected job does not exist.');
    }

    if (job.userId !== userId) {
      throw new ForbiddenError('You do not have permission to log work for this job.');
    }

    // Parse date cleanly as UTC midnight to avoid timezone shifting
    const workDate = new Date(input.workDate + 'T00:00:00Z');

    // 2. Prevent duplicate entries for the same job and date
    const existing = await prisma.workDay.findUnique({
      where: {
        jobId_workDate: {
          jobId: input.jobId,
          workDate,
        },
      },
    });

    if (existing) {
      throw new ConflictError(
        'A workday record for this site and date already exists. You can edit the existing entry.'
      );
    }

    // 3. Snapshot daily rate and compute earned amount on server
    const dailyRateSnapshotPaise = job.agreedDailyRatePaise;
    let earnedAmountPaise = 0;

    if (input.status === 'FULL_DAY') {
      earnedAmountPaise = dailyRateSnapshotPaise;
    } else if (input.status === 'HALF_DAY') {
      earnedAmountPaise = Math.round(dailyRateSnapshotPaise / 2);
    } else if (input.status === 'ABSENT') {
      earnedAmountPaise = 0;
    }

    // 4. Create record
    const workDay = await prisma.workDay.create({
      data: {
        userId,
        jobId: input.jobId,
        workDate,
        status: input.status,
        dailyRateSnapshotPaise,
        earnedAmountPaise,
        overtimeMinutes: input.overtimeMinutes || 0,
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

    // 5. Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: 'WORKDAY',
        entityId: workDay.id,
        action: 'CREATE',
        newValues: workDay as any,
      },
    });

    return workDay;
  }

  static async getWorkDayById(userId: string, workDayId: string) {
    const workDay = await prisma.workDay.findUnique({
      where: { id: workDayId },
      include: {
        job: true,
      },
    });

    if (!workDay) {
      throw new NotFoundError('Workday record not found.');
    }

    if (workDay.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this record.');
    }

    return workDay;
  }

  static async updateWorkDay(userId: string, workDayId: string, input: UpdateWorkDayInput) {
    const existing = await prisma.workDay.findUnique({
      where: { id: workDayId },
    });

    if (!existing) {
      throw new NotFoundError('Workday record not found.');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this record.');
    }

    let earnedAmountPaise = existing.earnedAmountPaise;

    // Recalculate earned amount if status changed, using the PRESERVED daily rate snapshot!
    if (input.status && input.status !== existing.status) {
      if (input.status === 'FULL_DAY') {
        earnedAmountPaise = existing.dailyRateSnapshotPaise;
      } else if (input.status === 'HALF_DAY') {
        earnedAmountPaise = Math.round(existing.dailyRateSnapshotPaise / 2);
      } else if (input.status === 'ABSENT') {
        earnedAmountPaise = 0;
      }
    }

    const updated = await prisma.workDay.update({
      where: { id: workDayId },
      data: {
        ...(input.status && { status: input.status, earnedAmountPaise }),
        ...(input.overtimeMinutes !== undefined && { overtimeMinutes: input.overtimeMinutes }),
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
        entityType: 'WORKDAY',
        entityId: workDayId,
        action: 'UPDATE',
        oldValues: existing as any,
        newValues: updated as any,
      },
    });

    return updated;
  }

  static async getWorkDaysSummary(userId: string, filters?: QueryWorkDayInput) {
    const workDays = await this.listWorkDays(userId, filters);

    let fullDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let totalEarnedPaise = 0;
    let totalOvertimeMinutes = 0;

    for (const wd of workDays) {
      if (wd.status === 'FULL_DAY') fullDays += 1;
      else if (wd.status === 'HALF_DAY') halfDays += 1;
      else if (wd.status === 'ABSENT') absentDays += 1;

      totalEarnedPaise += wd.earnedAmountPaise;
      totalOvertimeMinutes += wd.overtimeMinutes;
    }

    const totalDaysWorked = fullDays + halfDays * 0.5;

    return {
      totalEntries: workDays.length,
      totalDaysWorked,
      fullDays,
      halfDays,
      absentDays,
      totalEarnedPaise,
      totalEarnedRupees: Math.round(totalEarnedPaise / 100),
      totalOvertimeMinutes,
      totalOvertimeHours: (totalOvertimeMinutes / 60).toFixed(1),
    };
  }
}
