import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { WageBenchmarkService } from '../services/wage.service.js';
import {
  createWageRuleSchema,
  updateWageRuleSchema,
  calculateWageCheckSchema,
} from '../validation/wage.schema.js';

export class WageController {
  static async getRules(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { state, employmentCategory, skillLevel, verifiedOnly } = req.query;
      const rules = await WageBenchmarkService.getRules({
        state: state as string,
        employmentCategory: employmentCategory as string,
        skillLevel: skillLevel as any,
        verifiedOnly: verifiedOnly === 'true',
      });
      res.status(200).json({
        success: true,
        rules,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRuleById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const rule = await WageBenchmarkService.getRuleById(req.params.id as string);
      res.status(200).json({
        success: true,
        rule,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createRule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = createWageRuleSchema.parse(req.body);
      const rule = await WageBenchmarkService.createRule(validated);
      res.status(201).json({
        success: true,
        message: 'Minimum wage rule created successfully.',
        rule,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = updateWageRuleSchema.parse(req.body);
      const rule = await WageBenchmarkService.updateRule(req.params.id as string, validated);
      res.status(200).json({
        success: true,
        message: 'Minimum wage rule updated successfully.',
        rule,
      });
    } catch (error) {
      next(error);
    }
  }

  static async calculateComparison(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = calculateWageCheckSchema.parse(req.body);
      const result = await WageBenchmarkService.calculateComparison(req.user!.id, validated);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
