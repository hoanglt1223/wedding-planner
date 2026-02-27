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
| `src/data/regions.ts` | Region type system (North/Central/South + `RegionalContent<T>` helper) | Active |
| `src/components/ui/` | shadcn/ui components | 6 components ready |
| `src/components/layout/` | Layout wrappers | 7 components (header, footer, root, region-selector, theme-picker, topbar, scrollable-tab-bar) |
| `src/components/wedding/` | Wedding-specific UI | 13 components (ceremony, steps, checklist, family-roles, collapsible-detail, etc.) |
| `src/components/calendar/` | Auspicious date picker | 4 components (calendar, day-cell, detail-modal, couple-compatibility) |
| `src/components/rsvp/` | RSVP guest landing page | 5 components (hero, event-details, couple-story, form, thank-you) |
| `src/components/guests/` | Guest management dashboard | 7 components (stats-bar, settings-form, generate-links, qr-modal, response-table, export-actions, dashboard) |
| `src/pages/` | Route-based pages | Empty (TBD) |
| `src/hooks/` | Custom React hooks | use-wedding-store, use-local-storage, use-ai-reading |
| `src/lib/utils.ts` | Tailwind merge utility | Active |
| `src/lib/i18n.ts` | Translation function: `t(key, lang)` | Active |
| `src/lib/format.ts` | Locale utilities & formatting with lang parameter | Active |
| `src/types/` | TypeScript definitions | wedding.ts with WeddingState, Region, RegionalContent types |
| `src/index.css` | Global styles + custom utilities (text-2xs) + print styles | Active |
| `public/` | Static assets | Empty |

## Backend

| File | Purpose | Status |
|------|---------|--------|
| `api/health.ts` | Deployment health check | Active |
| `api/rsvp.ts` | Bulk create & fetch RSVP invitations | Active |
| `api/rsvp/respond.ts` | One-time atomic RSVP response submission | Active |
| `api/rsvp/list.ts` | Dashboard: fetch all responses (rate-limited) | Active |
| `src/db/index.ts` | Database factory function | Active |
| `src/db/schema.ts` | Drizzle table definitions (includes rsvp_invitations) | Active |
| `src/lib/redis.ts` | Redis factory function | Active |

## Configuration Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config |
| `drizzle.config.ts` | Drizzle ORM migrations |
| `eslint.config.js` | Linting rules |
| `components.json` | shadcn/ui config |

## Dependencies (Key)

**Frontend:** React 19.2.4, Vite 7.3.1, TypeScript 5.9.3, Tailwind CSS 4.2.0, shadcn/ui 3.8.5, @dqcai/vn-lunar 1.0.1, nanoid 5.x, qrcode 1.5.x

**Backend:** Drizzle ORM 0.45.1, Neon serverless, Upstash Redis 1.36.2, ZhipuAI SDK

**Tooling:** ESLint, Drizzle Kit, TypeScript compiler, @upstash/ratelimit, @types/qrcode

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

## Internationalization (i18n)

English and Vietnamese language support with centralized translation system.

**Core Files:**
- `src/lib/i18n.ts` — `t(key, lang)` function + `getLangLabel(lang)` for UI display
- `src/lib/i18n-translations.ts` — ~200 translation key-value pairs (vi/en)
- `src/data/resolve-data.ts` — 7 lang-aware data getter functions

**Data Translation Files (26 .en.ts files):**
- `wedding-steps*.en.ts` (7 files) — Wedding ceremony steps
- `budget-categories.en.ts` — Budget categories
- `ideas.en.ts` — Planning ideas
- `ai-prompts.en.ts` — AI chat prompts
- `astrology-zodiac-profiles.en.ts` — Zodiac personality profiles
- `astrology-element-profiles.en.ts` — Element profiles (Wood, Fire, Earth, Metal, Water)
- `astrology-yearly-forecast.en.ts` — 2026 yearly forecasts
- `family-roles/roles.en.ts` — Family role responsibilities per phase
- `family-roles/etiquette.en.ts` — 5 etiquette rules with regional notes
- `traditional-items/items-*.en.ts` (4 files) — 33 traditional items across 4 phases with regional quantities

**Format Utilities:**
- `src/lib/format.ts` — `getLocale(lang)`, `getCurrencySymbol(lang)`, `formatMoney(n, lang)`, `formatShort(n, lang)`

**Component Pattern:**
- All components accept optional `lang?: string` prop (default: "vi")
- Language stored in `WeddingState.lang`, toggled via Settings UI

## RSVP System

**Purpose:** Manage wedding guest RSVPs with token-based guest landing pages and admin dashboard.

**Guest Page Route:** `#/rsvp/:token`

**Components:**
- Guest page: `rsvp-hero`, `rsvp-event-details`, `rsvp-couple-story`, `rsvp-form`, `rsvp-thank-you`
- Admin dashboard: `rsvp-stats-bar`, `rsvp-settings-form`, `rsvp-generate-links`, `rsvp-qr-modal`, `rsvp-response-table`, `rsvp-export-actions`

**Database Table:** `rsvp_invitations` (10 cols: id, user_id, guest_name, token, status, plus_ones, dietary, message, responded_at, created_at)

**API Endpoints:**
- `POST/GET /api/rsvp` — Bulk create + fetch by token
- `POST /api/rsvp/respond` — One-time atomic response submission
- `GET /api/rsvp/list` — Dashboard listing (rate-limited)

**State:** `WeddingState.rsvpSettings: RsvpSettings`, `Guest.rsvpToken?: string`, localStorage v14
