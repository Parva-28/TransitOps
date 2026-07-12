// ============================================================================
// modules/dashboard/dashboard.controller.ts  — BA owns
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import * as dashboardService from './dashboard.service';

export async function kpisHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, status, region } = req.query as Record<string, string>;
    const kpis = await dashboardService.getKpis({ type, status, region });
    res.json(kpis);
  } catch (err) { next(err); }
}
