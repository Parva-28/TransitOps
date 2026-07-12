// ============================================================================
// modules/settings/settings.service.ts  — BA owns
// GET /settings/permissions — static role × module permission matrix
// ============================================================================

import type { Role, ModuleName, Permission, PermissionsResponse } from '@transitops/contract';

// Static permission matrix per PLAN.md §10
const PERMISSIONS: PermissionsResponse['matrix'] = {
  FLEET_MANAGER: {
    Dashboard:   'read',
    Fleet:       'edit',
    Drivers:     'edit',
    Trips:       'edit',
    Maintenance: 'edit',
    FuelExpense: 'edit',
    Reports:     'read',
    Settings:    'edit',
  },
  DRIVER: {
    Dashboard:   'read',
    Fleet:       'read',
    Drivers:     'none',
    Trips:       'edit',
    Maintenance: 'none',
    FuelExpense: 'none',
    Reports:     'none',
    Settings:    'none',
  },
  SAFETY_OFFICER: {
    Dashboard:   'read',
    Fleet:       'read',
    Drivers:     'edit',
    Trips:       'read',
    Maintenance: 'read',
    FuelExpense: 'none',
    Reports:     'read',
    Settings:    'none',
  },
  FINANCIAL_ANALYST: {
    Dashboard:   'read',
    Fleet:       'read',
    Drivers:     'none',
    Trips:       'read',
    Maintenance: 'read',
    FuelExpense: 'edit',
    Reports:     'edit',
    Settings:    'none',
  },
};

export function getPermissions(): PermissionsResponse {
  return { matrix: PERMISSIONS };
}

// Helper: check if a role has edit access to a module
export function canEdit(role: Role, module: ModuleName): boolean {
  return PERMISSIONS[role]?.[module] === 'edit';
}

export { PERMISSIONS };
