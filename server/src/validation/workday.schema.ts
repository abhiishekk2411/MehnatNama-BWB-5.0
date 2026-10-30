import { z } from 'zod';

export const createWorkDaySchema = z.object({
  jobId: z.string().uuid('Valid Job ID is required'),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Work date must be in YYYY-MM-DD format'),
  status: z.enum(['FULL_DAY', 'HALF_DAY', 'ABSENT']).default('FULL_DAY'),
  overtimeMinutes: z.number().int().min(0, 'Overtime cannot be negative').default(0),
  note: z.string().trim().max(500).optional().nullable(),
});

export const updateWorkDaySchema = z.object({
  status: z.enum(['FULL_DAY', 'HALF_DAY', 'ABSENT']).optional(),
  overtimeMinutes: z.number().int().min(0).optional(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const queryWorkDaySchema = z.object({
  jobId: z.string().uuid().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['FULL_DAY', 'HALF_DAY', 'ABSENT']).optional(),
});

export type CreateWorkDayInput = z.infer<typeof createWorkDaySchema>;
export type UpdateWorkDayInput = z.infer<typeof updateWorkDaySchema>;
export type QueryWorkDayInput = z.infer<typeof queryWorkDaySchema>;
