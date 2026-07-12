// ============================================================================
// modules/dashboard/dashboard.service.ts  — BA owns
// GET /dashboard/kpis — computes all KPI cards + breakdown + recent trips
// Supports ?type=VAN&status=AVAILABLE&region=North filters
// ============================================================================

import prisma from '../../lib/prisma';
import { VehicleType, VehicleStatus, TripStatus } from '@prisma/client';

export async function getKpis(query: {
  type?: string;
  status?: string;
  region?: string;
}) {
  // Build vehicle filter
  const vehicleWhere: Record<string, unknown> = {};
  if (query.type && Object.values(VehicleType).includes(query.type as VehicleType)) {
    vehicleWhere.type = query.type as VehicleType;
  }
  if (query.status && Object.values(VehicleStatus).includes(query.status as VehicleStatus)) {
    vehicleWhere.status = query.status as VehicleStatus;
  }
  if (query.region) {
    vehicleWhere.region = { equals: query.region, mode: 'insensitive' };
  }

  // Run queries in parallel
  const [
    vehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    recentTrips,
  ] = await Promise.all([
    prisma.vehicle.findMany({ where: vehicleWhere }),
    prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
    prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
    prisma.driver.count({ where: { status: 'ON_TRIP' } }),
    prisma.trip.findMany({
      where: { status: { in: [TripStatus.DISPATCHED, TripStatus.DRAFT] } },
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  // KPI counts from filtered vehicles
  const activeVehicles    = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const inMaintenance     = vehicles.filter(v => v.status === 'IN_SHOP').length;
  const onTripCount       = vehicles.filter(v => v.status === 'ON_TRIP').length;

  // Fleet utilization = ON_TRIP / (AVAILABLE + ON_TRIP) * 100
  const dispatchable = availableVehicles + onTripCount;
  const fleetUtilizationPct = dispatchable > 0
    ? Math.round((onTripCount / dispatchable) * 100)
    : 0;

  // Status breakdown for ALL vehicles (unfiltered) for the breakdown bar
  const allVehicles = await prisma.vehicle.findMany({ select: { status: true } });
  const vehicleStatusBreakdown = {
    AVAILABLE: allVehicles.filter(v => v.status === 'AVAILABLE').length,
    ON_TRIP:   allVehicles.filter(v => v.status === 'ON_TRIP').length,
    IN_SHOP:   allVehicles.filter(v => v.status === 'IN_SHOP').length,
    RETIRED:   allVehicles.filter(v => v.status === 'RETIRED').length,
  };

  // Shape recent trips per CONTRACT.md
  const formattedRecentTrips = recentTrips.map(t => ({
    id: t.id,
    vehicleRegNo: t.vehicle.regNo,
    driver: t.driver.name,
    status: t.status,
    eta: t.status === 'DISPATCHED' ? '~40 min' : 'Pending',
  }));

  return {
    activeVehicles,
    availableVehicles,
    inMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilizationPct,
    vehicleStatusBreakdown,
    recentTrips: formattedRecentTrips,
  };
}
