import { z } from 'zod';
import { WorkerTrade } from '@prisma/client';

export const registerSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  trade: z.nativeEnum(WorkerTrade).default(WorkerTrade.GENERAL_LABOUR),
  stateCode: z.string().trim().min(2).max(10).default('MH'),
  district: z.string().trim().optional(),
  preferredLang: z.enum(['hi', 'en']).default('hi'),
});

export const loginSchema = z.object({
  phone: z.string().trim().min(10, 'Valid mobile number required'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
