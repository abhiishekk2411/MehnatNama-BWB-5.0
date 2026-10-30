import { z } from 'zod';

export const createLedgerEntrySchema = z.object({
  jobId: z.string().uuid('Valid Job ID is required'),
  type: z.enum(['PAYMENT', 'ADVANCE']),
  amountPaise: z.number().int().positive('Payment amount must be greater than zero (in paise)'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Payment date must be in YYYY-MM-DD format'),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'OTHER']).default('CASH'),
  note: z.string().trim().max(500).optional().nullable(),
});

export const updateLedgerEntrySchema = z.object({
  amountPaise: z.number().int().positive().optional(),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'OTHER']).optional(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const queryLedgerSchema = z.object({
  jobId: z.string().uuid().optional(),
  type: z.enum(['PAYMENT', 'ADVANCE']).optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateLedgerEntryInput = z.infer<typeof createLedgerEntrySchema>;
export type UpdateLedgerEntryInput = z.infer<typeof updateLedgerEntrySchema>;
export type QueryLedgerInput = z.infer<typeof queryLedgerSchema>;
