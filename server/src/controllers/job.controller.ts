import { Response, NextFunction } from 'express';
import { JobService } from '../services/job.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import type { JobStatus } from '@prisma/client';

export class JobController {
  static async listJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as JobStatus | undefined;
      const search = req.query.search as string | undefined;

      const jobs = await JobService.listJobs(req.user!.id, { status, search });
      res.status(200).json({
        success: true,
        count: jobs.length,
        jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const job = await JobService.createJob(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'New job created successfully.',
        job,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getJobById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const job = await JobService.getJobById(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const job = await JobService.updateJob(req.user!.id, req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: 'Job details updated successfully.',
        job,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateJobStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const job = await JobService.updateJobStatus(req.user!.id, req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: `Job status updated to ${job.status}.`,
        job,
      });
    } catch (error) {
      next(error);
    }
  }
}
