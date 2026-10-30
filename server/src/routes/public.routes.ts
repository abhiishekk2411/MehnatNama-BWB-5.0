import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ConfirmationController } from '../controllers/confirmation.controller.js';
import { HelperController } from '../controllers/helper.controller.js';

const router = Router();

// Rate limiter for public contractor endpoints to prevent token enumeration/brute force
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests. Please try again in a few minutes.',
      statusCode: 429,
    },
  },
});

router.use(publicLimiter);

// Public Zero-Login Contractor Endpoints
router.get('/confirmations/:token', ConfirmationController.getPublicRequest);
router.post('/confirmations/:token/respond', ConfirmationController.submitPublicResponse);

// Public Zero-Login Helper Read-Only Report Access
router.get('/shared-reports/:token', HelperController.getPublicSharedReport);

export default router;
