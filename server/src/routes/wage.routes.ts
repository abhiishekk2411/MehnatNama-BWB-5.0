import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { WageController } from '../controllers/wage.controller.js';

const router = Router();

// Benchmark retrieval & calculation
router.get('/rules', WageController.getRules);
router.get('/rules/:id', WageController.getRuleById);
router.post('/check/calculate', authMiddleware, WageController.calculateComparison);

// Internal wage rule management (creation/updates)
router.post('/rules', authMiddleware, WageController.createRule);
router.patch('/rules/:id', authMiddleware, WageController.updateRule);

export default router;
