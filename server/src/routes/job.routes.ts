import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createJobSchema, updateJobSchema, updateJobStatusSchema } from '../validation/job.schema.js';

const jobRouter = Router();

jobRouter.use(authMiddleware);

jobRouter.get('/', JobController.listJobs);
jobRouter.post('/', validateBody(createJobSchema), JobController.createJob);
jobRouter.get('/:id', JobController.getJobById);
jobRouter.patch('/:id', validateBody(updateJobSchema), JobController.updateJob);
jobRouter.patch('/:id/status', validateBody(updateJobStatusSchema), JobController.updateJobStatus);

export default jobRouter;
