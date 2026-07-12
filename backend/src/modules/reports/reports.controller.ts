// ============================================================================
// modules/reports/reports.controller.ts  — BB owns
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import * as reportsService from './reports.service';

export async function reportsHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json(await reportsService.getReports()); } catch (e) { next(e); }
}

export async function csvExportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const csv = await reportsService.getCsvData();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transitops-trips.csv"');
    res.send(csv);
  } catch (e) { next(e); }
}
