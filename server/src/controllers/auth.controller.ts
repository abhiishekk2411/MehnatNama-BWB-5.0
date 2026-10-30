import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const COOKIE_NAME = 'mehnatnama_token';

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user } = await AuthService.register(req.body);
      setAuthCookie(res, token);
      res.status(201).json({
        success: true,
        message: 'Worker account created successfully.',
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user } = await AuthService.login(req.body);
      setAuthCookie(res, token);
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      clearAuthCookie(res);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
