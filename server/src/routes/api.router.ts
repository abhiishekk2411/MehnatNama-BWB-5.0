import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import jobRoutes from './job.routes.js';
import workdayRoutes from './workday.routes.js';
import ledgerRoutes from './ledger.routes.js';
import dashboardRoutes from './dashboard.routes.js';

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

export default apiRouter;
