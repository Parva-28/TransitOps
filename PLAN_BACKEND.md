# PLAN — BACKEND (BA + BB)

**Stack:** Node + TypeScript + Express + Prisma + Postgres (Neon/Supabase). JWT auth.
**Read first:** `CONTRACT.md`, `schema.prisma`, `AGENTS.md`.
**Golden rule:** BA and BB never open the same file. Module folders are single-owner.

Suggested backend layout:
```
backend/
  prisma/            schema.prisma (frozen)  seed.ts (BA)
  src/
    lib/             prisma.ts, jwt.ts        (frozen after Hour 0)
    middleware/      auth.ts (requireAuth, requireRole), error.ts  (frozen after Hour 0)
    modules/
      auth/  vehicles/  drivers/  dashboard/  settings/     <- BA
      trips/ maintenance/ fuel-expense/ reports/            <- BB
    app.ts  server.ts   (mounts routers; BA scaffolds at Hour 0, then frozen)
```
Each module folder holds `*.routes.ts`, `*.service.ts` (logic), `*.controller.ts`. Keep validation in the service.

---

## Hour 0:00–0:30 — WHOLE TEAM (do this together, once)
- Create the Neon/Supabase DB, put `DATABASE_URL` + `JWT_SECRET` in `backend/.env`.
- Drop in `schema.prisma`, run `npx prisma migrate dev --name init` and `npx prisma generate`.
- **BA** scaffolds `app.ts`/`server.ts`, `lib/prisma.ts`, `lib/jwt.ts`, `middleware/auth.ts` + `middleware/error.ts`, and an empty router per module so BB can start immediately. After this, those files are **frozen**.
- Confirm the endpoint map in `CONTRACT.md` is agreed. **Freeze the contract.**
- **Acceptance:** `npm run dev` boots, `GET /api/health` returns 200, `npx prisma studio` shows all 8 tables.

---

## BA — Backend A (Pod 1: Identity & Assets)

### 0:30–1:45 — Auth + RBAC
- `modules/auth`: `POST /register`, `POST /login` (bcrypt + JWT with `{ userId, role }`), `GET /me`.
- `middleware/auth.ts`: `requireAuth` (verifies token) and `requireRole(...roles)`.
- Write `prisma/seed.ts` with the seed data from `CONTRACT.md`; run it.
- **Files:** `modules/auth/**`, `prisma/seed.ts`. **Do NOT touch** any `modules/trips|maintenance|...` or the frozen files.
- **Acceptance:** `curl POST /api/auth/login` with `manager@transitops.dev / demo1234` returns a token; a protected route rejects a missing token with 401.

### 1:45–3:30 — Vehicle + Driver CRUD (centerpiece for Pod 1)
- `modules/vehicles`: full CRUD. Enforce **unique `regNo`** → return 409 `{ "error": "Registration number already exists" }`. Support `?type= &status= &region= &search= &sort=`.
- `modules/drivers`: full CRUD. Enforce unique `licenseNo`. Support `?status= &search= &sort=`.
- **Acceptance:** create VAN-05; creating a second VAN-05 returns 409. `GET /vehicles?status=AVAILABLE` filters correctly. These endpoints are what BB's `dispatch-options` and the dashboard read from, so they must be live by Checkpoint 3:30.

### 3:30–4:45 — Dashboard + Settings
- `modules/dashboard`: `GET /dashboard/kpis` — compute every KPI + `vehicleStatusBreakdown` + `recentTrips` (join trips). Honor `type/status/region` filters.
- `modules/settings`: `GET /settings/permissions` — return the role×module matrix from a static config object.
- **Acceptance:** KPI numbers match what `prisma studio` shows; changing a vehicle's status and re-hitting `/dashboard/kpis` moves the counts.

### 4:45–5:45 — Polish
- Search/sort on vehicle + driver lists; sensible defaults; input validation everywhere.
- **Acceptance:** `?search=van&sort=odometer` works; bad payloads return 422 not 500.

---

## BB — Backend B (Pod 2: Operations & Financials — the hard half)

### 0:30–1:45 — Trip schema wiring + rule-engine skeleton
- Build `modules/trips/trips.service.ts` with the validation functions **stubbed and unit-testable**: `assertVehicleAvailable`, `assertDriverAssignable`, `assertLicenseValid`, `assertCargoWithinCapacity`. Not wired to routes yet.
- Stand up `GET /trips` and `GET /trips/dispatch-options` returning real data.
- **Files:** `modules/trips/**` only. **Do NOT touch** `modules/vehicles` — read vehicles via `prisma.vehicle`, never by editing BA's files.
- **Acceptance:** `GET /trips/dispatch-options` already excludes the seeded IN_SHOP vehicle (MINI-03) and the SUSPENDED driver (Suresh).

### 1:45–3:30 — FULL rule engine (this is THE task)
Implement per `CONTRACT.md` "THE RULE ENGINE" section, each inside `prisma.$transaction`:
- `POST /trips` (create Draft + all 4 validations, 422 with the exact `message` strings).
- `POST /trips/:id/dispatch` (→ ON_TRIP for both, re-validate).
- `POST /trips/:id/complete` (→ AVAILABLE for both, update odometer, auto-create FuelLog).
- `POST /trips/:id/cancel` (→ AVAILABLE for both).
- **Acceptance (non-negotiable gate):** run the golden path from `CONTRACT.md` end to end via curl — dispatch VAN-05+Alex, confirm both flip to ON_TRIP in the DB, complete, confirm both flip back. Try cargo 600 kg on a 500 kg van → 422 with the capacity message. Try Suresh (suspended) → 422.

### 3:30–4:45 — Maintenance + Fuel & Expense
- `modules/maintenance`: `POST /maintenance` (OPEN log → vehicle IN_SHOP, transactional), `POST /:id/close` (→ AVAILABLE unless RETIRED), `GET /maintenance`.
- `modules/fuel-expense`: fuel + expense CRUD, `GET /operations/cost-summary` (Fuel + Maintenance per vehicle).
- **Acceptance:** opening maintenance on VAN-05 makes it vanish from `GET /trips/dispatch-options`; closing it brings it back.

### 4:45–5:45 — Reports + CSV
- `modules/reports`: `GET /reports` (fuel efficiency = distance/fuel, utilization, operational cost, ROI = `(revenue − (maint+fuel)) / acquisitionCost`, monthlyRevenue, topCostliestVehicles).
- `GET /reports/export.csv` streaming a CSV.
- **Acceptance:** numbers reconcile with fuel/maintenance/trip rows; CSV downloads and opens in Excel.

---

## 5:45–6:30 — Cross-pod bug bash (BA + BB pair)
Stress the rule engine together (BB drives, BA reads DB state): overweight cargo, expired license (temporarily set Alex's expiry to the past), suspended driver, duplicate regNo, double-booking the same vehicle, cancel-then-redispatch. Fix in the owning module only.

## 6:30–8:00 — Buffer / bonus / demo support
Pick from bonus list only if core is green: email/console reminder for licenses expiring < 30 days (BA), PDF export of reports (BB), extra filters. Otherwise harden and support FE integration. Keep a screen-recorded backup of the working golden path.
