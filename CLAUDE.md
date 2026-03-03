# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # TypeScript check + Vite production build (tsc -b && vite build)
pnpm lint         # ESLint
pnpm preview      # Preview production build locally
pnpm db:generate  # Generate Drizzle migration files
pnpm db:migrate   # Drizzle migrations against Neon
pnpm db:studio    # Open Drizzle Studio GUI
npx vercel        # Deploy to Vercel
```

No test framework is configured. `.npmrc` sets `legacy-peer-deps=true`.

## Tech Stack

- **Frontend:** Vite 7 + React 19 + TypeScript 5.9 (strict mode, `verbatimModuleSyntax`)
- **Styling:** Tailwind CSS v4 (CSS-first via `@tailwindcss/vite` plugin — no `tailwind.config.js`/`postcss.config.js`). Custom theme tokens set as CSS variables in `src/index.css`.
- **Components:** shadcn/ui (new-york style, neutral base, Radix UI unified package). Components live in `src/components/ui/` as owned source.
- **Backend:** Vercel Serverless Functions in `api/` directory using `VercelRequest`/`VercelResponse` types from `@vercel/node`.
- **Database:** Neon PostgreSQL via `drizzle-orm` with `neon-http` driver. Schema at `src/db/schema.ts`.
- **Cache:** Upstash Redis (rate limiting, ephemeral share links).
- **AI:** ZhipuAI (glm-5 model) for wedding consultation chat, accessed server-side only.

## Architecture

### Routing (Hash-based SPA)

`src/main.tsx` uses `window.location.hash` to route between top-level sections:
- `#/` or empty → `LandingPage` (marketing page)
- `#/app` → `App` (main wedding planner)
- `#/shared/:id` → `SharedPreviewPage` (view shared zodiac cards)
- `#/admin` → `AdminApp` (lazy-loaded admin dashboard)

Within the app, `PageRouter` (`src/pages/page-router.tsx`) switches on `state.page` for: `planning`, `astrology`, `cards`, `ai`, `handbook`, `ideas`.

### State Management

All app state lives in a single `WeddingState` object (defined in `src/types/wedding.ts`) persisted to localStorage via `useLocalStorage` hook. Key: `wp_v13`.

`useWeddingStore` (`src/hooks/use-wedding-store.ts`) is the central store — a custom hook returning state + setter callbacks. It is **not** a context provider; the store object is passed as props through the component tree.

State is synced to the backend via `useSync` hook which debounces (5s) POST requests to `/api/sync`, with visibility-change flush, 5-min heartbeat, and `sendBeacon` on unload.

### API Layer (`api/`)

Serverless functions use `VercelRequest`/`VercelResponse` pattern (not Web API `Request`/`Response`). Each file exports a default handler function.

- `api/sync.ts` — Upserts user session data to PostgreSQL (rate-limited via Upstash)
- `api/ai/chat.ts` — Proxies prompts to ZhipuAI API (server-side key, 25s timeout)
- `api/share.ts` — Create/retrieve ephemeral share links stored in Redis (10-min TTL)
- `api/health.ts` — Health check with DB/Redis connectivity status
- `api/track.ts` — Analytics event ingestion
- `api/admin/` — Admin panel endpoints with cookie-based session auth (`_auth.ts` shared helpers)

Factory functions `createDb()` (`src/db/index.ts`) and `createRedis()` (`src/lib/redis.ts`) instantiate clients per-request — no module-level side effects.

### i18n / Regionalization

Bilingual: Vietnamese (default) and English. Data files are duplicated with `.en.ts` suffix (e.g., `wedding-steps.ts` / `wedding-steps.en.ts`). Resolver functions in `src/data/resolve-data.ts` select by `lang` parameter.

Three Vietnamese regions (north/central/south) affect wedding customs. `RegionalContent<T>` type in `src/data/regions.ts` provides region-specific content with a `default` fallback.

### Theming

Runtime themes defined in `src/data/themes.ts` as `AppTheme` objects with color tokens. Applied via CSS custom properties (`--theme-*`) set as inline styles on the root div in `App.tsx`. shadcn's `--primary`/`--primary-foreground` are overridden per-theme via HSL values.

### Key Data Model

Wedding steps are split across multiple files (`src/data/wedding-steps-*.ts`) representing phases of a Vietnamese wedding ceremony. Each `WeddingStep` contains `Ceremony[]` with checkable `CeremonyStep[]` items that drive the progress tracker.

Database has three tables (`src/db/schema.ts`): `user_sessions` (JSONB wedding data + denormalized profile fields), `analytics_events`, `admin_sessions`.

## Environment Variables

See `.env.example`. Required for backend functionality:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Redis for rate limiting & sharing
- `Z_AI_KEY` — ZhipuAI API key (server-side only)
- `ADMIN_PASSWORD` — Admin panel authentication

## Path Alias

`@/` maps to `./src/` (configured in `tsconfig.json` and `vite.config.ts`).

## TypeScript Configuration

Two tsconfig files referenced from the root:
- `tsconfig.app.json` — Frontend code in `src/`, targets ES2022, `jsx: react-jsx`
- `tsconfig.node.json` — Build tooling + API: includes `vite.config.ts`, `drizzle.config.ts`, and `api/**/*.ts`

Both use strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`.
