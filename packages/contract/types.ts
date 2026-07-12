// ============================================================================
// TransitOps — SHARED TYPES (FROZEN after Hour 0)
// Both backend and frontend import from here.
// Never hardcode response shapes in either codebase.
// ============================================================================

// ---------- ENUMS ----------

export type Role = 'FLEET_MANAGER' | 'DRIVER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST';
export type VehicleType = 'VAN' | 'TRUCK' | 'MINI';
export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
export type TripStatus = 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
export type MaintenanceStatus = 'OPEN' | 'CLOSED';
export type ExpenseType = 'TOLL' | 'MAINTENANCE' | 'OTHER';

// ---------- AUTH ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
}

// ---------- VEHICLE ----------

export interface VehicleResponse {
  id: string;
  regNo: string;
  name: string;
  type: VehicleType;
  maxLoadKg: number;
  odometer: number;
  acquisitionCost: number;
  region: string | null;
  status: VehicleStatus;
  createdAt: string;
}

export interface CreateVehicleRequest {
  regNo: string;
  name: string;
  type: VehicleType;
  maxLoadKg: number;
  odometer?: number;
  acquisitionCost: number;
  region?: string;
}

export interface UpdateVehicleRequest {
  name?: string;
  type?: VehicleType;
  maxLoadKg?: number;
  odometer?: number;
  acquisitionCost?: number;
  region?: string;
  status?: VehicleStatus;
}

// ---------- DRIVER ----------

export interface DriverResponse {
  id: string;
  name: string;
  licenseNo: string;
  licenseCategory: string;
  licenseExpiry: string;
  contact: string;
  safetyScore: number;
  status: DriverStatus;
  createdAt: string;
}

export interface CreateDriverRequest {
  name: string;
  licenseNo: string;
  licenseCategory: string;
  licenseExpiry: string; // ISO date string
  contact: string;
  safetyScore?: number;
}

export interface UpdateDriverRequest {
  name?: string;
  licenseNo?: string;
  licenseCategory?: string;
  licenseExpiry?: string;
  contact?: string;
  safetyScore?: number;
  status?: DriverStatus;
}

// ---------- TRIP ----------

export interface TripResponse {
  id: string;
  source: string;
  destination: string;
  cargoWeightKg: number;
  plannedDistance: number;
  status: TripStatus;
  vehicleId: string;
  driverId: string;
  vehicle: { regNo: string; name: string };
  driver: { name: string };
  finalOdometer: number | null;
  fuelConsumedL: number | null;
  revenue: number | null;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateTripRequest {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistance: number;
}

export interface CompleteTripRequest {
  finalOdometer: number;
  fuelConsumedL: number;
  revenue: number;
}

// ---------- DISPATCH OPTIONS ----------

export interface DispatchOptionsResponse {
  vehicles: Array<{
    id: string;
    regNo: string;
    name: string;
    maxLoadKg: number;
  }>;
  drivers: Array<{
    id: string;
    name: string;
    licenseCategory: string;
  }>;
}

// ---------- MAINTENANCE ----------

export interface MaintenanceLogResponse {
  id: string;
  vehicleId: string;
  vehicle: { regNo: string; name: string };
  type: string;
  cost: number;
  status: MaintenanceStatus;
  notes: string | null;
  openedAt: string;
  closedAt: string | null;
}

export interface CreateMaintenanceRequest {
  vehicleId: string;
  type: string;
  cost: number;
  notes?: string;
}

// ---------- FUEL ----------

export interface FuelLogResponse {
  id: string;
  vehicleId: string;
  vehicle: { regNo: string };
  liters: number;
  cost: number;
  odometer: number | null;
  date: string;
}

export interface CreateFuelLogRequest {
  vehicleId: string;
  liters: number;
  cost: number;
  odometer?: number;
}

// ---------- EXPENSE ----------

export interface ExpenseResponse {
  id: string;
  vehicleId: string;
  vehicle: { regNo: string };
  type: ExpenseType;
  amount: number;
  description: string | null;
  date: string;
}

export interface CreateExpenseRequest {
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  description?: string;
}

// ---------- DASHBOARD ----------

export interface KpiResponse {
  activeVehicles: number;
  availableVehicles: number;
  inMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilizationPct: number;
  vehicleStatusBreakdown: {
    AVAILABLE: number;
    ON_TRIP: number;
    IN_SHOP: number;
    RETIRED: number;
  };
  recentTrips: Array<{
    id: string;
    vehicleRegNo: string;
    driver: string;
    status: TripStatus;
    eta: string;
  }>;
}

// ---------- REPORTS ----------

export interface ReportsResponse {
  fuelEfficiencyKmPerL: number;
  fleetUtilizationPct: number;
  operationalCost: number;
  roiByVehicle: Array<{ regNo: string; roi: number }>;
  monthlyRevenue: Array<{ month: string; value: number }>;
  topCostliestVehicles: Array<{ regNo: string; cost: number }>;
}

export interface CostSummaryResponse {
  vehicles: Array<{
    id: string;
    regNo: string;
    fuelCost: number;
    maintenanceCost: number;
    totalCost: number;
  }>;
}

// ---------- SETTINGS ----------

export type ModuleName =
  | 'Dashboard'
  | 'Fleet'
  | 'Drivers'
  | 'Trips'
  | 'Maintenance'
  | 'FuelExpense'
  | 'Reports'
  | 'Settings';

export type Permission = 'read' | 'edit' | 'none';

export interface PermissionsResponse {
  matrix: Record<Role, Record<ModuleName, Permission>>;
}

// ---------- ERROR ----------

export interface ApiError {
  error: string;
  message?: string;
}

export interface ValidationError extends ApiError {
  error: 'VALIDATION_FAILED';
  message: string;
}
