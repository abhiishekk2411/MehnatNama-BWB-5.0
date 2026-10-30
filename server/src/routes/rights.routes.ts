import { Router } from 'express';
import { RIGHTS_GUIDES, ESCALATION_RESOURCES } from '../data/rightsData.js';

const router = Router();

// GET /api/rights-guides
router.get('/guides', (_req, res) => {
  res.status(200).json({
    success: true,
    guides: RIGHTS_GUIDES,
    disclaimer:
      'This information is provided for educational and rights-awareness purposes only and does not constitute formal legal advice.',
  });
});

// GET /api/escalation-resources
router.get('/escalation-resources', (_req, res) => {
  res.status(200).json({
    success: true,
    resources: ESCALATION_RESOURCES,
    disclaimer:
      'Verified official public escalation channels. MehnatNama provides guidance tools and does not automatically file statutory disputes on behalf of workers.',
  });
});

export default router;
