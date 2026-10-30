import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRouter from './routes/api.router.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  // Security Headers
  app.use(helmet());

  // Cookie Parser for HttpOnly authentication cookies
  app.use(cookieParser());

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
    max: 500, // Limit each IP to 500 requests per 15 min
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

  // Root & Health Check Info
  app.get('/', (_req, res) => {
    res.json({
      name: 'MehnatNama (मेहनतनामा) API',
      tagline: 'Har din ka kaam. Har rupaye ka hisaab.',
      version: '1.0.0',
      status: 'operational',
    });
  });

  // Mount API Router
  app.use('/api', apiRouter);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}
