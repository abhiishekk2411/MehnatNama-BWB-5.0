import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get('/summary', DashboardController.getSummary);
dashboardRouter.get('/activity', DashboardController.getActivity);

export default dashboardRouter;
