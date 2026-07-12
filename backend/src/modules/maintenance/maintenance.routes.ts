// ============================================================================
// modules/maintenance/maintenance.routes.ts  — BB owns
// ============================================================================
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { listHandler, openHandler, closeHandler } from './maintenance.controller';

export const maintenanceRouter = Router();
maintenanceRouter.use(requireAuth);

maintenanceRouter.get('/',           listHandler);   // GET  /api/maintenance
maintenanceRouter.post('/',          openHandler);   // POST /api/maintenance
maintenanceRouter.post('/:id/close', closeHandler);  // POST /api/maintenance/:id/close
