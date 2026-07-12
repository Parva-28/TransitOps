// ============================================================================
// modules/settings/settings.routes.ts  — BA owns
// ============================================================================

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { permissionsHandler } from './settings.controller';

export const settingsRouter = Router();

// GET /api/settings/permissions  — public enough for FE shell, but guard anyway
settingsRouter.get('/permissions', requireAuth, permissionsHandler);
