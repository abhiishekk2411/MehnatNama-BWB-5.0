import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import jobRoutes from './job.routes.js';
import workdayRoutes from './workday.routes.js';
import ledgerRoutes from './ledger.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import confirmationRoutes from './confirmation.routes.js';
import publicRoutes from './public.routes.js';
import wageRoutes from './wage.routes.js';
import reportRoutes from './report.routes.js';
import rightsRoutes from './rights.routes.js';
import helperRoutes from './helper.routes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'MehnatNama API',
    tagline: 'Har din ka kaam. Har rupaye ka hisaab.',
    timestamp: new Date().toISOString(),
  });
});

// Modular resource routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/workdays', workdayRoutes);
apiRouter.use('/ledger', ledgerRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

// Phase 4 Resource Routers
apiRouter.use('/confirmations', confirmationRoutes);
apiRouter.use('/public', publicRoutes);
apiRouter.use('/wage', wageRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/rights', rightsRoutes);
apiRouter.use('/helpers', helperRoutes);

export default apiRouter;
