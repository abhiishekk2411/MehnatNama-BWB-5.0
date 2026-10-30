import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { RegisterInput, LoginInput } from '../validation/auth.schema.js';

export class AuthService {
  static async register(input: RegisterInput) {
    const existing = await prisma.worker.findUnique({
      where: { phone: input.phone },
    });

    if (existing) {
      throw new ConflictError('A worker with this mobile number is already registered. Please login.');
    }

    if (input.email) {
      const existingEmail = await prisma.worker.findUnique({
        where: { email: input.email },
      });
      if (existingEmail) {
        throw new ConflictError('An account with this email address already exists.');
      }
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const worker = await prisma.worker.create({
      data: {
        phone: input.phone,
        email: input.email || null,
        passwordHash,
        fullName: input.fullName,
        trade: input.trade,
        stateCode: input.stateCode,
        district: input.district || null,
        preferredLang: input.preferredLang,
      },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        trade: true,
        stateCode: true,
        district: true,
        preferredLang: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ workerId: worker.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return { token, worker };
  }

  static async login(input: LoginInput) {
    const worker = await prisma.worker.findUnique({
      where: { phone: input.phone },
    });

    if (!worker) {
      throw new UnauthorizedError('Invalid mobile number or password.');
    }

    const isMatch = await bcrypt.compare(input.password, worker.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid mobile number or password.');
    }

    const token = jwt.sign({ workerId: worker.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return {
      token,
      worker: {
        id: worker.id,
        phone: worker.phone,
        email: worker.email,
        fullName: worker.fullName,
        trade: worker.trade,
        stateCode: worker.stateCode,
        district: worker.district,
        preferredLang: worker.preferredLang,
        createdAt: worker.createdAt,
      },
    };
  }

  static async getProfile(workerId: string) {
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        trade: true,
        stateCode: true,
        district: true,
        preferredLang: true,
        createdAt: true,
        _count: {
          select: {
            jobs: true,
            workLogs: true,
            payments: true,
          },
        },
      },
    });

    if (!worker) {
      throw new NotFoundError('Worker profile not found');
    }

    return worker;
  }
}
