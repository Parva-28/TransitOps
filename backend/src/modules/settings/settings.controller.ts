// ============================================================================
// modules/settings/settings.controller.ts  — BA owns
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import * as settingsService from './settings.service';

export function permissionsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(settingsService.getPermissions());
  } catch (err) { next(err); }
}
