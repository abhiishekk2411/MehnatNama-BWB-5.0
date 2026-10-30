import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { ReportController } from '../controllers/report.controller.js';

const router = Router();

router.get('/data', authMiddleware, ReportController.getReportData);

export default router;
