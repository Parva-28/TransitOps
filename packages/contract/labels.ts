// ============================================================================
// TransitOps — ENUM LABEL HELPERS (FROZEN after Hour 0)
// Frontend NEVER hardcodes "On Trip" — always call these helpers.
// ============================================================================

import type { VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus, Role, VehicleType } from './types';

export const vehicleStatusLabel: Record<VehicleStatus, string> = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
};

export const driverStatusLabel: Record<DriverStatus, string> = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
};

export const tripStatusLabel: Record<TripStatus, string> = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const maintenanceStatusLabel: Record<MaintenanceStatus, string> = {
  OPEN: 'Open',
  CLOSED: 'Closed',
};

export const roleLabel: Record<Role, string> = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export const vehicleTypeLabel: Record<VehicleType, string> = {
  VAN: 'Van',
  TRUCK: 'Truck',
  MINI: 'Mini',
};

// Status → pill color class (for StatusPill component)
export const vehicleStatusColor: Record<VehicleStatus, string> = {
  AVAILABLE: '#2FBF71',
  ON_TRIP: '#3E7BFA',
  IN_SHOP: '#E8A33D',
  RETIRED: '#E5484D',
};

export const driverStatusColor: Record<DriverStatus, string> = {
  AVAILABLE: '#2FBF71',
  ON_TRIP: '#3E7BFA',
  OFF_DUTY: '#E8A33D',
  SUSPENDED: '#E5484D',
};

export const tripStatusColor: Record<TripStatus, string> = {
  DRAFT: '#8A909B',
  DISPATCHED: '#3E7BFA',
  COMPLETED: '#2FBF71',
  CANCELLED: '#E5484D',
};
