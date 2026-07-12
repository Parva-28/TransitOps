// ============================================================================
// modules/fuel-expense/fuel-expense.service.ts  — BB owns
// Fuel logs + expenses CRUD + cost-summary aggregation
// ============================================================================

import prisma from '../../lib/prisma';
import { NotFoundError } from '../../middleware/error';
import { ExpenseType } from '@prisma/client';

// ---- Fuel logs ----
export async function listFuelLogs(vehicleId?: string) {
  return prisma.fuelLog.findMany({
    where: vehicleId ? { vehicleId } : undefined,
    include: { vehicle: { select: { regNo: true } } },
    orderBy: { date: 'desc' },
  });
}

export async function createFuelLog(data: {
  vehicleId: string;
  liters: number;
  cost: number;
  odometer?: number;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw new NotFoundError('Vehicle not found');
  return prisma.fuelLog.create({
    data,
    include: { vehicle: { select: { regNo: true } } },
  });
}

// ---- Expenses ----
export async function listExpenses(vehicleId?: string) {
  return prisma.expense.findMany({
    where: vehicleId ? { vehicleId } : undefined,
    include: { vehicle: { select: { regNo: true } } },
    orderBy: { date: 'desc' },
  });
}

export async function createExpense(data: {
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  description?: string;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw new NotFoundError('Vehicle not found');
  return prisma.expense.create({
    data,
    include: { vehicle: { select: { regNo: true } } },
  });
}

// ---- Cost summary: per-vehicle fuel + maintenance totals ----
export async function getCostSummary() {
  const [vehicles, fuelLogs, maintenanceLogs] = await Promise.all([
    prisma.vehicle.findMany({ select: { id: true, regNo: true } }),
    prisma.fuelLog.findMany({ select: { vehicleId: true, cost: true } }),
    prisma.maintenanceLog.findMany({ select: { vehicleId: true, cost: true } }),
  ]);

  const result = vehicles.map(v => {
    const fuelCost = fuelLogs
      .filter(f => f.vehicleId === v.id)
      .reduce((sum, f) => sum + f.cost, 0);
    const maintenanceCost = maintenanceLogs
      .filter(m => m.vehicleId === v.id)
      .reduce((sum, m) => sum + m.cost, 0);
    return {
      id: v.id,
      regNo: v.regNo,
      fuelCost: Math.round(fuelCost * 100) / 100,
      maintenanceCost: Math.round(maintenanceCost * 100) / 100,
      totalCost: Math.round((fuelCost + maintenanceCost) * 100) / 100,
    };
  });

  return { vehicles: result };
}
