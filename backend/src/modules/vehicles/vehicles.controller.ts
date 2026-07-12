// ============================================================================
// modules/vehicles/vehicles.controller.ts  — BA owns
// Thin controllers: validate input shape, call service, send response.
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import * as vehiclesService from './vehicles.service';

export async function listHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicles = await vehiclesService.listVehicles(req.query as Record<string, string>);
    res.json(vehicles);
  } catch (err) { next(err); }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { regNo, name, type, maxLoadKg, odometer, acquisitionCost, region } = req.body;
    if (!regNo || !name || !type || !maxLoadKg || acquisitionCost === undefined) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: 'regNo, name, type, maxLoadKg, acquisitionCost are required' });
      return;
    }
    const vehicle = await vehiclesService.createVehicle({ regNo, name, type, maxLoadKg: Number(maxLoadKg), odometer: odometer ? Number(odometer) : undefined, acquisitionCost: Number(acquisitionCost), region });
    res.status(201).json(vehicle);
  } catch (err) { next(err); }
}

export async function getOneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await vehiclesService.getVehicle(req.params.id);
    res.json(vehicle);
  } catch (err) { next(err); }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await vehiclesService.updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  } catch (err) { next(err); }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await vehiclesService.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
