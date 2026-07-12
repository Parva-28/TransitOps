// ============================================================================
// modules/fuel-expense/fuel-expense.controller.ts  — BB owns
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import * as service from './fuel-expense.service';
import { ExpenseType } from '@prisma/client';

export async function listFuelHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json(await service.listFuelLogs(req.query.vehicleId as string)); } catch (e) { next(e); }
}

export async function createFuelHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { vehicleId, liters, cost, odometer } = req.body;
    if (!vehicleId || liters === undefined || cost === undefined) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: 'vehicleId, liters, cost are required' });
      return;
    }
    const log = await service.createFuelLog({ vehicleId, liters: Number(liters), cost: Number(cost), odometer: odometer ? Number(odometer) : undefined });
    res.status(201).json(log);
  } catch (e) { next(e); }
}

export async function listExpensesHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json(await service.listExpenses(req.query.vehicleId as string)); } catch (e) { next(e); }
}

export async function createExpenseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { vehicleId, type, amount, description } = req.body;
    if (!vehicleId || !type || amount === undefined) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: 'vehicleId, type, amount are required' });
      return;
    }
    if (!Object.values(ExpenseType).includes(type)) {
      res.status(422).json({ error: 'VALIDATION_FAILED', message: `type must be one of: ${Object.values(ExpenseType).join(', ')}` });
      return;
    }
    const expense = await service.createExpense({ vehicleId, type, amount: Number(amount), description });
    res.status(201).json(expense);
  } catch (e) { next(e); }
}

export async function costSummaryHandler(req: Request, res: Response, next: NextFunction) {
  try { res.json(await service.getCostSummary()); } catch (e) { next(e); }
}
