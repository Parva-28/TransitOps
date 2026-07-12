# PLAN — FRONTEND (FA + FB)

**Stack:** React + TypeScript + Vite + Tailwind + shadcn/ui + TanStack Query + Recharts.
**Read first:** `CONTRACT.md`, `AGENTS.md`.
**Golden rule:** FA and FB never open the same page file. `components/ui/**` is built once at Hour 0, then frozen.

## Match the mockup — do not reinvent the look
You are judged against the attached Excalidraw mockup, so mirror its identity exactly. Design tokens to put in `tailwind.config` + a `theme.css` at Hour 0:

- **Surface:** near-black canvas `#0F1115`, panel `#171A21`, border `#262A33`.
- **Text:** primary `#E6E8EC`, muted `#8A909B`.
- **Primary action (the orange "Sign In / Dispatch / Add" buttons):** `#E8862E`.
- **Status pill colors (semantic — same everywhere, from a shared `<StatusPill>`):** AVAILABLE green `#2FBF71`, ON_TRIP/DISPATCHED blue `#3E7BFA`, IN_SHOP/OFF_DUTY amber `#E8A33D`, RETIRED/SUSPENDED red `#E5484D`.
- **Layout:** fixed left sidebar (nav items: Dashboard, Fleet, Drivers, Trips, Maintenance, Fuel & Expenses, Analytics, Settings) + top bar with search + role badge; content is cards and dense tables.
- **Type:** one clean sans (Inter) for UI; tabular-nums for all numeric table columns and KPIs.

The **signature** is the color-coded status pill doing real work — it appears on vehicles, drivers, trips, and maintenance, and it visibly changes when the rule engine flips a status. Keep everything else quiet so that cascade is the thing that pops in the demo.

Suggested layout:
```
frontend/src/
  components/ui/     Sidebar, Topbar, Table, Card, Button, StatusPill, Modal, Field  (built Hour 0, FROZEN)
  lib/              api.ts (fetch client, FROZEN), mocks.ts, queryClient.ts
  pages/
    Login/ Dashboard/ Vehicles/ Drivers/ Settings/     <- FA
    Trips/ Maintenance/ FuelExpense/ Reports/           <- FB
```

---

## Hour 0:00–0:30 — WHOLE TEAM
- **FA + FB together** scaffold Vite + Tailwind + shadcn, set the tokens above, and build the shared shell in `components/ui/**` + `lib/api.ts` + `lib/mocks.ts` (seeded from `CONTRACT.md`). Then **freeze these files** — neither of you edits them solo again.
- Set up React Router with the sidebar routes and a `<ProtectedRoute>` guard reading the JWT.
- **Acceptance:** the app runs, sidebar + topbar render in the dark theme, `<StatusPill status="ON_TRIP" />` shows the blue pill, and every page route loads a placeholder using the shared shell.

> After this point: **FA never opens a file under `pages/Trips|Maintenance|FuelExpense|Reports`; FB never opens `pages/Login|Dashboard|Vehicles|Drivers|Settings`.** Build against mocks so you never wait on backend (`USE_MOCKS=true`).

---

## FA — Frontend A (Pod 1 screens: 0, 1, 2, 3, 8)

### 0:30–1:45 — Login (screen 0)
- Pixel-match the mockup: brand block left, form right, role hint, orange Sign In, inline red error box for bad credentials.
- Wire to `POST /auth/login` (or mock), store token, redirect by role, guard routes.
- **Files:** `pages/Login/**`. **Acceptance:** valid login lands on Dashboard; wrong password shows the red inline error; visiting a protected route while logged out bounces to Login.

### 1:45–3:30 — Vehicle Registry (2) + Drivers & Safety (3)
- Table with search/filter/sort, status pills, "Add Vehicle" / "Add Driver" modal forms.
- Wire to `/vehicles` and `/drivers` CRUD. Show the 409 duplicate-regNo error inline on the form.
- **Files:** `pages/Vehicles/**`, `pages/Drivers/**`. **Acceptance:** can add/edit/delete a vehicle live; duplicate regNo shows the friendly error; filters + sort work against real data.

### 3:30–4:45 — Dashboard (1) + Settings & RBAC (8)
- Dashboard: 7 KPI cards, type/status/region filters, recent-trips table, vehicle-status breakdown bar — all from `GET /dashboard/kpis`.
- Settings: render the role×module permission matrix from `GET /settings/permissions`.
- **Files:** `pages/Dashboard/**`, `pages/Settings/**`. **Acceptance:** KPIs match backend; changing a filter re-queries; matrix renders all four roles.

### 4:45–5:45 — Polish
- Loading/empty/error states, responsive down to mobile, consistent spacing.
- **Acceptance:** every Pod 1 screen has all three data states and no horizontal scroll on a phone width.

---

## FB — Frontend B (Pod 2 screens: 4, 5, 6, 7)

### 0:30–1:45 — Static scaffolding for screens 4–7
- Build the layouts of Trip Dispatcher, Maintenance, Fuel & Expense, Reports using the shared shell + mocks (import-only — no edits to `components/ui`).
- **Files:** `pages/Trips|Maintenance|FuelExpense|Reports/**`. **Acceptance:** all four screens render fully from mock data.

### 1:45–3:30 — Trip Dispatcher (screen 4 — the centerpiece)
- Left: "Create Trip" form (source, destination, vehicle + driver dropdowns fed by `GET /trips/dispatch-options`, cargo, distance). Right: the **Live Board** of trips with status pills.
- Show the validation **red box verbatim** from the 422 `message` (capacity, license, suspended, double-book).
- Wire dispatch / complete / cancel buttons to their endpoints; refetch the board on success (TanStack Query invalidation) so pills flip live.
- **Files:** `pages/Trips/**`. **Acceptance (gate):** create → dispatch VAN-05 + Alex, board shows both as ON_TRIP; complete flips them back; a 600 kg cargo shows the red capacity message; suspended Suresh is not even selectable.

### 3:30–4:45 — Maintenance (5) + Fuel & Expense (6)
- Maintenance: service-record list, "Send to Shop" action, the AVAILABLE⇄IN_SHOP state arrow from the mockup. Opening a log must visibly move the vehicle to In Shop.
- Fuel & Expense: fuel log table + other-expenses table + "Total Operational Cost = Fuel + Maintenance" footer from `/operations/cost-summary`.
- **Files:** `pages/Maintenance/**`, `pages/FuelExpense/**`. **Acceptance:** opening maintenance on a vehicle flips its pill to IN_SHOP and it disappears from the dispatcher dropdown on refetch.

### 4:45–5:45 — Reports & Analytics (7)
- KPI strip (fuel efficiency, utilization, op cost, ROI), monthly-revenue bar chart + top-costliest-vehicles chart (Recharts), and a working **Download CSV** button hitting `/reports/export.csv`.
- **Files:** `pages/Reports/**`. **Acceptance:** charts render from `/reports`; CSV downloads.

---

## 5:45–6:30 — Cross-pod visual pass (FA + FB)
Joint responsive + consistency sweep: identical pill colors, spacing, and font sizes across all screens; fix contrast; confirm dark theme is uniform. Edit only your own pages.

## 6:30–8:00 — Buffer / bonus / demo
Only after core is green: micro-interactions on the status cascade, empty-state illustrations, PDF export button, license-expiry warning banner. Do one full timed run-through and screen-record a backup.

## Demo order (matches the pod split)
Pod 1 (FA): login/RBAC → Dashboard → Vehicle/Driver management. Pod 2 (FB): Trip Dispatcher live cascade → Maintenance cross-effect → Reports/ROI close.
