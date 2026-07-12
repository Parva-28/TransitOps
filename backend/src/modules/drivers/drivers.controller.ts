// ============================================================================
// modules/drivers/drivers.controller.ts  — BA owns
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import * as driversService from './drivers.service';

export async function listHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const drivers = await driversService.listDrivers(req.query as Record<string, string>);
    res.json(drivers);
  } catch (err) { next(err); }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, licenseNo, licenseCategory, licenseExpiry, contact, safetyScore } = req.body;
    if (!name || !licenseNo || !licenseCategory || !licenseExpiry || !contact) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: 'name, licenseNo, licenseCategory, licenseExpiry, contact are required' });
      return;
    }
    const driver = await driversService.createDriver({ name, licenseNo, licenseCategory, licenseExpiry, contact, safetyScore: safetyScore ? Number(safetyScore) : undefined });
    res.status(201).json(driver);
  } catch (err) { next(err); }
}

export async function getOneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driversService.getDriver(req.params.id);
    res.json(driver);
  } catch (err) { next(err); }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driversService.updateDriver(req.params.id, req.body);
    res.json(driver);
  } catch (err) { next(err); }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await driversService.deleteDriver(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
