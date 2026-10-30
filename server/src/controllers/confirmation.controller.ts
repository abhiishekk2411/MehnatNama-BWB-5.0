import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { ConfirmationService } from '../services/confirmation.service.js';
import {
  createConfirmationRequestSchema,
  contractorBatchResponseSchema,
} from '../validation/confirmation.schema.js';

export class ConfirmationController {
  /**
   * POST /api/confirmations - Worker creates a confirmation request
   */
  static async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = createConfirmationRequestSchema.parse(req.body);
      const result = await ConfirmationService.createRequest(req.user!.id, validated);
      res.status(201).json({
        success: true,
        message: 'Confirmation request created successfully.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/confirmations - Worker gets all their confirmation requests
   */
  static async getRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requests = await ConfirmationService.getWorkerRequests(req.user!.id);
      res.status(200).json({
        success: true,
        requests,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/confirmations/:id - Worker gets a specific confirmation request
   */
  static async getRequestById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const request = await ConfirmationService.getRequestById(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        request,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/confirmations/:id/revoke - Worker revokes an active link
   */
  static async revokeRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const request = await ConfirmationService.revokeRequest(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        message: 'Confirmation link revoked successfully.',
        request,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // PUBLIC CONTRACTOR PORTAL ENDPOINTS
  // ==========================================

  /**
   * GET /api/public/confirmations/:token - Public view for contractor (Zero login)
   */
  static async getPublicRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.params.token as string;
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const data = await ConfirmationService.getPublicRequest(token, ip, userAgent);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/public/confirmations/:token/respond - Public submit by contractor (Zero login)
   */
  static async submitPublicResponse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.params.token as string;
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const validated = contractorBatchResponseSchema.parse(req.body);

      const result = await ConfirmationService.submitPublicResponse(token, validated, ip);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
