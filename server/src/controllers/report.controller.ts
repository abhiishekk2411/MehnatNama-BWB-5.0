import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { ReportService } from '../services/report.service.js';

export class ReportController {
  static async getReportData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { jobId, startDate, endDate, language } = req.query;
      const report = await ReportService.generateReportData(req.user!.id, {
        jobId: jobId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        language: (language as 'hi' | 'en') || 'hi',
      });

      res.status(200).json({
        success: true,
        report,
      });
    } catch (error) {
      next(error);
    }
  }
}
