# TransitOps — API CONTRACT (FROZEN AT HOUR 0)

> This is the single source of truth both pods build against. It is **locked after the Hour-0 sync**.
> If a shape genuinely must change: announce in the group chat, one person edits, everyone re-syncs. Do not silently drift.
> Base URL: `/api`. All responses are JSON. All protected routes require `Authorization: Bearer <token>`.

The enum values live in `schema.prisma` and are re-exported as TS types from `/packages/contract`. **Frontend imports these — it never hardcodes strings like `"On Trip"`.** The display label ("On Trip") is derived from the enum (`ON_TRIP`) with a shared formatter.

---

## Endpoint map (owner in bold)

| Method | Path | Owner | Purpose |
|---|---|---|---|
| POST | `/auth/register` | **BA** | Create user with a role |
| POST | `/auth/login` | **BA** | Returns `{ token, user }` |
| GET | `/auth/me` | **BA** | Current user from token |
| GET | `/vehicles` | **BA** | List + filter (`type`,`status`,`region`,`search`,`sort`) |
| POST | `/vehicles` | **BA** | Create (enforces unique `regNo`) |
| GET | `/vehicles/:id` | **BA** | One vehicle |
| PATCH | `/vehicles/:id` | **BA** | Update fields / retire |
| DELETE | `/vehicles/:id` | **BA** | Remove |
| GET | `/drivers` | **BA** | List + filter (`status`,`search`,`sort`) |
| POST | `/drivers` | **BA** | Create (unique `licenseNo`) |
| GET | `/drivers/:id` | **BA** | One driver |
| PATCH | `/drivers/:id` | **BA** | Update |
| DELETE | `/drivers/:id` | **BA** | Remove |
| GET | `/dashboard/kpis` | **BA** | All KPI cards + breakdown (`type`,`status`,`region` filters) |
| GET | `/settings/permissions` | **BA** | Role × module matrix (from config) |
| GET | `/trips` | **BB** | List (the live board) |
| GET | `/trips/dispatch-options` | **BB** | ONLY assignable vehicles + drivers (enforces exclusion rules) |
| POST | `/trips` | **BB** | Create Draft (runs all validations) |
| POST | `/trips/:id/dispatch` | **BB** | Draft→Dispatched, flips vehicle+driver to ON_TRIP |
| POST | `/trips/:id/complete` | **BB** | Dispatched→Completed, restores both, logs fuel + odometer |
| POST | `/trips/:id/cancel` | **BB** | Dispatched→Cancelled, restores both |
| GET | `/maintenance` | **BB** | List logs |
| POST | `/maintenance` | **BB** | Create OPEN log, flips vehicle→IN_SHOP |
| POST | `/maintenance/:id/close` | **BB** | Close, restores vehicle→AVAILABLE (unless RETIRED) |
| GET | `/fuel` | **BB** | Fuel logs (`?vehicleId=`) |
| POST | `/fuel` | **BB** | Add fuel log |
| GET | `/expenses` | **BB** | Expenses (`?vehicleId=`) |
| POST | `/expenses` | **BB** | Add expense |
| GET | `/operations/cost-summary` | **BB** | Per-vehicle Fuel + Maintenance totals |
| GET | `/reports` | **BB** | Fuel efficiency, utilization, op cost, ROI, chart data |
| GET | `/reports/export.csv` | **BB** | CSV download |

---

## Key request / response shapes

Only the non-obvious ones are spelled out. Plain CRUD follows the model fields in `schema.prisma`.

### POST `/auth/login`
```jsonc
// req
{ "email": "manager@transitops.dev", "password": "demo1234" }
// res 200
{ "token": "jwt...", "user": { "id": "...", "name": "Riya", "email": "...", "role": "FLEET_MANAGER" } }
// res 401
{ "error": "Invalid credentials" }
```

### GET `/dashboard/kpis`  (query: `?type=VAN&status=AVAILABLE&region=North`)
```jsonc
{
  "activeVehicles": 5, "availableVehicles": 2, "inMaintenance": 1,
  "activeTrips": 3, "pendingTrips": 4, "driversOnDuty": 3,
  "fleetUtilizationPct": 87,
  "vehicleStatusBreakdown": { "AVAILABLE": 2, "ON_TRIP": 3, "IN_SHOP": 1, "RETIRED": 0 },
  "recentTrips": [ { "id": "TR001", "vehicleRegNo": "VAN-05", "driver": "Alex", "status": "ON_TRIP", "eta": "40 min" } ]
}
```

### GET `/trips/dispatch-options`
```jsonc
// Must ALREADY exclude: IN_SHOP, RETIRED, ON_TRIP vehicles; SUSPENDED, OFF_DUTY,
// ON_TRIP, and expired-license drivers. Frontend just renders what it gets.
{
  "vehicles": [ { "id": "...", "regNo": "VAN-05", "name": "Force Traveller", "maxLoadKg": 500 } ],
  "drivers":  [ { "id": "...", "name": "Alex", "licenseCategory": "LMV" } ]
}
```

