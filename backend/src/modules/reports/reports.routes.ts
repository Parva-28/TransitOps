// ============================================================================
// modules/reports/reports.routes.ts  — BB owns
// ============================================================================
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { reportsHandler, csvExportHandler } from './reports.controller';

export const reportsRouter = Router();
reportsRouter.use(requireAuth);

reportsRouter.get('/',           reportsHandler);  // GET /api/reports
reportsRouter.get('/export.csv', csvExportHandler); // GET /api/reports/export.csv
