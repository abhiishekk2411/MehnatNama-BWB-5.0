import { Router } from 'express';
import { LedgerController } from '../controllers/ledger.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';
import { createLedgerEntrySchema, updateLedgerEntrySchema, queryLedgerSchema } from '../validation/ledger.schema.js';

const ledgerRouter = Router();

ledgerRouter.use(authMiddleware);

ledgerRouter.get('/summary', validateQuery(queryLedgerSchema), LedgerController.getSummary);
ledgerRouter.get('/', validateQuery(queryLedgerSchema), LedgerController.listEntries);
ledgerRouter.post('/', validateBody(createLedgerEntrySchema), LedgerController.recordEntry);
ledgerRouter.get('/:id', LedgerController.getEntryById);
ledgerRouter.patch('/:id', validateBody(updateLedgerEntrySchema), LedgerController.updateEntry);

export default ledgerRouter;
