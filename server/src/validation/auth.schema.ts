import { z } from 'zod';

export const phoneRegex = /^[6-9]\d{9}$/;

export const registerSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'),
  pin: z
    .string()
    .trim()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN cannot exceed 6 digits')
    .regex(/^\d+$/, 'PIN must contain numbers only'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  preferredLanguage: z.string().trim().default('hi'),
  workerType: z.string().trim().default('CONSTRUCTION'),
  skillLevel: z.enum(['UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED']).default('UNSKILLED'),
});

export const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  pin: z
    .string()
    .trim()
    .min(4, 'PIN must be at least 4 digits')
    .max(6, 'PIN cannot exceed 6 digits'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  preferredLanguage: z.string().trim().optional(),
  workerType: z.string().trim().optional(),
  skillLevel: z.enum(['UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED']).optional(),
  profilePhotoUrl: z.string().url().nullable().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
