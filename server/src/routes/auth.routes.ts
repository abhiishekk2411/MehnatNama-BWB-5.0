import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validation/auth.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRouter = Router();

// Strict login rate limiter: max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      statusCode: 429,
    },
  },
});

authRouter.post('/register', authLimiter, validateBody(registerSchema), AuthController.register);
authRouter.post('/login', authLimiter, validateBody(loginSchema), AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/me', authMiddleware, AuthController.me);

export default authRouter;
