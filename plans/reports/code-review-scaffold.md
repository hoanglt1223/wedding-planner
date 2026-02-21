# Code Review: Wedding Planner Scaffold

**Date:** 2026-02-21
**Scope:** Initial scaffold - config files, project structure, service connectors, health endpoint
**Files Reviewed:** 20+
**LOC (non-generated):** ~150

---

## Overall Assessment

Solid scaffold. Clean config, proper secrets handling, good shadcn/Tailwind v4 setup, correct Vercel serverless structure. TypeScript compiles cleanly. Three minor ESLint issues, one real code issue in the health endpoint, and one config gap worth addressing before feature development begins.

---

## Critical Issues

**None found.** No secrets committed, `.env` properly gitignored, no security vulnerabilities.

---

## High Priority

### 1. `api/health.ts` - Unused `request` parameter (lint error, blocks CI)

**File:** `D:/Projects/wedding-planner/api/health.ts` line 2

```typescript
// Current
async fetch(request: Request): Promise<Response> {
// Fix - prefix with underscore
async fetch(_request: Request): Promise<Response> {
```

ESLint reports `@typescript-eslint/no-unused-vars` for `request`. If lint runs in CI, this blocks deployment.

### 2. `api/health.ts` - Health endpoint exposes environment name

**File:** `D:/Projects/wedding-planner/api/health.ts` line 6

```typescript
environment: process.env.VERCEL_ENV ?? "development",
```

Returning the deployment environment in a public, unauthenticated endpoint is a minor information disclosure. Acceptable during development but should be gated or removed before production. Not blocking, but flag for later.

### 3. `tsconfig.node.json` - Does not include `api/` directory

**File:** `D:/Projects/wedding-planner/tsconfig.node.json` line 25

```json
// Current
"include": ["vite.config.ts"]
// Should be
"include": ["vite.config.ts", "drizzle.config.ts", "api/**/*.ts"]
```

The `drizzle.config.ts` and `api/health.ts` files use Node APIs (`process.env`) and are not covered by either tsconfig. `tsconfig.app.json` only includes `src/` and has `"types": ["vite/client"]` (no Node types). The `tsconfig.node.json` only includes `vite.config.ts`. This means `api/health.ts` and `drizzle.config.ts` get no type checking from `tsc -b`. Adding them to `tsconfig.node.json` (which already has `"types": ["node"]`) gives proper type coverage.

---

## Medium Priority

### 4. `drizzle.config.ts` - Non-null assertion on env var

**File:** `D:/Projects/wedding-planner/drizzle.config.ts` line 8

```typescript
url: process.env.DATABASE_URL!,
```

Unlike `src/db/index.ts` which properly validates the env var, the drizzle config uses a non-null assertion. Drizzle-kit will throw an opaque error at runtime if `DATABASE_URL` is unset. Consider adding a guard:

```typescript
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL required for drizzle-kit");
// ...
url: databaseUrl,
```

### 5. `src/db/schema.ts` - Entirely commented out

**File:** `D:/Projects/wedding-planner/src/db/schema.ts`

The schema file is fully commented out. `drizzle.config.ts` references `./src/db/schema.ts` as the schema source. Running `db:generate` or `db:migrate` against an empty schema will either no-op or error. Acceptable for scaffold, but document that schema must be defined before running any db commands.

### 6. ESLint warnings on shadcn UI components

**Files:** `D:/Projects/wedding-planner/src/components/ui/badge.tsx`, `D:/Projects/wedding-planner/src/components/ui/button.tsx`

Two `react-refresh/only-export-components` errors on auto-generated shadcn files. These are false positives on vendor-managed code. Fix by adding an ESLint ignore for the `ui/` directory:

```javascript
// eslint.config.js - add to globalIgnores
globalIgnores(['dist', 'src/components/ui'])
```

Or more precisely, disable the react-refresh rule for that directory only.

---

## Low Priority

### 7. `.gitignore` - Duplicate entries

**File:** `D:/Projects/wedding-planner/.gitignore` lines 23, 49 (`.DS_Store`) and lines 24, 50 (`Thumbs.db`)

`.DS_Store` and `Thumbs.db` appear twice. Cosmetic only.

### 8. Missing `link` favicon in `index.html`

**File:** `D:/Projects/wedding-planner/index.html`

No favicon link. Browsers will request `/favicon.ico` and get a 404. Add a placeholder or `<link rel="icon" href="data:,">` to suppress the request.

### 9. No router installed

**File:** `D:/Projects/wedding-planner/package.json`

No routing library (react-router, tanstack-router, etc.) in dependencies. `App.tsx` is a single view. Expected for scaffold, but will be needed before adding pages. Note for next phase.

---

## Positive Observations

- **Clean factory functions** in `src/db/index.ts` and `src/lib/redis.ts` - proper env var validation with descriptive error messages, lazy instantiation pattern (no top-level side effects)
- **Correct Vercel serverless setup** - `api/health.ts` uses Web API export format, `vercel.json` rewrites are correct (API passthrough + SPA fallback)
- **Tailwind v4 + shadcn** properly configured - using `@tailwindcss/vite` plugin (correct for v4), CSS variables with oklch color space, `@import "shadcn/tailwind.css"` approach
- **TypeScript strict mode** enabled in both tsconfigs with good linting options (`noUnusedLocals`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`)
- **Path aliases** consistently configured across `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`, and `components.json` (`@/` maps to `src/`)
- **No secrets committed** - `.env` does not exist in repo, `.env.example` uses placeholder values only
- **Layout components** follow good composition pattern - `RootLayout` wraps `Header` + `Footer` + children slot

---

## Metrics

| Metric | Value |
|--------|-------|
| TypeScript compilation | Clean (0 errors) |
| ESLint | 3 errors (1 real, 2 shadcn false positives) |
| Security issues | 0 critical |
| Missing env var guards | 1 (`drizzle.config.ts`) |
| Test coverage | N/A (no tests yet - expected for scaffold) |

---

## Recommended Actions (Priority Order)

1. **Fix `api/health.ts` unused param** - rename `request` to `_request` (5 seconds, unblocks CI lint)
2. **Expand `tsconfig.node.json` include** - add `drizzle.config.ts` and `api/**/*.ts` for type coverage
3. **Add ESLint ignore for `src/components/ui/`** - suppress false positives on generated code
4. **Add env var guard in `drizzle.config.ts`** - match the pattern used in `src/db/index.ts`
5. **Add favicon placeholder to `index.html`** - suppress 404 requests

---

## Unresolved Questions

- Is the `radix-ui` top-level package (line 23, `package.json`) intentional? shadcn typically installs individual `@radix-ui/*` scoped packages. The `radix-ui` meta-package is larger. Verify this was installed by `shadcn` CLI v3.8+ (which may use the consolidated package) vs an accidental install.
