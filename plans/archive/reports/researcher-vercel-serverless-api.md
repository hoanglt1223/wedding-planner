# Vercel Serverless Functions Setup for Vite React (February 2026)

**Status:** Research Complete | **Scope:** Comprehensive API Architecture Guide

---

## 1. Vercel Serverless Functions & /api Directory Routing

**File-based Routing:**
- Place JS/TS files in `/api` or `/_api` directory (prefer `/_api` to avoid double-compilation)
- Files automatically become serverless functions; directory structure maps to routes
- `/api/hello.ts` → `GET /api/hello`
- `/api/users/[id].ts` → `GET /api/users/[id]`

**Handler Pattern (non-Next.js):**
```typescript
export default {
  async fetch(request: Request) {
    return Response.json({ data: 'hello' });
  }
};
```

**TypeScript Setup:**
- Add `"type": "module"` to package.json
- Create `tsconfig.json` in `/api` directory for type checking

---

## 2. vercel.json Configuration

**Key Properties for Vite + Serverless:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "vite dev",
  "outputDirectory": "dist",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60,
      "runtime": "nodejs20.x"
    }
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Important:** SPA rewrites don't work with Vite dev server. Use separate `vercel-dev.json` with `{}` for local dev.

---

## 3. Neon Serverless PostgreSQL (@neondatabase/serverless)

**Installation:**
```bash
npm install @neondatabase/serverless
```

**HTTP Driver (for one-shot queries):**
```typescript
import { neon } from '@neondatabase/serverless';

export default {
  async fetch(request: Request) {
    const sql = neon(process.env.DATABASE_URL);
    const users = await sql`SELECT * FROM users WHERE id = ${id}`;
    return Response.json(users);
  }
};
```

**WebSocket Driver (for interactive transactions):**
```typescript
import { Pool } from '@neondatabase/serverless';

export default async function handler(req: Request) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query('SELECT * FROM users');
  await pool.end(); // Critical: close within handler
  return new Response(JSON.stringify(result.rows));
}
```

**Choice Guide:**
- HTTP: Faster, no session/transaction support, max 64MB payload
- WebSocket: Slower, full transaction support, requires `ws` package

---

## 4. Upstash Redis (@upstash/redis)

**Installation:**
```bash
npm install @upstash/redis
```

**Basic Usage:**
```typescript
import { Redis } from '@upstash/redis';

export default {
  async fetch(request: Request) {
    const redis = Redis.fromEnv();
    await redis.set('key', 'value');
    const val = await redis.get('key');
    return Response.json({ cached: val });
  }
};
```

**Common Use Cases:** Rate limiting, session caching, real-time notifications, request deduplication.

**Key Features:** HTTP-based (no TCP), replicated across 8+ regions, per-request pricing.

---

## 5. Drizzle ORM with Neon Serverless

**Installation:**
```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

**HTTP Setup (Recommended for Vercel):**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
```

**WebSocket Setup (Node.js only):**
```typescript
import { drizzle } from 'drizzle-orm/neon-websockets';
import { Pool } from '@neondatabase/serverless';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

**drizzle.config.ts:**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## 6. Environment Variables Setup

**Local Development (.env.local):**
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

**Vercel Dashboard Configuration:**
- Settings → Environment Variables
- Create separate vars for Production, Preview, Development
- Use `vercel env pull` to sync vars locally (or `vercel dev` auto-syncs)

**Important:** Vercel automatically injects system variables (e.g., `VERCEL_URL`, `VERCEL_ENV`, `NODE_ENV`).

---

## 7. Local Development

**Option A: vercel dev**
```bash
npm install -g vercel
vercel dev
```
- Emulates production environment locally
- Auto-loads environment variables from Vercel dashboard
- Compatible with serverless functions
- Issue: SPA rewrites don't work; use `vercel-dev.json` workaround

**Option B: Custom Setup (Vite + Custom API Server)**
- Run Vite dev: `npm run dev`
- Run API server separately: `node --loader tsx api/server.ts`
- Proxy API requests in Vite config:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

---

## 8. Best Practices for Serverless API Structure

**Shared Database Helper:**
```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**Middleware Pattern:**
```typescript
// lib/middleware.ts
export const withAuth = (handler) => async (request: Request) => {
  const token = request.headers.get('authorization');
  if (!token) return new Response('Unauthorized', { status: 401 });
  return handler(request);
};

export const withCors = (handler) => async (request: Request) => {
  const response = await handler(request);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
};
```

**Usage:**
```typescript
import { withAuth, withCors } from '../lib/middleware';
import { db } from '../lib/db';

const handler = async (request: Request) => {
  const users = await db.select().from(usersTable);
  return Response.json(users);
};

export default withCors(withAuth(handler));
```

**Project Structure:**
```
project/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Frontend pages
│   └── db/
│       └── schema.ts     # Drizzle schema
├── api/
│   ├── users/
│   │   ├── [id].ts       # GET /api/users/[id]
│   │   └── index.ts      # POST /api/users
│   ├── health.ts         # GET /api/health
│   └── middleware/
│       └── auth.ts       # Shared middleware
├── lib/
│   ├── db.ts             # Shared db instance
│   └── redis.ts          # Shared redis client
├── vercel.json
├── drizzle.config.ts
└── package.json
```

**Connection Management:**
- Create db/redis clients once per function execution
- Close connections within handler scope (Neon WebSocket)
- Neon HTTP auto-closes; no cleanup needed

---

## Key Takeaways

1. **Use `/_api` directory** to avoid double compilation conflicts
2. **Prefer Neon HTTP + Drizzle** for Vercel (simpler, faster)
3. **Use WebSocket only** if interactive transactions required
4. **Implement shared db/redis helpers** in `/lib` for DRY code
5. **Use middleware composition** for auth, CORS, error handling
6. **Separate vercel.json & vercel-dev.json** for dev/prod
7. **Never commit .env.local** or sensitive vars to git
8. **Cold starts:** Minimize bundle size; lazy-load dependencies

---

## Sources

- [Vercel Functions Quickstart](https://vercel.com/docs/functions/serverless-functions/quickstart)
- [Vercel Project Configuration](https://vercel.com/docs/project-configuration)
- [Neon Serverless Driver](https://neon.com/docs/serverless/serverless-driver)
- [Drizzle ORM - Neon](https://orm.drizzle.team/docs/connect-neon)
- [Upstash Redis Integration](https://upstash.com/docs/redis/howto/vercelintegration)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [vite-plugin-vercel](https://www.npmjs.com/package/vite-plugin-vercel)
- [Vercel dev Documentation](https://vercel.com/blog/vercel-dev)
