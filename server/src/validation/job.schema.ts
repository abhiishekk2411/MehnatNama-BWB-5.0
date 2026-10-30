import { z } from 'zod';
import { phoneRegex } from './auth.schema.js';

export const createJobSchema = z.object({
  jobTitle: z.string().trim().min(2, 'Job title must be at least 2 characters').max(150),
  contractorName: z.string().trim().min(2, 'Contractor name must be at least 2 characters').max(100),
  contractorPhone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit contractor mobile number'),
  workLocation: z.string().trim().max(255).optional().nullable(),
  workCategory: z.string().trim().max(100).default('Construction'),
  skillLevel: z.enum(['UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED']).default('UNSKILLED'),
  agreedDailyRatePaise: z.number().int().positive('Agreed daily rate must be positive (in paise)'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  expectedEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional().nullable(),
});

export const updateJobSchema = z.object({
  jobTitle: z.string().trim().min(2).max(150).optional(),
  contractorName: z.string().trim().min(2).max(100).optional(),
  contractorPhone: z.string().trim().regex(phoneRegex).optional(),
  workLocation: z.string().trim().max(255).optional().nullable(),
  workCategory: z.string().trim().max(100).optional(),
  skillLevel: z.enum(['UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED']).optional(),
  agreedDailyRatePaise: z.number().int().positive().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expectedEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']).optional(),
});

export const updateJobStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
