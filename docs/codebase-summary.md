# Codebase Summary

## Project: Wedding Planner

Production-ready React + Vercel serverless full-stack scaffold. All tech stack components integrated and configured.

## Core Files

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | Dependencies + build scripts | Active |
| `vite.config.ts` | Frontend build + React + Tailwind plugin | Active |
| `tsconfig.*.json` | TypeScript strict mode + path aliases | Active |
| `tailwind.config.js` | Tailwind v4 configuration | Auto-generated |
| `.env.example` | Required environment variables | Template |

## Frontend

| Directory | Purpose | Status |
|-----------|---------|--------|
| `src/main.tsx` | React entry point | Active |
| `src/App.tsx` | Root component; applies theme CSS vars | Active |
| `src/data/themes.ts` | Theme definitions (AppTheme interface + 4 themes) | Active |
| `src/components/ui/` | shadcn/ui components | 6 components ready |
| `src/components/layout/` | Layout wrappers | 3 components (header, footer, root) |
| `src/pages/` | Route-based pages | Empty (TBD) |
| `src/hooks/` | Custom React hooks | Empty (TBD) |
| `src/lib/utils.ts` | Tailwind merge utility | Active |
| `src/types/` | TypeScript definitions | Empty (TBD) |
| `src/index.css` | Global styles + custom utilities (text-2xs) + print styles | Active |
| `public/` | Static assets | Empty |

## Backend

| File | Purpose | Status |
|------|---------|--------|
| `api/health.ts` | Deployment health check | Active |
| `src/db/index.ts` | Database factory function | Active |
| `src/db/schema.ts` | Drizzle table definitions | Template (commented) |
| `src/lib/redis.ts` | Redis factory function | Active |

## Configuration Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config |
| `drizzle.config.ts` | Drizzle ORM migrations |
| `eslint.config.js` | Linting rules |
| `components.json` | shadcn/ui config |

## Dependencies (Key)

**Frontend:** React 19.2.4, Vite 7.3.1, TypeScript 5.9.3, Tailwind CSS 4.2.0, shadcn/ui 3.8.5

**Backend:** Drizzle ORM 0.45.1, Neon serverless, Upstash Redis 1.36.2

**Tooling:** ESLint, Drizzle Kit, TypeScript compiler

## Environment Setup

Required env vars (see `.env.example`):
- `DATABASE_URL` - Neon PostgreSQL connection
- `UPSTASH_REDIS_REST_URL` - Redis endpoint
- `UPSTASH_REDIS_REST_TOKEN` - Redis auth

## Build Pipeline

```
Source → TypeScript Check → Vite Bundle → Vercel Deploy
```

Scripts:
- `npm run dev` - Local development
- `npm run build` - Production bundle
- `npm run lint` - Code linting
- `npm run db:*` - Database migrations

## Theme System

App-wide theming via CSS variables. Four themes available (Traditional Red, Blush Pink, Navy Blue, Sage Green).

**Data Layer:** `src/data/themes.ts`
- `AppTheme` interface defines 11 color tokens per theme (primary, surface, border, notes, etc.)
- `THEMES` array holds 4 pre-configured theme objects
- Each theme includes HSL values for shadcn --primary override

**Application Layer:** `src/App.tsx`
- Applies theme tokens to root element style as CSS vars (`--theme-surface`, `--theme-border`, etc.)
- All components consume vars via inline styles or Tailwind arbitrary values

**Styling Layer:** `src/index.css`
- Declares CSS vars in @theme inline block
- text-2xs utility added (0.625rem font size)

## Current Limitations (TBD)

- No authentication implemented
- No database tables defined
- No page routes created
- No API endpoints (except health check)
- No real-time features
