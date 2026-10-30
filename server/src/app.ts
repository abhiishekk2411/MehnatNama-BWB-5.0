import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRouter from './routes/api.router.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate Limiter: General limits for API protection
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429,
      },
    },
  });

  app.use('/api', globalLimiter);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Root & API Routes
  app.get('/', (_req, res) => {
    res.json({
      name: 'Hisaab-Saboot API',
      tagline: 'Apne kaam ka hisaab, apne phone mein.',
      version: '1.0.0',
    });
  });

  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
