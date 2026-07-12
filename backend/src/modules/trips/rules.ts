// ============================================================================
// modules/trips/rules.ts  — BB owns
// Validation helpers used by every status-changing operation.
// Each function throws ValidationError (422) on failure.
// ============================================================================

import { ValidationError } from '../../middleware/error';
import { Vehicle, Driver } from '@prisma/client';

const fail = (msg: string): never => { throw new ValidationError(msg); };

export function assertVehicleAvailable(v: Vehicle): void {
  if (v.status === 'ON_TRIP')  fail('Vehicle is already On Trip');
  if (v.status === 'IN_SHOP')  fail('Retired or In-Shop vehicles cannot be dispatched');
  if (v.status === 'RETIRED')  fail('Retired or In-Shop vehicles cannot be dispatched');
}

export function assertDriverAssignable(d: Driver): void {
  if (d.status === 'SUSPENDED') fail('Suspended drivers cannot be assigned');
  if (d.status === 'OFF_DUTY')  fail('Driver is Off Duty and cannot be assigned');
  if (d.status === 'ON_TRIP')   fail('Driver is already On Trip');
}

export function assertLicenseValid(d: Driver): void {
  if (d.licenseExpiry <= new Date()) {
    fail(`Driver license expired on ${d.licenseExpiry.toDateString()}`);
  }
}

export function assertCargoWithinCapacity(cargo: number, max: number): void {
  if (cargo > max) {
    fail(`Cargo Weight exceeds vehicle capacity (${cargo} kg > ${max} kg)`);
  }
}
