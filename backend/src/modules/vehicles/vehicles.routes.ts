// ============================================================================
// modules/vehicles/vehicles.routes.ts  — BA owns
// ============================================================================

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { listHandler, createHandler, getOneHandler, updateHandler, deleteHandler, tripsHandler } from './vehicles.controller';

export const vehiclesRouter = Router();

vehiclesRouter.use(requireAuth);

// GET  /api/vehicles?type=VAN&status=AVAILABLE&region=South&search=van&sort=odometer
vehiclesRouter.get('/',    listHandler);

// POST /api/vehicles
vehiclesRouter.post('/',   createHandler);

// GET  /api/vehicles/:id
vehiclesRouter.get('/:id', getOneHandler);

// PATCH /api/vehicles/:id
vehiclesRouter.patch('/:id', updateHandler);

// DELETE /api/vehicles/:id
vehiclesRouter.delete('/:id', deleteHandler);

// GET /api/vehicles/:id/trips
vehiclesRouter.get('/:id/trips', tripsHandler);
