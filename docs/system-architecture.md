# System Architecture

## High-Level Overview

Wedding Planner is a three-tier serverless architecture optimized for scalability and developer productivity.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  Vite + React SPA (TypeScript + Tailwind + shadcn/ui)   │
│           Deployed to Vercel Edge Network                │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
    ┌─────────────┐         ┌──────────────────┐
    │  API Layer  │         │  Cache Layer     │
    │ (Vercel     │         │  (Upstash        │
    │  Functions) │         │   Redis)         │
    └─────────────┘         └──────────────────┘
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   Database Layer        │
         │ (Neon PostgreSQL +      │
         │  Drizzle ORM)           │
         └─────────────────────────┘
```

## Component Details

### Frontend (src/)

**Purpose:** React Single Page Application with type-safe UI

**Stack:**
- Vite: Lightning-fast dev server & build tool
- React 19: Modern hooks-based rendering
- TypeScript: Full type safety
- Tailwind CSS v4: CSS-first utility framework
- shadcn/ui: Production-ready Radix UI components

**Key Directories:**
- `components/ui/` - shadcn/ui system components
- `components/layout/` - Root layout, headers, footers
- `pages/` - Route-based page components
- `hooks/` - Custom React hooks (state management)
- `lib/` - Utility functions and helpers
- `types/` - TypeScript interfaces

**Build Pipeline:**
```
TypeScript → Vite Bundle → Vercel Edge → Browser
```

### API Layer (/api)

**Purpose:** Serverless backend logic

**Stack:**
- Vercel Functions: Edge-optimized serverless
- Node.js 20+ runtime
- Factory-based service initialization

**Key Files:**
- `health.ts` - Health check endpoint (DB + Redis status)
- `astrology-reading.ts` - AI-powered astrology reading endpoint (OpenAI gpt-4o-mini)
- Future: User routes, guest endpoints, budget APIs, vendor endpoints

**Error Handling:**
- Database connection validation
- Redis connectivity monitoring
- Structured error responses

**Example Route:**
```typescript
// api/health.ts
export default { async fetch(req) { ... } }
```

### Database (Neon PostgreSQL + Drizzle)

**Purpose:** Persistent data storage with type-safe queries

**Configuration:**
- Host: Neon serverless PostgreSQL
- Driver: @neondatabase/serverless (HTTP connection pool)
- ORM: Drizzle 0.45.1 (lightweight, SQL-first)
- Migrations: Drizzle Kit

**Schema Location:** `src/db/schema.ts`

**Factory:**
```typescript
// src/db/index.ts
export function createDb() { ... }
```

**Commands:**
```bash
npm run db:generate  # Create migration files
npm run db:migrate   # Apply migrations
npm run db:studio    # UI for schema inspection
```

### Cache Layer (Upstash Redis)

**Purpose:** Fast data access, session storage, rate limiting

**Configuration:**
- Type: Upstash serverless Redis
- Driver: @upstash/redis (REST API)
- Auth: Token-based (env vars)

**Factory:**
```typescript
// src/lib/redis.ts
export function createRedis() { ... }
```

**Use Cases:**
- AI reading cache (300-day TTL per unique birth data + year)
- Rate limiting for APIs (5 req/IP/day for /api/astrology-reading)
- Future: Session tokens, guest RSVP cache, vendor availability

## Data Flow

1. User interacts with React UI (frontend)
2. UI calls Vercel API function via HTTP
3. API function queries database via Drizzle
4. API checks/updates Redis cache as needed
5. Response returned to UI, state updated
6. UI re-renders with new data

## Security Architecture

- Environment variables isolated per deployment
- Database credentials in Vercel secrets
- Redis token in env vars (no exposure in client)
- TypeScript strict mode prevents runtime errors
- API routes validate input before database queries

## Deployment Pipeline

**Local Development:**
```bash
npm run dev    # Vite hot reload + local APIs
```

**Production (Vercel):**
```bash
git push → Vercel auto-deploys
├─ Build: npm run build
├─ Test: npm run lint (optional)
└─ Deploy: Frontend + API functions to edge
```

## Scalability

- **Frontend:** CDN cache + edge compute (Vercel)
- **API:** Serverless auto-scaling (no servers to manage)
- **Database:** Neon auto-scaling connections
- **Cache:** Redis horizontal scaling (Upstash)

## AI Integration (OpenAI)

**Endpoint:** POST `/api/astrology-reading`

**Model:** gpt-4o-mini (cost-optimized, 16x cheaper than gpt-4o)

**Configuration:**
- Auth: API key via `OPENAI_API_KEY` env var
- Rate limit: 5 requests per IP per day (via @upstash/ratelimit)
- Cache: Redis with 300-day TTL per unique birth data + year combination
- Input: Zodiac sign, birth date, gender, year
- Output: AI-generated astrological reading in Vietnamese

**Architecture:**
```
Frontend (AI Reading Button)
  → POST /api/astrology-reading
    → Check Redis cache (300-day TTL)
    → If miss: Call OpenAI gpt-4o-mini
    → Cache result to Redis
    → Return to frontend
    → Display with cached indicator
```

**Rate Limiting:**
- @upstash/ratelimit sliding window algorithm
- 5 requests per IP per day
- Returns 429 Too Many Requests when limit exceeded

**Cost Optimization:**
- gpt-4o-mini selected over gpt-4o for Vietnamese quality + cost
- Long cache TTL (300 days) reduces API calls
- Rate limiting prevents abuse and controls spending

## Monitoring

- `/api/health` endpoint for deployment checks
- `/api/astrology-reading` rate limit and cache metrics
- Vercel Analytics dashboard
- OpenAI API usage dashboard (cost tracking)
- Redis command monitoring (Upstash dashboard)
- Database query logs (Neon console)
