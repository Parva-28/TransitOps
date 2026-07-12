# TransitOps — Project Conventions

## Branch Strategy
- One branch per person. Never push to `main`.
- Branch names: `be/auth-vehicles-BA`, `be/trips-BB`, `fe/pod1-FA`, `fe/pod2-FB`
- PR at each checkpoint: 1:45 / 3:30 / 4:45 / 5:45
- Rebase on `main` before opening a PR. Resolve conflicts in YOUR files only.
- Commit messages: `[BA] vehicles CRUD + unique regNo guard`

## File Ownership (STRICTLY ENFORCED)
- BA owns: `backend/src/modules/{auth,vehicles,drivers,dashboard,settings}/**`, `backend/prisma/seed.ts`
- BB owns: `backend/src/modules/{trips,maintenance,fuel-expense,reports}/**`
- FA owns: `frontend/src/pages/{Login,Dashboard,Vehicles,Drivers,Settings}/**`
- FB owns: `frontend/src/pages/{Trips,Maintenance,FuelExpense,Reports}/**`

## FROZEN Files (nobody edits solo)
- `backend/prisma/schema.prisma`
- `packages/contract/**`
- `backend/src/middleware/**`
- `backend/src/lib/**`
- `frontend/src/components/ui/**`
- `frontend/src/lib/api.ts`

## API & Code Conventions
- All business logic in `*.service.ts` — controllers are thin
- All validations return 422 with `{ error: "VALIDATION_FAILED", message: "..." }`
- All status-changing ops wrapped in `prisma.$transaction`
- Frontend never hardcodes enum strings — import from `packages/contract/labels.ts`
- Frontend never invents endpoint fields — import from `packages/contract/types.ts`

## Environment
- Backend `.env`: DATABASE_URL (Supabase), JWT_SECRET
- Frontend `.env`: VITE_USE_MOCKS=true (flip to false when endpoints are live)
- Backend dev server: port 4000
- Frontend dev server: port 5173 with Vite proxy /api → :4000
