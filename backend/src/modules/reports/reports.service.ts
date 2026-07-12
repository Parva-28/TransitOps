// ============================================================================
// modules/reports/reports.service.ts  — BB owns
// Aggregation: fuel efficiency, utilization, op cost, ROI, monthly revenue, CSV
// ============================================================================

import prisma from '../../lib/prisma';

export async function getReports() {
  const [vehicles, trips, fuelLogs, maintenanceLogs] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.trip.findMany({ where: { status: 'COMPLETED' } }),
    prisma.fuelLog.findMany(),
    prisma.maintenanceLog.findMany(),
  ]);

  // ---- Fuel efficiency: totalPlannedDistance / totalFuelConsumed ----
  const totalDistance = trips.reduce((s, t) => s + (t.plannedDistance || 0), 0);
  const totalFuel     = trips.reduce((s, t) => s + (t.fuelConsumedL || 0), 0);
  const fuelEfficiencyKmPerL = totalFuel > 0
    ? Math.round((totalDistance / totalFuel) * 10) / 10
    : 0;

  // ---- Fleet utilization ----
  const onTrip    = vehicles.filter(v => v.status === 'ON_TRIP').length;
  const available = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const fleetUtilizationPct = (onTrip + available) > 0
    ? Math.round((onTrip / (onTrip + available)) * 100)
    : 0;

  // ---- Operational cost: sum of all fuel + maintenance ----
  const totalFuelCost = fuelLogs.reduce((s, f) => s + f.cost, 0);
  const totalMaintCost = maintenanceLogs.reduce((s, m) => s + m.cost, 0);
  const operationalCost = Math.round((totalFuelCost + totalMaintCost) * 100) / 100;

  // ---- ROI per vehicle: (revenue − (maint + fuel)) / acquisitionCost ----
  const roiByVehicle = vehicles.map(v => {
    const revenue     = trips.filter(t => t.vehicleId === v.id).reduce((s, t) => s + (t.revenue || 0), 0);
    const fuelCost    = fuelLogs.filter(f => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0);
    const maintCost   = maintenanceLogs.filter(m => m.vehicleId === v.id).reduce((s, m) => s + m.cost, 0);
    const roi = v.acquisitionCost > 0
      ? Math.round(((revenue - fuelCost - maintCost) / v.acquisitionCost) * 100) / 100
      : 0;
    return { regNo: v.regNo, roi };
  });

  // ---- Monthly revenue ----
  const monthlyMap: Record<string, number> = {};
  trips.forEach(t => {
    if (!t.completedAt || !t.revenue) return;
    const month = t.completedAt.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap[month] = (monthlyMap[month] || 0) + t.revenue;
  });
  const monthlyRevenue = Object.entries(monthlyMap).map(([month, value]) => ({ month, value }));

  // ---- Top costliest vehicles ----
  const costByVehicle = vehicles.map(v => {
    const fuelCost  = fuelLogs.filter(f => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0);
    const maintCost = maintenanceLogs.filter(m => m.vehicleId === v.id).reduce((s, m) => s + m.cost, 0);
    return { regNo: v.regNo, cost: Math.round((fuelCost + maintCost) * 100) / 100 };
  }).sort((a, b) => b.cost - a.cost);
  const topCostliestVehicles = costByVehicle.slice(0, 5);

  return {
    fuelEfficiencyKmPerL,
    fleetUtilizationPct,
    operationalCost,
    roiByVehicle,
    monthlyRevenue,
    topCostliestVehicles,
  };
}

// ---- CSV export ----
export async function getCsvData(): Promise<string> {
  const trips = await prisma.trip.findMany({
    include: {
      vehicle: { select: { regNo: true, name: true } },
      driver:  { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const header = 'Trip ID,Vehicle,Driver,Source,Destination,Status,Cargo (kg),Distance (km),Fuel (L),Revenue,Dispatched At,Completed At';
  const rows = trips.map(t => [
    t.id,
    t.vehicle.regNo,
    t.driver.name,
    `"${t.source}"`,
    `"${t.destination}"`,
    t.status,
    t.cargoWeightKg,
    t.plannedDistance,
    t.fuelConsumedL ?? '',
    t.revenue ?? '',
    t.dispatchedAt ? t.dispatchedAt.toISOString() : '',
    t.completedAt  ? t.completedAt.toISOString()  : '',
  ].join(','));

  return [header, ...rows].join('\n');
}
