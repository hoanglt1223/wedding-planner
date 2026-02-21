---
phase: 4
title: "Setup Database & Redis Helpers"
status: pending
priority: P1
effort: 30m
---

# Phase 4: Setup Database & Redis Helpers

## Context Links

- [Vercel Serverless API Report](../reports/researcher-vercel-serverless-api.md) — sections 3-5
- [Drizzle ORM + Neon Docs](https://orm.drizzle.team/docs/connect-neon)
- [Upstash Redis Docs](https://upstash.com/docs/redis/howto/vercelintegration)

## Overview

- **Priority:** P1
- **Status:** Pending
- **Description:** Install database and caching dependencies. Create Drizzle ORM connection helper (Neon HTTP driver), Redis client helper, schema file, and drizzle config. Add migration scripts to package.json. Update health endpoint to optionally test connections.

## Key Insights

- Use `drizzle-orm/neon-http` driver — optimized for serverless (no persistent connections)
- Neon HTTP driver auto-closes connections; no cleanup needed in handlers
- `@upstash/redis` uses HTTP-based protocol — perfect for serverless (no TCP)
- `Redis.fromEnv()` reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` automatically
- Schema file left empty (with commented example) — no business logic in scaffold
- Drizzle Kit provides `db:generate`, `db:migrate`, `db:studio` commands

## Requirements

### Functional
- Drizzle ORM configured with Neon HTTP driver
- Redis helper initialized from env vars
- Empty schema file with commented example table
- `drizzle.config.ts` points to schema and output dirs
- `package.json` has drizzle migration scripts
- Health endpoint updated to test DB + Redis (graceful failure if no env vars)

### Non-Functional
- Connection helpers are singleton-pattern (one instance per module load)
- Helpers fail gracefully with clear error messages if env vars missing
- No hardcoded connection strings

## Architecture

```
src/db/
  index.ts       → Drizzle + Neon HTTP connection (exports `db`)
  schema.ts      → Drizzle table definitions (empty scaffold)

src/lib/
  redis.ts       → Upstash Redis client (exports `redis`)

drizzle.config.ts → Drizzle Kit config (schema path, output dir, driver)

api/
  health.ts      → Updated: tests DB + Redis connections
```

## Related Code Files

### Files to Create
- `src/db/index.ts`
- `src/db/schema.ts`
- `src/lib/redis.ts`
- `drizzle.config.ts`

### Files to Modify
- `package.json` — add drizzle scripts
- `api/health.ts` — add DB + Redis connection checks

## Implementation Steps

1. **Install dependencies**
   ```bash
   npm install @neondatabase/serverless drizzle-orm @upstash/redis
   npm install -D drizzle-kit
   ```

2. **Create `src/db/schema.ts`**
   ```typescript
   // import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

   // Example table (uncomment and modify when implementing features):
   //
   // export const users = pgTable("users", {
   //   id: serial("id").primaryKey(),
   //   name: text("name").notNull(),
   //   email: text("email").notNull().unique(),
   //   createdAt: timestamp("created_at").defaultNow().notNull(),
   // });
   ```

3. **Create `src/db/index.ts`**
   ```typescript
   import { neon } from "@neondatabase/serverless";
   import { drizzle } from "drizzle-orm/neon-http";

   export function createDb() {
     const databaseUrl = process.env.DATABASE_URL;
     if (!databaseUrl) {
       throw new Error("DATABASE_URL environment variable is not set");
     }
     const sql = neon(databaseUrl);
     return drizzle(sql);
   }
   ```
   - Factory function pattern — avoids module-level side effects
   - Throws clear error if env var missing

4. **Create `src/lib/redis.ts`**
   ```typescript
   import { Redis } from "@upstash/redis";

   export function createRedis() {
     const url = process.env.UPSTASH_REDIS_REST_URL;
     const token = process.env.UPSTASH_REDIS_REST_TOKEN;
     if (!url || !token) {
       throw new Error(
         "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set"
       );
     }
     return new Redis({ url, token });
   }
   ```

5. **Create `drizzle.config.ts`**
   ```typescript
   import { defineConfig } from "drizzle-kit";

   export default defineConfig({
     schema: "./src/db/schema.ts",
     out: "./drizzle",
     dialect: "postgresql",
     dbCredentials: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

6. **Add scripts to `package.json`**
   ```json
   {
     "scripts": {
       "db:generate": "drizzle-kit generate",
       "db:migrate": "drizzle-kit migrate",
       "db:studio": "drizzle-kit studio"
     }
   }
   ```

7. **Update `api/health.ts`** — add connection checks
   ```typescript
   export default {
     async fetch(request: Request): Promise<Response> {
       const checks: Record<string, string> = {
         status: "ok",
         timestamp: new Date().toISOString(),
         environment: process.env.VERCEL_ENV ?? "development",
       };

       // Database check
       if (process.env.DATABASE_URL) {
         try {
           const { neon } = await import("@neondatabase/serverless");
           const sql = neon(process.env.DATABASE_URL);
           await sql`SELECT 1`;
           checks.database = "connected";
         } catch {
           checks.database = "error";
         }
       } else {
         checks.database = "not_configured";
       }

       // Redis check
       if (
         process.env.UPSTASH_REDIS_REST_URL &&
         process.env.UPSTASH_REDIS_REST_TOKEN
       ) {
         try {
           const { Redis } = await import("@upstash/redis");
           const redis = new Redis({
             url: process.env.UPSTASH_REDIS_REST_URL,
             token: process.env.UPSTASH_REDIS_REST_TOKEN,
           });
           await redis.ping();
           checks.redis = "connected";
         } catch {
           checks.redis = "error";
         }
       } else {
         checks.redis = "not_configured";
       }

       return Response.json(checks);
     },
   };
   ```

## Todo List

- [ ] Install @neondatabase/serverless, drizzle-orm, @upstash/redis
- [ ] Install drizzle-kit as dev dependency
- [ ] Create `src/db/schema.ts` with commented example
- [ ] Create `src/db/index.ts` with Drizzle + Neon HTTP helper
- [ ] Create `src/lib/redis.ts` with Upstash Redis helper
- [ ] Create `drizzle.config.ts`
- [ ] Add db:generate, db:migrate, db:studio scripts to package.json
- [ ] Update `api/health.ts` with DB + Redis connection checks
- [ ] Verify TypeScript compiles (`tsc --noEmit`)

## Success Criteria

- All dependencies installed without conflicts
- `src/db/index.ts` exports `createDb()` function
- `src/lib/redis.ts` exports `createRedis()` function
- `drizzle.config.ts` points to correct schema path
- `npm run db:generate` command exists (will fail without DATABASE_URL — expected)
- `tsc --noEmit` passes
- Health endpoint returns JSON with database/redis status fields

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Drizzle Kit version incompatibility | Low | Medium | Use latest stable versions |
| Missing env vars crash app | Medium | Low | Factory pattern with explicit error messages; health endpoint checks gracefully |
| Type conflicts between neon + drizzle | Low | Low | Both maintained by same ecosystem |

## Security Considerations

- No hardcoded credentials anywhere — all via env vars
- Factory functions prevent accidental module-level connections
- Health endpoint does NOT expose connection strings or credentials
- `.env.local` with real credentials never committed (in .gitignore)

## Next Steps

- Proceed to Phase 5: Setup Project Structure & Config
