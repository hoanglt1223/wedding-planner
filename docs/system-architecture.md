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
- `components/layout/` - Root layout, headers, footers, region selector, theme picker
- `components/wedding/` - Wedding ceremony steps, checklists, family roles, collapsible details
- `components/calendar/` - Auspicious date picker with lunar calendar and compatibility
- `pages/` - Route-based page components
- `hooks/` - Custom React hooks (state management)
- `lib/` - Utility functions and helpers
- `types/` - TypeScript interfaces
- `data/` - Static data (wedding steps, budget categories, astrology, family roles, traditional items, regions)

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
- `ai/chat.ts` - AI-powered wedding consultation chat endpoint (ZhipuAI glm-5)
- `sync.ts` - User state sync endpoint (debounced, rate-limited, 50KB guard)
- `track.ts` - Event tracking endpoint (batched, rate-limited, max 50 events/batch)
- `share.ts` - Ephemeral share links for zodiac cards (Redis, 10-min TTL)
- `rsvp.ts` - Bulk create RSVP invitations + fetch by token
- `rsvp/respond.ts` - One-time atomic RSVP response submission
- `rsvp/list.ts` - Fetch all RSVP responses for dashboard (rate-limited)
- `photos.ts` - Guest photo upload to Vercel Blob + list/approve operations
- `tasks.ts` - Task CRUD + status updates + assignee progress tracking
- `website.ts` - Wedding website data retrieval (timeline, gallery, venue, couple info)
- `admin/auth.ts` - Admin authentication (login, logout, verify session)
- `admin/data.ts` - Admin data endpoints (dashboard, users, analytics, system)

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

**Tables:**
- `user_sessions` - UUID PK, wedding_data jsonb, extracted columns (names, dates, region, lang, counts, progress, budget, onboarding status), timestamps
- `analytics_events` - Auto-increment PK, user_id FK, event_type text, event_data jsonb, created_at
- `admin_sessions` - Text PK, created_at, expires_at (24h)
- `rsvp_invitations` - UUID PK, user_id FK, guest_name, token (unique), status (pending/accepted/declined), plus_ones int, dietary text, message text, responded_at, created_at. Index: user_id
- `wedding_photos` - UUID PK, user_id FK, guest_name, photo_url (Vercel Blob), status (pending/approved/rejected), uploaded_at, approved_at, created_at. Index: user_id
- `wedding_tasks` - UUID PK, user_id FK, title, description, assignee, assignee_token (unique), status (assigned/in-progress/completed), due_date, priority (low/medium/high), created_at, updated_at. Indexes: user_id, assignee_token

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
- Ephemeral share links (10-min TTL)
- Rate limiting for APIs (30 req/min for /api/sync, 10 req/min for /api/track, 30 req/min for /api/rsvp/list)
- RSVP token validation cache, session management

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

## Internationalization (i18n)

**Translation System:**
```
User selects language in Settings
  → Stored in WeddingState.lang
  → Passed to components as lang prop
  → Components call resolve-data functions
  → Language-specific data arrays loaded
  → t(key, lang) for UI strings
```

**Data Resolution Pattern:**
```
resolve-data.ts exposes 7 getters:
  getWeddingSteps(lang)
  getBudgetCategories(lang)
  getAiPrompts(lang)
  getIdeas(lang)
  getZodiacProfiles(lang)
  getElementProfiles(lang)
  getYearlyForecasts(lang)

Each returns Vietnamese OR English data array based on lang parameter
```

**Translation Coverage:**
- 200+ UI strings in `i18n-translations.ts` (vi/en key-value pairs)
- 7 data files with English translations (.en.ts parallel versions)
- API endpoints accept `lang` parameter for responses
- Format utilities (`formatMoney`, `formatShort`) accept `lang` parameter

**Language Support:**
- Vietnamese (vi) — default, original language
- English (en) — full translation coverage for all content

## Regional Content System

**Purpose:** Support regional variations across North, Central, and South Vietnam

**Architecture:**
```typescript
type Region = "north" | "central" | "south"
type RegionalContent<T> = Record<Region, T>
```

**Components:**
- `src/data/regions.ts` — Region definitions and helper type
- `src/components/layout/region-selector.tsx` — UI for selecting region
- `src/hooks/use-wedding-store.ts` — Region state management (`setRegion()`)

