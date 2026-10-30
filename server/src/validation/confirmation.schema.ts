import { z } from 'zod';

export const createConfirmationRequestSchema = z.object({
  jobId: z.string().uuid('Valid Job ID is required'),
  title: z.string().trim().max(150).optional(),
  note: z.string().trim().max(500).optional(),
  expiryDays: z.number().int().min(1).max(30).default(14),
  // Optional specific workday IDs; if omitted, all unconfirmed workdays for this job are included
  workDayIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const contractorResponseItemSchema = z.object({
  itemId: z.string().uuid('Valid item ID is required'),
  responseType: z.enum(['CONFIRMED', 'DISPUTED']),
  disputeReason: z.enum([
    'INCORRECT_WORKDAY',
    'INCORRECT_WAGE_RATE',
    'WORK_NOT_COMPLETED',
    'PAYMENT_ALREADY_MADE',
    'OTHER',
  ]).optional(),
  optionalComment: z.string().trim().max(500).optional(),
});

export const contractorBatchResponseSchema = z.object({
  responses: z.array(contractorResponseItemSchema).min(1, 'At least one item response is required'),
});

export type CreateConfirmationRequestInput = z.infer<typeof createConfirmationRequestSchema>;
export type ContractorBatchResponseInput = z.infer<typeof contractorBatchResponseSchema>;
