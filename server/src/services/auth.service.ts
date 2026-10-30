import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validation/auth.schema.js';

export class AuthService {
  static async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { phone: input.phone },
    });

    if (existing) {
      throw new ConflictError('A worker with this mobile number is already registered. Please login.');
    }

    const pinHash = await bcrypt.hash(input.pin, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          phone: input.phone,
          pinHash,
        },
      });

      const profile = await tx.workerProfile.create({
        data: {
          userId: newUser.id,
          fullName: input.fullName,
          preferredLanguage: input.preferredLanguage,
          workerType: input.workerType,
          skillLevel: input.skillLevel,
        },
      });

      return {
        id: newUser.id,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
        profile,
      };
    });

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return { token, user };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { phone: input.phone },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid mobile number or PIN.');
    }

    const isMatch = await bcrypt.compare(input.pin, user.pinHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid mobile number or PIN.');
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        createdAt: user.createdAt,
        profile: user.profile,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            jobs: true,
            workDays: true,
            ledgerEntries: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('Worker account not found.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pinHash: _pinHash, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const existing = await prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundError('Worker profile not found.');
    }

    const updatedProfile = await prisma.workerProfile.update({
      where: { userId },
      data: {
        ...(input.fullName && { fullName: input.fullName }),
        ...(input.preferredLanguage && { preferredLanguage: input.preferredLanguage }),
        ...(input.workerType && { workerType: input.workerType }),
        ...(input.skillLevel && { skillLevel: input.skillLevel }),
        ...(input.profilePhotoUrl !== undefined && { profilePhotoUrl: input.profilePhotoUrl }),
      },
    });

    return updatedProfile;
  }
}
