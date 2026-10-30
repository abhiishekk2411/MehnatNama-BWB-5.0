import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError } from '../utils/errors.js';
import type { User, WorkerProfile } from '@prisma/client';

export interface AuthenticatedUser extends Omit<User, 'pinHash'> {
  profile: WorkerProfile | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface JwtPayload {
  userId: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check HttpOnly cookie first
    if (req.cookies && req.cookies.mehnatnama_token) {
      token = req.cookies.mehnatnama_token;
    }

    // 2. Fall back to Authorization: Bearer <token>
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required. Please login with your mobile and PIN.');
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication session. Please login again.');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError('Worker account not found.');
    }

    // Remove sensitive pinHash from attached user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pinHash: _pinHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    next(error);
  }
}
