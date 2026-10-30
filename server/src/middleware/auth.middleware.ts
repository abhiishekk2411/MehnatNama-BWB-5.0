import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError } from '../utils/errors.js';
import { Worker } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  worker?: Omit<Worker, 'passwordHash'>;
}

interface JwtPayload {
  workerId: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid format');
    }

    const token = authHeader.split(' ')[1];
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }

    const worker = await prisma.worker.findUnique({
      where: { id: decoded.workerId },
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
        updatedAt: true,
      },
    });

    if (!worker) {
      throw new UnauthorizedError('Worker account no longer exists');
    }

    req.worker = worker as unknown as Omit<Worker, 'passwordHash'>;
    next();
  } catch (error) {
    next(error);
  }
}
