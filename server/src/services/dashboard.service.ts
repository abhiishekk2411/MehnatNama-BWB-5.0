import { prisma } from '../config/database.js';

export class DashboardService {
  static async getSummary(userId: string) {
    // 1. Workdays & Earnings
    const workDays = await prisma.workDay.findMany({
      where: { userId },
      select: {
        earnedAmountPaise: true,
        status: true,
        workDate: true,
      },
    });

    const totalEarnedPaise = workDays.reduce((acc, curr) => acc + curr.earnedAmountPaise, 0);

    const workingDaysCount = workDays.reduce((acc, curr) => {
      if (curr.status === 'FULL_DAY') return acc + 1;
      if (curr.status === 'HALF_DAY') return acc + 0.5;
      return acc;
    }, 0);

    // 2. Payments & Advances
    const ledger = await prisma.ledgerEntry.findMany({
      where: { userId },
      select: {
        amountPaise: true,
        type: true,
      },
    });

    const paymentsReceivedPaise = ledger
      .filter((l) => l.type === 'PAYMENT')
      .reduce((acc, curr) => acc + curr.amountPaise, 0);

    const advancesReceivedPaise = ledger
      .filter((l) => l.type === 'ADVANCE')
      .reduce((acc, curr) => acc + curr.amountPaise, 0);

    const totalReceiptsPaise = paymentsReceivedPaise + advancesReceivedPaise;
    const outstandingBalancePaise = totalEarnedPaise - totalReceiptsPaise;
    const isCreditBalance = totalReceiptsPaise > totalEarnedPaise;

    // 3. Active Jobs
    const activeJobs = await prisma.job.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 2,
    });

    const totalJobsCount = await prisma.job.count({ where: { userId } });
    const activeJobsCount = await prisma.job.count({ where: { userId, status: 'ACTIVE' } });

    // 4. Return complete summary
    return {
      financials: {
        totalEarnedPaise,
        totalEarnedRupees: Math.round(totalEarnedPaise / 100),
        paymentsReceivedPaise,
        paymentsReceivedRupees: Math.round(paymentsReceivedPaise / 100),
        advancesReceivedPaise,
        advancesReceivedRupees: Math.round(advancesReceivedPaise / 100),
        totalReceiptsPaise,
        totalReceiptsRupees: Math.round(totalReceiptsPaise / 100),
        outstandingBalancePaise,
        outstandingBalanceRupees: Math.round(outstandingBalancePaise / 100),
        isCreditBalance,
        workingDaysCount,
      },
      jobs: {
        activeCount: activeJobsCount,
        totalCount: totalJobsCount,
        activeList: activeJobs.map((j) => ({
          id: j.id,
          name: j.jobTitle,
          contractor: j.contractorName,
          dailyWage: Math.round(j.agreedDailyRatePaise / 100),
          dailyWagePaise: j.agreedDailyRatePaise,
          status: j.status.toLowerCase(),
          location: j.workLocation || '',
        })),
      },
      // Phase 4 Confirmation placeholder
      confirmations: {
        confirmed: 10,
        disputed: 2,
        pending: 3,
      },
    };
  }

  static async getActivity(userId: string) {
    // 1. Fetch recent workdays (latest 5)
    const recentWorkDays = await prisma.workDay.findMany({
      where: { userId },
      orderBy: { workDate: 'desc' },
      take: 5,
      include: {
        job: {
          select: {
            jobTitle: true,
          },
        },
      },
    });

    // 2. Fetch recent ledger transactions (latest 5)
    const recentLedger = await prisma.ledgerEntry.findMany({
      where: { userId },
      orderBy: { paymentDate: 'desc' },
      take: 5,
      include: {
        job: {
          select: {
            jobTitle: true,
          },
        },
      },
    });

    // 3. Transform to unified activity list
    const activities = [
      ...recentWorkDays.map((wd) => {
        const dateStr = wd.workDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const statusLabel =
          wd.status === 'FULL_DAY'
            ? 'Full Day'
            : wd.status === 'HALF_DAY'
            ? 'Half Day'
            : 'Absent';
        const statusHindi =
          wd.status === 'FULL_DAY'
            ? 'पूरा दिन'
            : wd.status === 'HALF_DAY'
            ? 'आधा दिन'
            : 'छुट्टी';

        return {
          id: `wd-${wd.id}`,
          timestamp: wd.workDate.getTime(),
          date: dateStr,
          activity:
            wd.status === 'FULL_DAY'
              ? 'Full day recorded'
              : wd.status === 'HALF_DAY'
              ? 'Half day recorded'
              : 'Absent marked',
          hindiActivity:
            wd.status === 'FULL_DAY'
              ? 'पूरा दिन काम दर्ज'
              : wd.status === 'HALF_DAY'
              ? 'आधा दिन काम दर्ज'
              : 'छुट्टी दर्ज',
          job: wd.job.jobTitle,
          amountOrDetails: `₹${(wd.earnedAmountPaise / 100).toLocaleString('en-IN')}`,
          status: wd.status.toLowerCase().replace('_', '-'),
          statusLabel,
          statusHindi,
          type: 'work' as const,
        };
      }),
      ...recentLedger.map((le) => {
        const dateStr = le.paymentDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const isAdvance = le.type === 'ADVANCE';

        return {
          id: `le-${le.id}`,
          timestamp: le.paymentDate.getTime(),
          date: dateStr,
          activity: isAdvance ? 'Advance recorded' : 'Payment received',
          hindiActivity: isAdvance ? 'खर्चा / पेशगी दर्ज' : 'भुगतान प्राप्त हुआ',
          job: le.job.jobTitle,
          amountOrDetails: `₹${(le.amountPaise / 100).toLocaleString('en-IN')}`,
          status: isAdvance ? 'advance' : 'paid',
          statusLabel: isAdvance ? 'Advance' : 'Received',
          statusHindi: isAdvance ? 'खर्चा' : 'प्राप्त',
          type: isAdvance ? ('advance' as const) : ('payment' as const),
        };
      }),
    ];

    // Sort combined activities by timestamp descending
    activities.sort((a, b) => b.timestamp - a.timestamp);

    return activities.slice(0, 10);
  }
}