**Data Integration:**
- 33 traditional items per phase with regional quantity variants
- Family roles include region-specific duties
- Ceremony steps include regional notes via `Ceremony.regionalNotes` field
- Etiquette rules include regional variations

**State Storage:**
- `WeddingState.region` persisted in localStorage (wp_v13)
- Default region: "north"

## Auspicious Date Picker System

**Purpose:** Lunar calendar with traditional Vietnamese dating guidelines for wedding planning

**Architecture:**
```
Frontend (Auspicious Calendar Component)
  → Lunar Service (@dqcai/vn-lunar)
    → Full lunar dates for selected month/year
  → Hoàng Đạo/Hắc Đạo (Lucky/Unlucky Days)
  → Tam Nương (3rd/7th/13th lunar days)
  → Nguyệt Kỵ (Zodiac month conflicts)
  → Ngũ Hành (5 Elements) couple compatibility
  → Day cell color coding + detailed info modal
```

**Components:**
- `src/components/calendar/auspicious-calendar.tsx` — Main calendar grid
- `src/components/calendar/day-cell.tsx` — Individual day with indicators
- `src/components/calendar/date-detail-modal.tsx` — Extended date info
- `src/components/calendar/couple-compatibility.tsx` — 5 Elements match scoring

**Data Files:**
- `src/data/auspicious/types.ts` — Type definitions
- `src/data/auspicious/lunar-service.ts` — Lunar date utilities
- `src/data/auspicious/hoang-dao.ts` — Lucky/unlucky days mapping
- `src/data/auspicious/avoidance-days.ts` — Nguyệt Kỵ zodiac conflicts
- `src/data/auspicious/ngu-hanh.ts` — 5 Elements compatibility matrix

**Features:**
- 60-day lunar calendar view with date/holiday/zodiac indicators
- Color-coded cell backgrounds (green=lucky, yellow=neutral, red=unlucky)
- Couple birth data integration (from `WeddingState.info`)
- 5 Elements matching algorithm (1-10 score)
- Detailed info modal with explanation of flags

## User Data Tracking System

**Purpose:** Monitor user engagement and app usage without external analytics dependencies

**Architecture:**
```
Frontend (useSync + useTracking hooks)
  → POST /api/sync (debounced 5s, visibility, heartbeat 5min)
     → user_sessions table (upsert with extracted columns)
  → POST /api/track (batched every 30s or at buffer limit)
     → analytics_events table (append events with timestamps)
```

**Client-Side Hooks:**
- `useUserId()` - Generate/persist anonymous UUID in localStorage (wp_user_id)
- `useSync()` - Smart sync with debounce, visibility-based, heartbeat, sendBeacon on unload
- `useTracking()` - Batch events in memory, auto-flush on interval or buffer threshold

**Events Tracked:**
- Page views, onboarding completion, checklist toggles
- Guest list changes, budget updates, theme/language/region changes
- AI reading requests, share creation

**Features:**
- Debounced sync (5s) reduces writes 80%+
- Visibility API triggers immediate sync on tab hide
- 5-minute heartbeat keeps sessions alive
- sendBeacon on unload for reliable final sync
- Rate limiting: 30 req/min for sync, 10 req/min for track
- Payload guards: 50KB max for sync, 50 events per batch

## Admin Panel System

**Purpose:** Monitor users, track analytics, and verify system health

**Architecture:**
```
Admin Shell (#/admin with lazy loading)
  → Admin Auth (password via ADMIN_PASSWORD env var)
  → Session validation (httpOnly cookie, 24h expiry)
  → Sidebar navigation to:
     → Dashboard (stat cards: users, active counts, top regions/languages)
     → Users (paginated table 50/page, search/sort, detail modal)
     → Analytics (event aggregation, daily active users, date range filter)
     → System (DB/Redis status, env checks, session count, last sync)
```

**API Endpoints:**
- `POST /api/admin/auth/login` - Verify password, create session, set httpOnly cookie
- `POST /api/admin/auth/logout` - Delete session, clear cookie
- `GET /api/admin/auth/verify` - Check session validity
- `GET /api/admin/data/dashboard` - Aggregated stats (users, activity, regions, languages)
- `GET /api/admin/data/users` - Paginated users with search/sort
- `GET /api/admin/data/users/[id]` - User detail with full wedding_data JSON
- `GET /api/admin/data/analytics` - Event aggregation with date range
- `GET /api/admin/data/system` - System health (DB, Redis, env, sessions, last sync)

