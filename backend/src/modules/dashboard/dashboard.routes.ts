// ============================================================================
// modules/dashboard/dashboard.routes.ts  — BA owns
// ============================================================================

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { kpisHandler } from './dashboard.controller';

export const dashboardRouter = Router();

// GET /api/dashboard/kpis?type=VAN&status=AVAILABLE&region=North
dashboardRouter.get('/kpis', requireAuth, kpisHandler);
