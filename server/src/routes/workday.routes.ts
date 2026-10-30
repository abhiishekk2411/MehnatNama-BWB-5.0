import { Router } from 'express';
import { WorkDayController } from '../controllers/workday.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';
import { createWorkDaySchema, updateWorkDaySchema, queryWorkDaySchema } from '../validation/workday.schema.js';

const workdayRouter = Router();

workdayRouter.use(authMiddleware);

workdayRouter.get('/summary', validateQuery(queryWorkDaySchema), WorkDayController.getSummary);
workdayRouter.get('/', validateQuery(queryWorkDaySchema), WorkDayController.listWorkDays);
workdayRouter.post('/', validateBody(createWorkDaySchema), WorkDayController.recordWorkDay);
workdayRouter.get('/:id', WorkDayController.getWorkDayById);
workdayRouter.patch('/:id', validateBody(updateWorkDaySchema), WorkDayController.updateWorkDay);

export default workdayRouter;
