import { z } from 'zod';

export const createWageRuleSchema = z.object({
  state: z.string().trim().min(2).max(50),
  zone: z.string().trim().default('Zone A'),
  employmentCategory: z.string().trim().min(2).max(150),
  skillLevel: z.enum(['UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED']),
  wagePeriod: z.enum(['DAILY', 'MONTHLY']).default('DAILY'),
  baseRatePaise: z.number().int().positive('Base rate must be greater than zero'),
  variableAllowancePaise: z.number().int().nonnegative().default(0),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notificationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  officialSourceUrl: z.string().url('Valid official source URL required'),
  sourceReference: z.string().trim().min(2).max(255),
  verificationStatus: z.enum(['VERIFIED', 'UNDER_REVIEW']).default('VERIFIED'),
});

export const updateWageRuleSchema = createWageRuleSchema.partial();

export const calculateWageCheckSchema = z.object({
  jobId: z.string().uuid().optional(),
  state: z.string().trim().min(2),
  zone: z.string().trim().default('Zone A'),
  employmentCategory: z.string().trim().min(2),
  skillLevel: z.enum(['UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED']),
  comparisonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  // Manual agreed daily rate in paise (if not pulled from an existing job)
  agreedDailyRatePaise: z.number().int().positive().optional(),
  daysWorkedCount: z.number().int().positive().optional(),
});

export type CreateWageRuleInput = z.infer<typeof createWageRuleSchema>;
export type UpdateWageRuleInput = z.infer<typeof updateWageRuleSchema>;
export type CalculateWageCheckInput = z.infer<typeof calculateWageCheckSchema>;
