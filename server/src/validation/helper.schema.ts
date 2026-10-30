import { z } from 'zod';

export const createSharedAccessSchema = z.object({
  jobId: z.string().uuid().optional(),
  helperName: z.string().trim().max(100).optional(),
  expiryDays: z.number().int().min(1).max(30).default(7),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateSharedAccessInput = z.infer<typeof createSharedAccessSchema>;
