# API & DB Patterns Research

**Date:** 2026-02-23
**Scope:** `src/db/index.ts`, `src/db/schema.ts`, `src/lib/redis.ts`, `api/astrology-reading.ts`, `api/share.ts`

---

## 1. API Handler Signature & Export Pattern

All handlers use Web API `Request`/`Response` — NOT Next.js `req`/`res`.

```ts
// api/some-endpoint.ts
export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  // ...
}
```

- **Default export** named `handler`
- Async, receives Web API `Request`, returns `Response`
- OPTIONS preflight always handled first (204 + CORS headers)
- Method guards return early with `Response.json(...)` + status

---

## 2. CORS Headers Pattern

```ts
// Simple wildcard (share.ts):
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Dynamic origin (astrology-reading.ts — preferred for production):
function getCorsOrigin(): string {
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (url) return `https://${url}`;
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "*";
}
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": getCorsOrigin(),
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

Always passed as third arg to `Response.json(...)` or second arg to `new Response(...)`.

---

## 3. Response Format

```ts
// JSON response (preferred):
return Response.json({ key: value }, { status: 200, headers: CORS_HEADERS });

// No-body response (OPTIONS):
return new Response(null, { status: 204, headers: CORS_HEADERS });
```

Common status codes used: 200 (implicit), 204, 400, 404, 405, 413, 429, 500, 502, 503, 504.

---

## 4. Environment Variables

**Always `process.env.*`** — never `import.meta.env.*`.

```ts
process.env.DATABASE_URL              // Neon PostgreSQL
process.env.UPSTASH_REDIS_REST_URL    // Upstash Redis URL
process.env.UPSTASH_REDIS_REST_TOKEN  // Upstash Redis token
process.env.VERCEL_PROJECT_PRODUCTION_URL
process.env.VERCEL_URL
process.env.Z_AI_KEY                  // ZhipuAI key
```

Pattern: read env var → throw/return error if missing → use value.

---

## 5. `createDb()` Factory — `src/db/index.ts`

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL environment variable is not set");
  const sql = neon(databaseUrl);
  return drizzle(sql);
}
```

- No module-level side effects — DB connection created on demand per handler invocation
- Call inside handler: `const db = createDb();`

---

## 6. `createRedis()` Factory — `src/lib/redis.ts`

```ts
import { Redis } from "@upstash/redis";

export function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
  return new Redis({ url, token });
}
```

- Same factory pattern: no module-level instantiation
- Import path from `api/` uses `.js` extension: `"../src/lib/redis.js"`

---

## 7. Rate Limiting — Upstash `Ratelimit`

```ts
import { Ratelimit } from "@upstash/ratelimit";

const redis = createRedis();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 d"),  // 5 req/IP/day
  prefix: "astro_rl",                           // Redis key namespace
});

const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
const { success } = await ratelimit.limit(ip);
if (!success) {
  return Response.json({ error: "rate_limited", message: "..." }, { status: 429, headers: CORS_HEADERS });
}
```

- `Ratelimit` instantiated per-request (inside handler)
- Identifier: first IP from `x-forwarded-for`, fallback `"anonymous"`
- `limiter` options: `slidingWindow(count, window)` — window strings like `"1 d"`, `"1 h"`, `"1 m"`
- Destructure `{ success }` from `.limit(identifier)`

---

## 8. Redis Cache Pattern

```ts
// Write with TTL:
await redis.set(`namespace:key`, value, { ex: 86400 * 300 }); // seconds

// Read with type param:
const cached = await redis.get<string>(cacheKey);
if (cached) return Response.json({ data: cached, cached: true }, { headers: CORS_HEADERS });

// Short-lived (share.ts — 600s = 10 min):
await redis.set(`share:${id}`, body.data, { ex: 600 });
const data = await redis.get<string>(`share:${id}`);
```

Key naming convention: `namespace:subkey:...` (e.g. `astro:reading:date:hour:gender:year:lang`).

---

## 9. Current Schema State — `src/db/schema.ts`

**Entirely commented out.** No active tables exist yet.

```ts
// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   email: text("email").notNull().unique(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });
```

The example shows the full pattern for defining tables.

---

## 10. Defining New Drizzle Tables

Follow the commented-out example exactly:

```ts
import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- Column name arg (string) = actual DB column name (snake_case)
- Property key = TypeScript field name (camelCase)
- Use `drizzle-orm/pg-core` imports: `pgTable`, `serial`, `text`, `timestamp`, `integer`, `boolean`, `jsonb`, `uuid`, `index`
- After adding tables, run `npx drizzle-kit push` or generate migrations

---

## 11. Using `createDb()` in an API Handler

```ts
import { createDb } from "../src/db/index.js";
import { pageViews } from "../src/db/schema.js";

export default async function handler(request: Request): Promise<Response> {
  const db = createDb();
  await db.insert(pageViews).values({ sessionId: "...", page: "/" });
  const rows = await db.select().from(pageViews);
  return Response.json({ rows }, { headers: CORS_HEADERS });
}
```

Note `.js` extensions on all local imports from `api/` directory (required for Node16 module resolution).

---

## Unresolved Questions

- No migration tooling config visible — confirm `drizzle.config.ts` exists and points to correct schema path before running `drizzle-kit push`.
- `tsconfig.node.json` reportedly includes `api/**/*.ts` — verify before adding new API files.
- No existing tables → first migration will create schema from scratch; confirm `DATABASE_URL` is provisioned in Vercel env.