### POST `/trips`   (create Draft — runs validations, does NOT change statuses yet)
```jsonc
// req
{ "source": "Bangalore Depot", "destination": "Chennai Warehouse",
  "vehicleId": "...", "driverId": "...", "cargoWeightKg": 450, "plannedDistance": 350 }
// res 201
{ "id": "...", "status": "DRAFT", /* ...full trip... */ }
// res 422 — validation failure (frontend shows this text in the red box, screen 4)
{ "error": "VALIDATION_FAILED", "message": "Cargo Weight exceeds vehicle capacity (450 kg > 400 kg)" }
```
Validation error `message` values the FE must be ready to display verbatim:
- `"Cargo Weight exceeds vehicle capacity (X kg > Y kg)"`
- `"Driver license expired on <date>"`
- `"Suspended drivers cannot be assigned"`
- `"Vehicle is already On Trip"` / `"Driver is already On Trip"`
- `"Retired or In-Shop vehicles cannot be dispatched"`

### POST `/trips/:id/dispatch`  → `{ ...trip, "status": "DISPATCHED", "dispatchedAt": "..." }`
### POST `/trips/:id/complete`
```jsonc
// req
{ "finalOdometer": 64200, "fuelConsumedL": 38.5, "revenue": 12000 }
// res 200 -> trip COMPLETED, vehicle+driver back to AVAILABLE, vehicle.odometer updated,
//            a FuelLog row auto-created from fuelConsumedL.
```

### GET `/reports`
```jsonc
{
  "fuelEfficiencyKmPerL": 8.4,
  "fleetUtilizationPct": 87,
  "operationalCost": 34090,
  "roiByVehicle": [ { "regNo": "VAN-05", "roi": 0.42 } ],
  "monthlyRevenue": [ { "month": "Jan", "value": 12000 } ],
  "topCostliestVehicles": [ { "regNo": "TRUCK-11", "cost": 18500 } ]
}
```

---

## THE RULE ENGINE — exact behaviour (BB owns; this is the demo centerpiece)

Every status-changing action MUST run inside a **single Prisma `$transaction`** so the trip and the vehicle/driver never end up half-updated.

**On create (`POST /trips`)** validate, in this order, and reject with 422 on first failure:
1. Vehicle is `AVAILABLE` (not ON_TRIP / IN_SHOP / RETIRED).
2. Driver is `AVAILABLE` (not ON_TRIP / OFF_DUTY / SUSPENDED).
3. Driver `licenseExpiry` is in the future.
4. `cargoWeightKg <= vehicle.maxLoadKg`.

**On dispatch:** `DRAFT → DISPATCHED`; set `vehicle.status = ON_TRIP`, `driver.status = ON_TRIP`, `dispatchedAt = now()`. Re-check rules 1–4 (state may have changed since draft).

**On complete:** `DISPATCHED → COMPLETED`; set `vehicle.status = AVAILABLE`, `driver.status = AVAILABLE`, `vehicle.odometer = finalOdometer`, `completedAt = now()`; create a `FuelLog`.

**On cancel:** `DISPATCHED → CANCELLED`; restore `vehicle.status = AVAILABLE`, `driver.status = AVAILABLE`.

**On maintenance open (`POST /maintenance`):** create `OPEN` log; set `vehicle.status = IN_SHOP`. The vehicle now disappears from `/trips/dispatch-options` automatically.

**On maintenance close:** set log `CLOSED`; if `vehicle.status != RETIRED` then `vehicle.status = AVAILABLE`.

---

## Seed data (reuse the mockup so the demo looks identical to what you designed)

Run in `prisma/seed.ts`. **BA owns the seed file.**

- **Users (password `demo1234` for all):** `manager@transitops.dev` (FLEET_MANAGER), `driver@transitops.dev` (DRIVER), `safety@transitops.dev` (SAFETY_OFFICER), `finance@transitops.dev` (FINANCIAL_ANALYST)
- **Vehicles:** `VAN-05` (VAN, 500 kg, AVAILABLE), `TRUCK-11` (TRUCK, 5000 kg, ON_TRIP), `MINI-03` (MINI, 750 kg, IN_SHOP), `VAN-09` (VAN, 500 kg, AVAILABLE)
- **Drivers:** `Alex` (LMV, valid, AVAILABLE), `John` (HMV, valid, ON_TRIP), `Priya` (LMV, valid, AVAILABLE), `Suresh` (HMV, **SUSPENDED** — good for the validation demo)
- **Trips:** `TR001`–`TR006` across DRAFT/DISPATCHED/COMPLETED/CANCELLED so the board and reports have content.
- A couple of fuel logs + one OPEN maintenance log on MINI-03 (that's why it's IN_SHOP).

> **The golden demo path** (from spec §5): register VAN-05 → register Alex → create trip cargo 450 ≤ 500 → dispatch (both go ON_TRIP) → complete (both back to AVAILABLE) → open Oil Change on VAN-05 (goes IN_SHOP, vanishes from dispatch) → reports update. This must work end-to-end by Checkpoint 3.
