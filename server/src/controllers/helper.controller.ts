import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { HelperAccessService } from '../services/helper.service.js';
import { createSharedAccessSchema } from '../validation/helper.schema.js';

export class HelperController {
  static async createAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = createSharedAccessSchema.parse(req.body);
      const result = await HelperAccessService.createAccess(req.user!.id, validated);
      res.status(201).json({
        success: true,
        message: 'Helper access link created successfully.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAccesses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accesses = await HelperAccessService.getWorkerAccesses(req.user!.id);
      res.status(200).json({
        success: true,
        accesses,
      });
    } catch (error) {
      next(error);
    }
  }

  static async revokeAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const access = await HelperAccessService.revokeAccess(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        message: 'Helper access link revoked.',
        access,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicSharedReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.params.token as string;
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const data = await HelperAccessService.getPublicSharedReport(token, ip, userAgent);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
