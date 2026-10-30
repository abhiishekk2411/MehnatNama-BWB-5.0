import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class DashboardController {
  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getSummary(req.user!.id);
      res.status(200).json({
        success: true,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const activities = await DashboardService.getActivity(req.user!.id);
      res.status(200).json({
        success: true,
        count: activities.length,
        activities,
      });
    } catch (error) {
      next(error);
    }
  }
}
