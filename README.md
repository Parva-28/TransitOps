# TransitOps — Build Kit (4 devs, 8 hours, 4 agents)

A screening-round build kit for the TransitOps hackathon. Four people, two backend + two frontend, each driving their own coding agent (Claude Code / Antigravity / Cursor / Codex) on one shared repo — with the guardrails that keep four parallel agents from colliding.

## What's in here
| File | Who reads it | Purpose |
|---|---|---|
| `README.md` | everyone | This map + Hour-0 setup |
| `AGENTS.md` | everyone (load into your agent) | The conflict-avoidance rules |
| `CONTRACT.md` | everyone | Frozen API contract, rule-engine spec, seed data |
| `schema.prisma` | backend | Ready-to-use Postgres schema |
| `PLAN_BACKEND.md` | BA + BB | Hour-by-hour backend tasks |
| `PLAN_FRONTEND.md` | FA + FB | Hour-by-hour frontend tasks |

## Tech stack
- **Backend:** Node + TypeScript + Express + Prisma + Postgres (Neon/Supabase), JWT auth.
- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui + TanStack Query + Recharts.
- **Monorepo** with a shared types package so both sides compile against the same contract.

## Architecture in one breath
React SPA → REST API (`/api`) → Prisma → Postgres. Feature-folder modules on the backend, one owner each. The one true coupling point is the vehicle/driver **status** column: BA writes it via CRUD, BB writes it via the rule engine — different files, same column, agreed once in `schema.prisma` and never reshaped. That's why there are no merge conflicts.

```
transitops/
  packages/contract/     shared TS types + enum label helpers   (FROZEN after Hour 0)
  backend/               Express + Prisma  (BA + BB, module folders)
  frontend/              Vite + React      (FA + FB, page folders)
```

## The four roles
- **BA** — Auth/RBAC, Vehicles, Drivers, Dashboard, Settings (lighter, more screens)
- **BB** — Trips (the rule engine), Maintenance, Fuel & Expense, Reports (the hard half)
- **FA** — Login, Dashboard, Vehicle Registry, Drivers, Settings screens
- **FB** — Trip Dispatcher, Maintenance, Fuel & Expense, Reports screens

## How each person starts (per agent)
1. Clone the repo, then load `AGENTS.md` into your agent the way your tool expects (Claude Code → rename to `CLAUDE.md`; Codex → keep as `AGENTS.md`; Cursor → `.cursor/rules/`; Antigravity → Rules panel).
2. Open your plan (`PLAN_BACKEND.md` or `PLAN_FRONTEND.md`) and give your agent **only your own tasks**, one checkpoint block at a time. Point it at `CONTRACT.md` every time.
3. Work on your own branch. Open a PR at each checkpoint.

## Hour 0 (everyone together, ~30 min — the only mandatory overlap)
1. Create the Neon/Supabase DB; put `DATABASE_URL` + `JWT_SECRET` in `backend/.env`.
2. `schema.prisma` → `npx prisma migrate dev` → `npx prisma generate` → seed.
3. BA scaffolds backend shell + middleware; FA+FB scaffold the frontend shell (`components/ui`). **Freeze** the shared files listed in `AGENTS.md`.
4. Agree the contract out loud, then lock it. Nobody deviates after this.

## Checkpoint gates (the whole team stops and verifies)
- **1:45** — Login works end-to-end; shared shell stable.
- **3:30** — The golden path (VAN-05 + Alex: create → dispatch → complete, both statuses cascade) works live. **Non-negotiable gate.**
- **4:45** — Every screen shows live data; no placeholders.
- **5:45** — Every Mandatory Deliverable is green; cross-pod bug bash done.
- **8:00** — Demo rehearsed, screen-recorded backup saved.

## Note on the 8-hour clock
The core build fits in ~6 hours (the plan's checkpoints). The last ~2 hours are buffer for hardening + bonus features (search/filter/sort, PDF export, license-expiry reminders — dark mode is already baked into the mockup). Don't start bonuses until the 5:45 gate is green.
