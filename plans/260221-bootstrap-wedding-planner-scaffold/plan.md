---
title: "Bootstrap Wedding Planner Scaffold"
description: "Scaffold a Vite 7 + React 19 + TypeScript project with Tailwind v4, shadcn/ui, Vercel serverless, Neon DB, and Upstash Redis"
status: completed
priority: P1
effort: 3h
branch: main
tags: [scaffold, vite, react, tailwind, shadcn, vercel, neon, drizzle, redis]
created: 2026-02-21
---

# Bootstrap Wedding Planner Scaffold

## Summary

Set up a production-ready scaffold with zero business logic. Establishes the full tech stack: Vite 7.x + React 19, Tailwind CSS v4, shadcn/ui, Vercel serverless API, Neon PostgreSQL via Drizzle ORM, and Upstash Redis.

## Key Dependencies

- Node.js 20.19+ or 22.12+
- npm (package manager)
- Vite 7.x with `@vitejs/plugin-react`
- React 19 + TypeScript 5.x
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- shadcn/ui (new-york style, neutral base color)
- `@neondatabase/serverless` + `drizzle-orm` + `drizzle-kit`
- `@upstash/redis`
- Vercel CLI (optional, for local dev)

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Scaffold Vite + React + TypeScript | completed | [phase-01](./phase-01-scaffold-vite-react.md) |
| 2 | Configure Tailwind CSS v4 + shadcn/ui | completed | [phase-02](./phase-02-configure-tailwind-shadcn.md) |
| 3 | Setup Serverless API Structure | completed | [phase-03](./phase-03-setup-serverless-api.md) |
| 4 | Setup Database & Redis Helpers | completed | [phase-04](./phase-04-setup-database-redis.md) |
| 5 | Setup Project Structure & Config | completed | [phase-05](./phase-05-setup-project-structure.md) |
| 6 | Finalize & Verify | completed | [phase-06](./phase-06-finalize-verify.md) |

## Phase Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

All phases are sequential; each builds on the previous.

## Research Reports

- [Vite + React Setup](../reports/researcher-vite-react-setup.md)
- [Vercel Serverless API](../reports/researcher-vercel-serverless-api.md)
- [shadcn + Tailwind v4](../reports/researcher-shadcn-tailwind-v4.md)

## Success Criteria

- `npm run dev` starts Vite dev server on localhost:5173
- `npm run build` completes with zero errors
- `tsc --noEmit` passes type checking
- shadcn components render correctly
- `/api/health` endpoint responds with status JSON
- All placeholder directories exist per project structure
