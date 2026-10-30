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

  // CORS Configuration - Support localhost, 127.0.0.1 and production origin
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    env.CORS_ORIGIN,
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl) or allowed origins
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else if (env.NODE_ENV === 'production' && allowedOrigins.includes(origin)) {
          callback(null, true);
        } else if (env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

  // Root Info
  app.get('/', (_req, res) => {
    res.json({
      name: 'MehnatNama (मेहनतनामा) API',
      tagline: 'Har din ka kaam. Har rupaye ka hisaab.',
      version: '1.0.0',
      status: 'operational',
    });
  });

  // Dedicated Health Check endpoint for Render/Railway/Kubernetes
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      memoryUsage: {
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
    });
  });

  // Mount API Router
  app.use('/api', apiRouter);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}