**Components:**
- `pages/admin/admin-shell.tsx` - Layout with sidebar
- `pages/admin/admin-dashboard.tsx` - Stat cards, simple CSS bar charts
- `pages/admin/admin-users.tsx` - Paginated table, detail modal
- `pages/admin/admin-analytics.tsx` - Event charts, daily active users
- `pages/admin/admin-system.tsx` - Health indicators

**Authentication:**
- Password-based (single admin password from env var)
- httpOnly cookie with Secure + SameSite=Lax flags
- 24-hour session expiry
- Session stored in admin_sessions table

## RSVP System

**Purpose:** Guest-facing RSVP collection with admin dashboard management.

**Guest Flow:**
1. Admin generates RSVP invitations via dashboard (bulk create)
2. Guests access `#/rsvp/:token` with unique token
3. Guest submits one-time response (status + dietary + plus-ones)
4. Admin views responses, exports data, manages settings

**Components:**
- Guest page: hero, event details, couple story, RSVP form, thank-you confirmation
- Admin dashboard: stats bar, settings form, link generator, QR code modal, response table, CSV export

**API Endpoints:**
```
POST/GET /api/rsvp           — Bulk create & fetch by token
POST /api/rsvp/respond       — One-time atomic response (guards against duplicate submissions)
GET /api/rsvp/list           — All responses (rate-limited 30 req/min)
```

**Security:**
- Rate limiting on /api/rsvp/list via @upstash/ratelimit
- XSS protection on venueMapLink rendering
- Atomic one-time response guard (transaction per submission)
- CSV formula injection prevention (@index prefix escaping)

**State:**
- `WeddingState.rsvpSettings: RsvpSettings` (eventTitle, eventDate, venueMapLink, coupleStory)
- `Guest.rsvpToken?: string` (persisted in wedding_data)
- localStorage version: wp_v14

**Dependencies:** nanoid (token gen), qrcode (QR rendering)

## Blob Storage (Vercel Blob)

**Purpose:** Scalable image storage for guest photos

**Configuration:**
- Host: Vercel Blob serverless storage
- Auth: Token-based (`BLOB_READ_WRITE_TOKEN` env var)
- Use case: Store guest photos with metadata (user_id, guest_name, approval status)

**API Integration:**
- `POST /api/photos` — Upload photo to Blob, store metadata in wedding_photos table
- `GET /api/photos` — Retrieve guest photos with approval status
- `PUT /api/photos/:id` — Approve/reject photo by planner

## Phase 2: Extended Features

### Hash Routes
- `#/w/:slug` - Wedding website (public-facing)
- `#/photos/:token` - Guest photo upload link (token-based, no auth required)
- `#/tasks/:token` - Family task board link (token-based, no auth required)

### Pages
- `wedding-website-page.tsx` — Public wedding website with timeline, gallery, RSVP CTA
- `photo-upload-page.tsx` — Guest photo upload with progress tracking
- `task-landing-page.tsx` — Family task board with assignee-specific views
- `timeline-page.tsx` — Wedding timeline CRUD and management
- `gift-page.tsx` — Phong bì tracker with CSV export

### State Extensions (v15)
- `countdown: boolean` — Enable/disable countdown display
- `remindersSent: Record<string, boolean>` — Track milestone reminders (90d, 60d, 30d, 14d, 7d, 1d)
- `timeline: TimelineEntry[]` — Wedding day timeline entries
- `gifts: GiftEntry[]` — Gift/cash received tracking
- `website: WebsiteSettings` — Public website config (slug, published, sections visibility)

### New i18n Keys (70+)
- Countdown labels and milestone names
- Timeline CRUD operations and categories
- Gift tracker fields and export labels
- Photo upload prompts and moderation statuses
- Task board labels and priority levels
- Website sections and public page copy

## Monitoring

- `/api/health` endpoint for deployment checks
- `/api/sync` rate limit and payload metrics
- `/api/track` rate limit and event counts
- `/api/rsvp/list` rate limit metrics
- `/api/photos` Vercel Blob upload metrics
- `/api/tasks` task creation and update metrics
- `/api/website` page views and engagement
- `/api/admin/auth/verify` session validation
- Vercel Analytics dashboard
- ZhipuAI API usage dashboard (cost tracking)
- Vercel Blob usage dashboard (storage and bandwidth)
- Redis command monitoring (Upstash dashboard)
- Database query logs (Neon console)
- Admin panel system page for real-time health checks
