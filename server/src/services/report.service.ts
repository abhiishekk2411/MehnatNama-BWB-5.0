import { prisma } from '../config/database.js';

export interface ReportGenerationInput {
  jobId?: string;
  startDate?: string;
  endDate?: string;
  language?: 'hi' | 'en';
}

export class ReportService {
  /**
   * Compiles complete structured report data with confirmation statuses, ledger figures, and benchmark references.
   */
  static async generateReportData(userId: string, input: ReportGenerationInput) {
    // 1. Fetch worker profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      const error: any = new Error('Worker user not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Query jobs
    const jobWhere: any = { userId };
    if (input.jobId) jobWhere.id = input.jobId;

    const jobs = await prisma.job.findMany({
      where: jobWhere,
      include: {
        workDays: {
          where: {
            ...(input.startDate || input.endDate
              ? {
                  workDate: {
                    ...(input.startDate ? { gte: new Date(input.startDate) } : {}),
                    ...(input.endDate ? { lte: new Date(input.endDate) } : {}),
                  },
                }
              : {}),
          },
          include: {
            confirmationItems: {
              include: {
                responses: {
                  orderBy: { submittedAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: { workDate: 'asc' },
        },
        ledgerEntries: {
          where: {
            ...(input.startDate || input.endDate
              ? {
                  paymentDate: {
                    ...(input.startDate ? { gte: new Date(input.startDate) } : {}),
                    ...(input.endDate ? { lte: new Date(input.endDate) } : {}),
                  },
                }
              : {}),
          },
          orderBy: { paymentDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Aggregate totals
    let totalWorkingDays = 0;
    let fullDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let totalEarnedPaise = 0;
    let totalPaymentsPaise = 0;
    let totalAdvancesPaise = 0;
    let confirmedDays = 0;
    let disputedDays = 0;
    let pendingDays = 0;

    const formattedJobs = jobs.map((job) => {
      let jobEarnedPaise = 0;
      let jobPaymentsPaise = 0;
      let jobAdvancesPaise = 0;

      const workDaysSummary = job.workDays.map((wd) => {
        totalWorkingDays++;
        if (wd.status === 'FULL_DAY') fullDays++;
        else if (wd.status === 'HALF_DAY') halfDays++;
        else absentDays++;

        totalEarnedPaise += wd.earnedAmountPaise;
        jobEarnedPaise += wd.earnedAmountPaise;

        // Determine confirmation status
        let confirmationStatus: 'CONFIRMED' | 'DISPUTED' | 'UNANSWERED' | 'NOT_REQUESTED' =
          'NOT_REQUESTED';
        let disputeReason: string | null = null;

        const latestItem = wd.confirmationItems[0];
        if (latestItem) {
          if (latestItem.status === 'CONFIRMED') {
            confirmationStatus = 'CONFIRMED';
            confirmedDays++;
          } else if (latestItem.status === 'DISPUTED') {
            confirmationStatus = 'DISPUTED';
            disputedDays++;
            disputeReason = latestItem.responses[0]?.disputeReason || null;
          } else {
            confirmationStatus = 'UNANSWERED';
            pendingDays++;
          }
        }

        return {
          id: wd.id,
          workDate: wd.workDate.toISOString().split('T')[0],
          status: wd.status,
          dailyRateSnapshotPaise: wd.dailyRateSnapshotPaise,
          earnedAmountPaise: wd.earnedAmountPaise,
          overtimeMinutes: wd.overtimeMinutes,
          note: wd.note,
          confirmationStatus,
          disputeReason,
        };
      });

      job.ledgerEntries.forEach((entry) => {
        if (entry.type === 'PAYMENT') {
          totalPaymentsPaise += entry.amountPaise;
          jobPaymentsPaise += entry.amountPaise;
        } else {
          totalAdvancesPaise += entry.amountPaise;
          jobAdvancesPaise += entry.amountPaise;
        }
      });

      const jobReceiptsPaise = jobPaymentsPaise + jobAdvancesPaise;
      const jobBalanceDuePaise = jobEarnedPaise - jobReceiptsPaise;

      return {
        id: job.id,
        jobTitle: job.jobTitle,
        contractorName: job.contractorName,
        contractorPhone: job.contractorPhone,
        workLocation: job.workLocation,
        workCategory: job.workCategory,
        skillLevel: job.skillLevel,
        agreedDailyRatePaise: job.agreedDailyRatePaise,
        workDays: workDaysSummary,
        ledgerEntries: job.ledgerEntries.map((l) => ({
          id: l.id,
          type: l.type,
          amountPaise: l.amountPaise,
          paymentDate: l.paymentDate.toISOString().split('T')[0],
          paymentMode: l.paymentMode,
          note: l.note,
        })),
        totals: {
          jobEarnedPaise,
          jobPaymentsPaise,
          jobAdvancesPaise,
          jobReceiptsPaise,
          jobBalanceDuePaise,
        },
      };
    });

    const totalReceiptsPaise = totalPaymentsPaise + totalAdvancesPaise;
    const netRecordedBalancePaise = totalEarnedPaise - totalReceiptsPaise;

    // 4. Look up applicable benchmark reference for state
    const stateCode = 'MH'; // Default worker state
    const benchmarkRef = await prisma.minimumWageRule.findFirst({
      where: { state: { contains: 'Maharashtra', mode: 'insensitive' } },
      orderBy: { effectiveFrom: 'desc' },
    });

    return {
      reportId: `MN-${Date.now().toString(36).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      language: input.language || 'hi',
      branding: {
        product: 'MehnatNama (मेहनतनामा)',
        tagline: 'Har din ka kaam. Har rupaye ka hisaab.',
        reportTitle: 'Wage Diary & Financial Statement (मेहनतनामा - कार्य व देय हिसाब पर्चा)',
      },
      worker: {
        fullName: user.profile?.fullName || 'Worker',
        phone: user.phone,
        workerType: user.profile?.workerType || 'Construction',
        skillLevel: user.profile?.skillLevel || 'SKILLED',
      },
      dateRange: {
        startDate: input.startDate || 'All recorded dates',
        endDate: input.endDate || 'Present',
      },
      summary: {
        totalWorkingDays,
        fullDays,
        halfDays,
        absentDays,
        totalEarnedPaise,
        totalEarnedRupees: totalEarnedPaise / 100,
        totalPaymentsPaise,
        totalPaymentsRupees: totalPaymentsPaise / 100,
        totalAdvancesPaise,
        totalAdvancesRupees: totalAdvancesPaise / 100,
        totalReceiptsPaise,
        totalReceiptsRupees: totalReceiptsPaise / 100,
        netRecordedBalancePaise,
        netRecordedBalanceRupees: netRecordedBalancePaise / 100,
        confirmedDays,
        disputedDays,
        pendingDays,
      },
      benchmarkReference: benchmarkRef
        ? {
            state: benchmarkRef.state,
            category: benchmarkRef.employmentCategory,
            ratePerDayRupees: (benchmarkRef.baseRatePaise + benchmarkRef.variableAllowancePaise) / 100,
            notificationRef: benchmarkRef.sourceReference,
            officialSource: benchmarkRef.officialSourceUrl,
          }
        : null,
      jobs: formattedJobs,
      disclaimer:
        'This document is a worker-maintained structured wage diary and ledger statement generated via MehnatNama. It does not constitute a legal adjudication or guarantee of wages owed. Unconfirmed entries reflect worker-recorded workdays. Verified entries reflect link-based contractor acknowledgements.',
    };
  }
}
