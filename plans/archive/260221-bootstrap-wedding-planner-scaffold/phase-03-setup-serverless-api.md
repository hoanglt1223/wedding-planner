---
phase: 3
title: "Setup Serverless API Structure"
status: pending
priority: P1
effort: 20m
---

# Phase 3: Setup Serverless API Structure

## Context Links

- [Vercel Serverless API Report](../reports/researcher-vercel-serverless-api.md)
- [Vercel Functions Docs](https://vercel.com/docs/functions/serverless-functions/quickstart)

## Overview

- **Priority:** P1
- **Status:** Pending
- **Description:** Create the `/api` directory with a health check endpoint, configure `vercel.json` for build/deploy settings and SPA rewrites, and set up `.env.example` with placeholder variables.

## Key Insights

- Files in `/api` auto-map to serverless routes on Vercel (file-based routing)
- Use Web API `Request`/`Response` pattern (not Next.js-style `req`/`res`)
- `vercel.json` rewrites handle SPA client-side routing (catch-all to index.html)
- `.env.local` already in `.gitignore` — safe for local secrets
- Health endpoint serves as connection test point for Phase 4

## Requirements

### Functional
- `/api/health` returns JSON `{ status: "ok", timestamp: ... }`
- `vercel.json` configures build command, output dir, and SPA rewrites
- `.env.example` documents required environment variables

### Non-Functional
- API handler uses Web standard `Request`/`Response` (not Node.js http)
- Handler exports default object with `fetch` method (Vercel convention for non-Next.js)

## Architecture

```
api/
  health.ts          → GET /api/health

vercel.json
  buildCommand       → "npm run build"
  outputDirectory    → "dist"
  rewrites           → catch-all to /index.html (SPA)
```

## Related Code Files

### Files to Create
- `api/health.ts`
- `vercel.json`
- `.env.example`

### Files to Verify
- `.gitignore` — confirm `.env.local` excluded (already done)

## Implementation Steps

1. **Create `/api` directory**
   ```bash
   mkdir -p api
   ```

2. **Create `api/health.ts`** — basic health check
   ```typescript
   export default {
     async fetch(request: Request): Promise<Response> {
       return Response.json({
         status: "ok",
         timestamp: new Date().toISOString(),
         environment: process.env.VERCEL_ENV ?? "development",
       });
     },
   };
   ```
   - Simple, no DB/Redis dependencies yet (added in Phase 4)
   - Uses `process.env.VERCEL_ENV` (auto-injected by Vercel)

3. **Create `vercel.json`**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   - API routes pass through; everything else falls back to SPA
   - Order matters: API rewrite before catch-all

4. **Create `.env.example`**
   ```bash
   # Database (Neon PostgreSQL)
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

5. **Verify `.gitignore` excludes `.env.local`**
   - Already confirmed: `.env.local` and `.env.*.local` are excluded

## Todo List

- [ ] Create `api/` directory
- [ ] Create `api/health.ts` with basic health check
- [ ] Create `vercel.json` with build config and SPA rewrites
- [ ] Create `.env.example` with placeholder variables
- [ ] Verify `.env.local` is in `.gitignore`

## Success Criteria

- `api/health.ts` exists with valid TypeScript
- `vercel.json` is valid JSON with correct buildCommand/outputDirectory
- `.env.example` documents all required env vars
- No `.env.local` or secrets committed to git

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API route conflicts with SPA rewrites | Low | Medium | API rewrite placed before catch-all in vercel.json |
| Accidental .env commit | Low | High | .gitignore already covers .env patterns |

## Security Considerations

- `.env.example` contains ONLY placeholder values, never real credentials
- `.env.local` excluded from git
- Health endpoint exposes no sensitive data (only status + timestamp)

## Next Steps

- Proceed to Phase 4: Setup Database & Redis Helpers
