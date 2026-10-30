import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { HelperController } from '../controllers/helper.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', HelperController.createAccess);
router.get('/', HelperController.getAccesses);
router.delete('/:id', HelperController.revokeAccess);

export default router;
