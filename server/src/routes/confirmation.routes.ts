import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { ConfirmationController } from '../controllers/confirmation.controller.js';

const router = Router();

// Worker endpoints (Auth required)
router.use(authMiddleware);

router.post('/', ConfirmationController.createRequest);
router.get('/', ConfirmationController.getRequests);
router.get('/:id', ConfirmationController.getRequestById);
router.post('/:id/revoke', ConfirmationController.revokeRequest);

export default router;
