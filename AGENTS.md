# AGENTS.md — Rules every coding agent on this repo must follow

> **Load this into your agent before you start.**
> - **Claude Code:** save this file as `CLAUDE.md` at the repo root (auto-loaded).
> - **Codex:** keep it named `AGENTS.md` at the repo root (auto-loaded).
> - **Cursor:** copy into `.cursor/rules/transitops.md` (or `.cursorrules`).
> - **Antigravity:** paste into the workspace Rules / context panel.
> All four of us are on the same repo with four different agents. These rules are what keep us from colliding.

## The one rule that prevents 90% of conflicts
**Only edit files you own.** Your task list names your files. If a task seems to require touching a file you don't own, STOP and ping the owner in chat — do not edit it "just this once."

## Ownership map
- **BA (Backend A):** `backend/src/modules/{auth,vehicles,drivers,dashboard,settings}/**`, `backend/prisma/seed.ts`
- **BB (Backend B):** `backend/src/modules/{trips,maintenance,fuel-expense,reports}/**`
- **FA (Frontend A):** `frontend/src/pages/{Login,Dashboard,Vehicles,Drivers,Settings}/**`
- **FB (Frontend B):** `frontend/src/pages/{Trips,Maintenance,FuelExpense,Reports}/**`

## FROZEN files — nobody edits solo after Hour 0
- `backend/prisma/schema.prisma`  ← the data contract
- `packages/contract/**`  ← shared TS types + enum label helpers
- `backend/src/middleware/**`, `backend/src/lib/**`  ← auth guard, prisma client, error handler
- `frontend/src/components/ui/**`  ← the shared shell (Sidebar, Table, Card, Button, StatusPill)
- `frontend/src/lib/api.ts`  ← the fetch client
Changing any of these needs a 30-second heads-up to all four + a re-sync (`prisma generate`, restart dev servers).

## Contract-first, always
- Read `CONTRACT.md` and `schema.prisma` before writing anything.
- Backend returns exactly the shapes in `CONTRACT.md`. Frontend consumes exactly those shapes.
- Never invent endpoint names or response fields. If something's missing, it's a contract change → announce it.
- Never hardcode enum strings. Import from `packages/contract` and use the label formatter for display.

## Frontend: mock-until-live (never block on backend)
- All API calls go through `frontend/src/lib/api.ts`.
- Until the real endpoint is confirmed live, return data from `frontend/src/lib/mocks.ts` (shaped per `CONTRACT.md`).
- Flip `USE_MOCKS=false` in `.env` to hit the real API. You should be able to build every screen fully before backend is done.

## Git discipline
- One branch per person: `be/auth-vehicles-BA`, `be/trips-BB`, `fe/pod1-FA`, `fe/pod2-FB`.
- Never push to `main`. Open a PR at each checkpoint (1:45 / 3:30 / 4:45 / 5:45).
- Rebase on `main` before opening a PR. Resolve conflicts in YOUR files only.
- Commit messages: `[BA] vehicles CRUD + unique regNo guard`.

## Every task is done only when its acceptance check passes
Each task in your plan ends with an **Acceptance** line. Treat it as the definition of done — verify it (curl the endpoint / click the screen) before moving on. Don't report a task complete on "the code looks right."

## Quality floor (cheap, do it as you go)
- Backend: validate input, return proper status codes (200/201/401/404/422), wrap status-changing ops in `prisma.$transaction`.
- Frontend: loading + empty + error states on every data view; keyboard focus visible; responsive to mobile.
- No secrets in code — DB URL and JWT secret come from `.env`.
