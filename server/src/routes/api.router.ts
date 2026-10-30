import { Router } from 'express';
import authRoutes from './auth.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Hisaab-Saboot API',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/auth', authRoutes);

export default apiRouter;
