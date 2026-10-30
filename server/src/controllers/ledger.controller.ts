import { Response, NextFunction } from 'express';
import { LedgerService } from '../services/ledger.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import type { QueryLedgerInput } from '../validation/ledger.schema.js';

export class LedgerController {
  static async listEntries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters = req.query as unknown as QueryLedgerInput;
      const entries = await LedgerService.listEntries(req.user!.id, filters);
      res.status(200).json({
        success: true,
        count: entries.length,
        entries,
      });
    } catch (error) {
      next(error);
    }
  }

  static async recordEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const entry = await LedgerService.recordEntry(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: `${entry.type === 'ADVANCE' ? 'Advance' : 'Payment'} recorded successfully.`,
        entry,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEntryById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const entry = await LedgerService.getEntryById(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        entry,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const entry = await LedgerService.updateEntry(req.user!.id, req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: 'Transaction updated successfully.',
        entry,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters = req.query as unknown as QueryLedgerInput;
      const summary = await LedgerService.getLedgerSummary(req.user!.id, filters);
      res.status(200).json({
        success: true,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
