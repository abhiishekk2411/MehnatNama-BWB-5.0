import { prisma } from '../config/database.js';
import type {
  CreateWageRuleInput,
  UpdateWageRuleInput,
  CalculateWageCheckInput,
} from '../validation/wage.schema.js';

export class WageBenchmarkService {
  /**
   * List verified wage rules with optional filtering
   */
  static async getRules(filters?: {
    state?: string;
    employmentCategory?: string;
    skillLevel?: any;
    verifiedOnly?: boolean;
  }) {
    const where: any = {};
    if (filters?.state) where.state = { contains: filters.state, mode: 'insensitive' };
    if (filters?.employmentCategory)
      where.employmentCategory = { contains: filters.employmentCategory, mode: 'insensitive' };
    if (filters?.skillLevel) where.skillLevel = filters.skillLevel;
    if (filters?.verifiedOnly) where.verificationStatus = 'VERIFIED';

    return await prisma.minimumWageRule.findMany({
      where,
      orderBy: [{ state: 'asc' }, { skillLevel: 'asc' }, { effectiveFrom: 'desc' }],
    });
  }

  /**
   * Get single wage rule by ID
   */
  static async getRuleById(id: string) {
    const rule = await prisma.minimumWageRule.findUnique({
      where: { id },
    });
    if (!rule) {
      const error: any = new Error('Minimum wage benchmark rule not found');
      error.statusCode = 404;
      throw error;
    }
    return rule;
  }

  /**
   * Add a curated wage rule (Admin/System)
   */
  static async createRule(input: CreateWageRuleInput) {
    return await prisma.minimumWageRule.create({
      data: {
        state: input.state,
        zone: input.zone,
        employmentCategory: input.employmentCategory,
        skillLevel: input.skillLevel,
        wagePeriod: input.wagePeriod,
        baseRatePaise: input.baseRatePaise,
        variableAllowancePaise: input.variableAllowancePaise,
        effectiveFrom: new Date(input.effectiveFrom),
        effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
        notificationDate: new Date(input.notificationDate),
        officialSourceUrl: input.officialSourceUrl,
        sourceReference: input.sourceReference,
        verificationStatus: input.verificationStatus,
        verifiedAt: input.verificationStatus === 'VERIFIED' ? new Date() : null,
      },
    });
  }

  /**
   * Update a curated wage rule
   */
  static async updateRule(id: string, input: UpdateWageRuleInput) {
    const data: any = { ...input };
    if (input.effectiveFrom) data.effectiveFrom = new Date(input.effectiveFrom);
    if (input.effectiveTo !== undefined)
      data.effectiveTo = input.effectiveTo ? new Date(input.effectiveTo) : null;
    if (input.notificationDate) data.notificationDate = new Date(input.notificationDate);
    if (input.verificationStatus === 'VERIFIED') data.verifiedAt = new Date();

    return await prisma.minimumWageRule.update({
      where: { id },
      data,
    });
  }

  /**
   * Calculate statutory minimum wage comparison
   * Compares worker's recorded daily rate against the applicable gazette benchmark.
   */
  static async calculateComparison(userId: string, input: CalculateWageCheckInput) {
    const comparisonDate = input.comparisonDate
      ? new Date(input.comparisonDate)
      : new Date();

    // 1. Fetch matching wage rule applicable for the comparison date
    const rule = await prisma.minimumWageRule.findFirst({
      where: {
        state: { equals: input.state, mode: 'insensitive' },
        employmentCategory: { equals: input.employmentCategory, mode: 'insensitive' },
        skillLevel: input.skillLevel,
        verificationStatus: 'VERIFIED',
        effectiveFrom: { lte: comparisonDate },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: comparisonDate } }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!rule) {
      return {
        matched: false,
        message: `No verified minimum wage gazette notification found for ${input.state} (${input.employmentCategory} - ${input.skillLevel}) on ${comparisonDate.toISOString().split('T')[0]}.`,
        disclaimer:
          'This is an indicative comparison using available official wage information. It is not a legal determination of wages owed. Actual entitlements depend on employment classification and applicable state rules.',
      };
    }

    // 2. Total statutory benchmark rate = baseRate + variableAllowance
    const benchmarkDailyRatePaise = rule.baseRatePaise + rule.variableAllowancePaise;

    // 3. Determine worker's rate and days worked
    let agreedDailyRatePaise = input.agreedDailyRatePaise || 0;
    let daysCount = input.daysWorkedCount || 1;
    let jobTitle = 'Custom Comparison';

    if (input.jobId) {
      const job = await prisma.job.findFirst({
        where: { id: input.jobId, userId },
        include: {
          _count: {
            select: { workDays: true },
          },
        },
      });

      if (job) {
        agreedDailyRatePaise = job.agreedDailyRatePaise;
        daysCount = job._count.workDays || 1;
        jobTitle = job.jobTitle;
      }
    }

    const differencePerDayPaise = agreedDailyRatePaise - benchmarkDailyRatePaise;
    const totalBenchmarkEarningsPaise = benchmarkDailyRatePaise * daysCount;
    const totalAgreedEarningsPaise = agreedDailyRatePaise * daysCount;
    const cumulativeDifferencePaise = totalAgreedEarningsPaise - totalBenchmarkEarningsPaise;

    const isBelowBenchmark = differencePerDayPaise < 0;

    return {
      matched: true,
      jobTitle,
      comparisonDate: comparisonDate.toISOString().split('T')[0],
      rule: {
        id: rule.id,
        state: rule.state,
        zone: rule.zone,
        employmentCategory: rule.employmentCategory,
        skillLevel: rule.skillLevel,
        baseRatePaise: rule.baseRatePaise,
        variableAllowancePaise: rule.variableAllowancePaise,
        totalBenchmarkDailyRatePaise: benchmarkDailyRatePaise,
        totalBenchmarkDailyRateRupees: benchmarkDailyRatePaise / 100,
        effectiveFrom: rule.effectiveFrom.toISOString().split('T')[0],
        notificationDate: rule.notificationDate.toISOString().split('T')[0],
        sourceReference: rule.sourceReference,
        officialSourceUrl: rule.officialSourceUrl,
      },
      worker: {
        agreedDailyRatePaise,
        agreedDailyRateRupees: agreedDailyRatePaise / 100,
        daysCount,
      },
      comparison: {
        differencePerDayPaise,
        differencePerDayRupees: differencePerDayPaise / 100,
        cumulativeDifferencePaise,
        cumulativeDifferenceRupees: cumulativeDifferencePaise / 100,
        isBelowBenchmark,
        status: isBelowBenchmark ? 'BELOW_STATUTORY_MINIMUM' : 'MEETS_OR_EXCEEDS_BENCHMARK',
        hindiStatus: isBelowBenchmark
          ? 'सरकारी न्यूनतम मजदूरी से कम'
          : 'न्यूनतम मानक के अनुसार या अधिक',
      },
      disclaimer:
        'This is an indicative comparison using available official wage information. It is not a legal determination of wages owed. Actual entitlements may depend on applicable employment classification, working hours, wage components and other legal rules.',
    };
  }
}
