import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validation/auth.schema.js';

const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get('/', ProfileController.getProfile);
profileRouter.patch('/', validateBody(updateProfileSchema), ProfileController.updateProfile);

export default profileRouter;
