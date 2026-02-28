# Brainstorm: User Data Tracking & Admin Panel

## Problem Statement

Wedding planner app stores all data in browser localStorage (key `wp_v13`). No server-side persistence, no user identity, no analytics, no admin visibility. Need to:
1. Track & persist user data server-side without requiring auth
2. Log feature usage and user demographics
3. Build admin panel for data management and analytics

## Constraints

- Deploy on Vercel (serverless only) — rules out AdminJS, Directus, or any long-running server
- Neon PostgreSQL (free tier: 512MB storage, 0.25 CU compute)
- Solo dev admin access
- Must preserve existing localStorage-first UX (no forced sign-up)

## Evaluated Approaches

### Data Sync Strategy

| Approach | Verdict |
|---|---|
| Blind 60s interval sync | Rejected — wastes Vercel invocations (360K/mo for 100 users vs 100K free tier) |
| Smart sync (debounced on change + visibility API + heartbeat) | **Selected** — 90%+ fewer API calls |
| Manual save button | Rejected — risks data loss |

### DB Storage Model

| Approach | Verdict |
|---|---|
| Fully normalized tables (users, guests, budgets, vendors) | Rejected — too much work, requires schema migration on every WeddingState change |
| Pure JSON blob | Rejected — can't efficiently query across users for admin |
| **Hybrid: JSON blob + extracted columns** | **Selected** — simple sync, fast admin queries on key fields |

### Admin Panel

| Approach | Verdict |
|---|---|
| AdminJS | Rejected — requires persistent Node.js server, incompatible with Vercel |
| react-admin | Considered — rich features but adds 300KB+ bundle, different UI paradigm |
| SaaS (Retool/Forest Admin) | Considered — zero deploy but external dependency + cost |
| **Custom with shadcn/ui** | **Selected** — consistent stack, full control, lazy-loaded to avoid bundle bloat |

### Admin Auth

| Approach | Verdict |
|---|---|
| Better Auth | Rejected — overkill for solo dev |
| HTTP Basic Auth | Rejected — ugly UX |
| **Env var password + httpOnly cookie** | **Selected** — simple, secure enough for solo |

### Event Tracking

| Approach | Verdict |
|---|---|
| PostHog / Plausible / GA | Considered — rich dashboards but external dependency |
| **Custom event tracking to own DB** | **Selected** — no external deps, data in Neon, can add PostHog later |

---

## Final Recommended Solution

### Architecture Overview

```
[Browser]                           [Vercel Serverless]         [Neon PostgreSQL]
  |                                       |                          |
  |-- localStorage (primary) ------------|                          |
  |                                       |                          |
  |-- useSync hook ----POST /api/sync --> |-- upsert user_sessions ->|
  |   (debounced 5s on change,           |   + extract profile cols  |
  |    visibilitychange,                  |                          |
  |    5min heartbeat)                    |                          |
  |                                       |                          |
  |-- useTracking hook -POST /api/track ->|-- batch insert events -->|
  |   (buffer 30s + flush on unload)      |                          |
  |                                       |                          |
  |-- /admin (lazy-loaded) ------------> |-- admin API endpoints -->|
       password gate (env var cookie)     |   (users, analytics,    |
                                          |    system health)       |
```

### Database Schema (Drizzle ORM)

#### `user_sessions` table
- `id`: uuid PK — generated client-side on first visit
- `wedding_data`: jsonb — full WeddingState blob
- `groom_name`: text — extracted from JSON for search
- `bride_name`: text — extracted from JSON for search
- `groom_birth_date`: text — extracted for demographics
- `bride_birth_date`: text — extracted for demographics
- `wedding_date`: text — extracted for analytics/filtering
- `region`: text — north/central/south
- `lang`: text — vi/en
- `guest_count`: integer — extracted for quick stats
- `checklist_progress`: real — completion percentage (0-100)
- `created_at`: timestamp — first visit
- `updated_at`: timestamp — last sync

#### `analytics_events` table
- `id`: serial PK
- `user_id`: uuid FK → user_sessions
- `event_type`: text — enum-like: page_view, feature_use, checklist_complete, onboarding_step, etc.
- `event_data`: jsonb — contextual metadata (page name, feature name, duration, etc.)
- `created_at`: timestamp

#### `admin_sessions` table
- `id`: text PK — crypto.randomUUID() session token
- `created_at`: timestamp
- `expires_at`: timestamp — 24h TTL

