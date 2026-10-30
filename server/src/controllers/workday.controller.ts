import { Response, NextFunction } from 'express';
import { WorkDayService } from '../services/workday.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import type { QueryWorkDayInput } from '../validation/workday.schema.js';

export class WorkDayController {
  static async listWorkDays(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters = req.query as unknown as QueryWorkDayInput;
      const workDays = await WorkDayService.listWorkDays(req.user!.id, filters);
      res.status(200).json({
        success: true,
        count: workDays.length,
        workDays,
      });
    } catch (error) {
      next(error);
    }
  }

  static async recordWorkDay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const workDay = await WorkDayService.recordWorkDay(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Workday recorded successfully.',
        workDay,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWorkDayById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const workDay = await WorkDayService.getWorkDayById(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        workDay,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateWorkDay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const workDay = await WorkDayService.updateWorkDay(req.user!.id, req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: 'Workday record updated successfully.',
        workDay,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters = req.query as unknown as QueryWorkDayInput;
      const summary = await WorkDayService.getWorkDaysSummary(req.user!.id, filters);
      res.status(200).json({
        success: true,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
