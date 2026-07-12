// ============================================================================
// modules/drivers/drivers.routes.ts  — BA owns
// ============================================================================

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { listHandler, createHandler, getOneHandler, updateHandler, deleteHandler } from './drivers.controller';

export const driversRouter = Router();

driversRouter.use(requireAuth);

// GET  /api/drivers?status=AVAILABLE&search=alex&sort=-safetyScore
driversRouter.get('/',    listHandler);

// POST /api/drivers
driversRouter.post('/',   createHandler);

// GET  /api/drivers/:id
driversRouter.get('/:id', getOneHandler);

// PATCH /api/drivers/:id
driversRouter.patch('/:id', updateHandler);

// DELETE /api/drivers/:id
driversRouter.delete('/:id', deleteHandler);