### API Endpoints (new)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/sync` | POST | Upsert user session, extract profile columns from wedding data JSON |
| `/api/track` | POST | Batch insert analytics events (array of events) |
| `/api/admin/login` | POST | Verify password against `ADMIN_PASSWORD` env var, return session cookie |
| `/api/admin/logout` | POST | Delete admin session |
| `/api/admin/users` | GET | Paginated user list with search (name, region, date filters) |
| `/api/admin/users/[id]` | GET | Full user detail including raw wedding_data JSON |
| `/api/admin/analytics` | GET | Aggregated metrics (user counts, feature usage, demographics) |
| `/api/admin/system` | GET | DB connection status, Redis status, table row counts |

### Frontend Changes

#### New Hooks
- **`useSync()`** — watches wedding state changes via hash comparison, syncs on: state change (5s debounce), `visibilitychange` event (tab hide/close), 5min heartbeat. Uses `navigator.sendBeacon()` on page unload as fallback.
- **`useTracking()`** — exposes `track(eventType, eventData)`. Buffers events in memory, flushes to `/api/track` every 30s or on page unload.
- **`useUserId()`** — generates/retrieves anonymous UUID from localStorage.

#### Admin Pages (lazy-loaded, route: `/admin`)
1. **Login** — password input, sets httpOnly cookie
2. **Dashboard** — total users, DAU/WAU/MAU, popular features chart, wedding date distribution, region breakdown
3. **Users** — searchable/filterable table (name, region, wedding date, last active, guest count, checklist %). Click row → view full wedding data JSON.
4. **Analytics** — feature usage bar chart, page view trends, onboarding funnel, top ceremony phases
5. **System** — DB/Redis health indicators, table row counts, recent error logs

### Event Types to Track

| Event | Data |
|---|---|
| `page_view` | `{ page: 'planning' \| 'astrology' \| ... }` |
| `feature_use` | `{ feature: 'budget' \| 'guest_import' \| 'seating_chart' \| ... }` |
| `onboarding_step` | `{ step: 1 \| 2 \| 3, completed: boolean }` |
| `checklist_toggle` | `{ phase: number, item: string, checked: boolean }` |
| `share_created` | `{ shareId: string }` |
| `ai_chat` | `{ promptType: string }` |
| `astrology_reading` | `{ type: 'personal' \| 'compatibility' \| ... }` |
| `session_start` | `{ referrer: string, lang: string }` |
| `session_end` | `{ duration: number }` |

---

## Implementation Considerations

### Performance
- Lazy-load admin pages (React.lazy + Suspense) to avoid bloating main app bundle
- Batch event tracking (30s buffer) to minimize API calls
- Smart sync reduces invocations from ~360K/mo to ~30K/mo for 100 daily users
- Use `navigator.sendBeacon()` for reliable page unload sync

### Storage
- Wedding state ~50-100KB per user as JSONB
- 10K users ≈ 1GB — exceeds Neon free tier (512MB)
- Monitor and plan for paid tier if growth warrants
- Consider compressing wedding_data (gzip before store) if needed

### Security
- Admin password in `ADMIN_PASSWORD` env var (Vercel env settings)
- Admin session as httpOnly, secure, sameSite=strict cookie
- `/api/admin/*` endpoints validate session cookie
- Rate limit `/api/sync` and `/api/track` to prevent abuse (Upstash)
- Sanitize wedding_data JSON before storing (prevent XSS in admin views)

### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Neon storage limit (512MB free) | Monitor row count + data size in admin system page. Upgrade when needed. |
| Multi-tab sync conflicts | Last-write-wins — acceptable for this use case (single user per ID) |
| Event table growing unbounded | Add TTL or archive events older than 90 days. Batch delete via admin. |
| Admin password leaked | Rotate via Vercel env vars. Consider adding IP allowlist later. |
| User opens app on new device | Data doesn't transfer (no auth). Could add "recovery link" feature later. |

---

## Success Metrics

- [ ] User sessions synced to DB within 10s of data change
- [ ] Admin dashboard loads in <2s with 1000+ users
- [ ] Event tracking captures 90%+ of user interactions
- [ ] Admin can search users by name, filter by region/date
- [ ] Zero impact on main app performance (sync/tracking are background ops)
- [ ] Admin bundle lazy-loaded, not affecting main app load time

## Next Steps

1. Create detailed implementation plan with phased approach
2. Phase 1: DB schema + sync endpoint + useSync hook
3. Phase 2: Event tracking + useTracking hook
4. Phase 3: Admin auth + admin pages
5. Phase 4: Analytics dashboard + charts
