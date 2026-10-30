import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await AuthService.getProfile(req.user!.id);
      res.status(200).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await AuthService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
