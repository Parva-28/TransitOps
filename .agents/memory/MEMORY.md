# Memory Index

## Project
- [project] Always create a new dedicated branch for major code changes → project-conventions.md
- [project] TransitOps — fleet management monorepo, 4-person team, 8-hour build

## Team Setup
- [team] 4-person team: 2 backend (BA + BB), 2 frontend (FA + FB)
- [team] Current user = **BA** (Backend A) — owns: auth, vehicles, drivers, dashboard, settings, seed.ts
- [team] BA finishes first, then **BB** takes over: trips (rule engine), maintenance, fuel-expense, reports
- [team] FA + FB are working frontend in parallel

## Decisions (LOCKED)
- [decision] Database = **Supabase** (Postgres) — use Supabase connection string in backend/.env
- [decision] All architectural options = Option A (inline validation in rules.ts, packages/contract types, TanStack Query, JWT)
- [decision] Schema is FROZEN after Hour 0 — no changes without team heads-up + prisma generate on all machines

## Backend Context for BA handoff to BB
- [handoff] BA must have these endpoints live before BB starts: GET /vehicles, GET /drivers, GET /trips/dispatch-options reads from vehicles+drivers
- [handoff] The single coupling point = vehicle.status + driver.status columns — BA writes via CRUD, BB writes via rule engine
- [handoff] BB's modules: trips/, maintenance/, fuel-expense/, reports/ — never touch BA's module files
- [handoff] BB reads vehicles/drivers via prisma.vehicle / prisma.driver directly — never imports BA's service files

## Tech Stack
- [stack] Backend: Node + TypeScript + Express + Prisma + Supabase Postgres + JWT
- [stack] Frontend: React + TS + Vite + Tailwind + shadcn/ui + TanStack Query + Recharts
- [stack] Shared types: packages/contract/types.ts + labels.ts (FROZEN after Hour 0)
- [stack] Backend port: 4000 | Frontend port: 5173 | Vite proxy: /api → :4000

## Branch Names
- [git] be/auth-vehicles-BA (current user's branch)
- [git] be/trips-BB
- [git] fe/pod1-FA
- [git] fe/pod2-FB
- [git] PRs at checkpoints: 1:45 / 3:30 / 4:45 / 5:45

## BA Progress Tracker
- [ba-status] Phase 0 (Hour 0 scaffold): ⏳ pending
- [ba-status] Auth + RBAC (0:30–1:45): ⏳ pending
- [ba-status] Vehicle + Driver CRUD (1:45–3:30): ⏳ pending
- [ba-status] Dashboard + Settings (3:30–4:45): ⏳ pending
- [ba-status] Polish + search/sort (4:45–5:45): ⏳ pending
