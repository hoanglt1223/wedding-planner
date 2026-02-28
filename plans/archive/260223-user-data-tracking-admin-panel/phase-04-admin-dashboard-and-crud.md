# Phase 4: Admin Dashboard & CRUD

## Context Links
- [Parent Plan](./plan.md)
- [Phase 1 -- DB Schema](./phase-01-db-schema-and-sync.md) (user_sessions, analytics_events tables)
- [Phase 3 -- Admin Auth & Layout](./phase-03-admin-auth-and-layout.md) (admin shell, routing, auth guard)
- [shadcn components](../../src/components/ui/) -- Card, Button, Input, Table, Badge, etc.
- [Code Standards](../../docs/code-standards.md) -- file naming, 200 line limit

## Overview
- **Priority:** P1
- **Effort:** 5h
- **Status:** done
- **Depends on:** Phases 1, 2, 3 (all tables, tracking data, admin auth + shell)
- **Description:** Replace placeholder admin pages with real dashboard (stat cards, charts), user management (paginated table, detail view), analytics (feature usage, trends), and system health page.

## Key Insights
- Admin API endpoints all require session verification (cookie check) -- extract shared middleware pattern
- Aggregation queries run on PostgreSQL via Drizzle -- use sql`` tagged template for complex queries
- Charts: use lightweight approach -- CSS-based bar charts or minimal charting library. NO heavy charting deps. Use simple SVG bars or CSS percentage bars.
- User table needs pagination (50 per page), search (by name), sort (by updatedAt)
- All admin API endpoints are read-only (no user data modification) for MVP
- shadcn Table component for user list; Card for stat cards

## Requirements

### Functional
- F1: Dashboard page: total users, active today/week/month, avg progress, top regions/languages
- F2: Users page: paginated table (50/page), search by name, sort by updated_at, click row for detail
- F3: User detail: show extracted fields + full wedding_data JSON (collapsible)
- F4: Analytics page: event counts by type (bar chart), daily active users (line/bar), feature usage breakdown
- F5: System page: DB connection status, Redis status, env vars check, session count, last sync time
- F6: All admin API endpoints require valid admin session cookie

### Non-Functional
- NF1: Dashboard loads < 1s (aggregation queries should be fast on <100k rows)
- NF2: Users table page loads < 500ms
- NF3: No external charting library -- use CSS bars or simple SVG
- NF4: Each admin page component < 200 lines (split sub-components as needed)
- NF5: All API responses include total count for pagination

## Architecture

### Admin API Endpoints

```
GET /api/admin/dashboard -- aggregated stats
GET /api/admin/users?page=1&limit=50&search=&sort=updated_at&order=desc -- paginated users
GET /api/admin/users/[id] -- single user detail
GET /api/admin/analytics?from=&to= -- event aggregations
GET /api/admin/system -- health check data
```

### Auth Middleware Pattern
Each admin API endpoint must verify session. Extract pattern:
```typescript
async function verifyAdminSession(request: Request): Promise<boolean> {
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const sessionId = cookies['admin_session'];
  if (!sessionId) return false;
  const db = createDb();
  const [session] = await db.select().from(adminSessions)
    .where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  return !!session;
}
```
Since Vercel functions are standalone files, each endpoint repeats this (~10 lines). Acceptable duplication for serverless isolation. Alternatively, create `api/admin/_auth.ts` as a shared import (Vercel allows importing non-handler files prefixed with `_`).

DECISION: Create `api/admin/_auth.ts` as shared auth utility. Vercel ignores files starting with `_` as non-endpoints.

### Dashboard Aggregation Queries

```sql
-- Total users
SELECT COUNT(*) FROM user_sessions;

-- Active today
SELECT COUNT(*) FROM user_sessions WHERE updated_at > NOW() - INTERVAL '1 day';

-- Active this week
SELECT COUNT(*) FROM user_sessions WHERE updated_at > NOW() - INTERVAL '7 days';

-- Active this month
SELECT COUNT(*) FROM user_sessions WHERE updated_at > NOW() - INTERVAL '30 days';

-- Avg checklist progress
SELECT AVG(checklist_progress) FROM user_sessions WHERE onboarding_complete = true;

-- Region breakdown
SELECT region, COUNT(*) FROM user_sessions GROUP BY region;

-- Language breakdown
SELECT lang, COUNT(*) FROM user_sessions GROUP BY lang;

-- Avg budget
SELECT AVG(budget) FROM user_sessions WHERE budget > 0;
```

## Related Code Files

### Files to Create
- `api/admin/_auth.ts` -- shared session verification utility (~30 lines)
- `api/admin/dashboard.ts` -- dashboard stats endpoint (~80 lines)
- `api/admin/users.ts` -- paginated user list endpoint (~90 lines)
- `api/admin/user-detail.ts` -- single user detail endpoint (~50 lines)
- `api/admin/analytics.ts` -- event aggregation endpoint (~90 lines)
- `api/admin/system.ts` -- system health endpoint (~60 lines)
- `src/pages/admin/admin-dashboard.tsx` -- dashboard page with stat cards (~150 lines)
- `src/pages/admin/admin-users.tsx` -- user list page (~150 lines)
- `src/pages/admin/admin-user-detail.tsx` -- user detail modal/page (~120 lines)
- `src/pages/admin/admin-analytics.tsx` -- analytics page with charts (~150 lines)
- `src/pages/admin/admin-system.tsx` -- system health page (~100 lines)
- `src/pages/admin/admin-stat-card.tsx` -- reusable stat card component (~30 lines)
- `src/pages/admin/admin-bar-chart.tsx` -- simple CSS bar chart component (~50 lines)

### Files to Modify
- `src/pages/admin/admin-app.tsx` -- replace placeholder pages with real imports (lazy loaded)

### Files to Delete
- None

## Implementation Steps

### Step 1: Create shared admin auth utility (api/admin/_auth.ts)
1. Export `verifyAdminSession(request: Request): Promise<boolean>`
2. Export `parseCookies(header: string): Record<string, string>`
3. Export `ADMIN_CORS_HEADERS` constant (reusable across admin endpoints)
4. Export `getCorsOrigin()` function
5. Export `unauthorizedResponse()` helper that returns 401 Response

### Step 2: Create GET /api/admin/dashboard (api/admin/dashboard.ts)
1. Import from `_auth.ts`, verify session
2. Run aggregation queries (all in parallel with Promise.all):
   - Total users
   - Active today/week/month counts
   - Avg checklist progress
   - Region distribution
   - Language distribution
   - Avg budget
   - Users with onboarding complete count
3. Return JSON with all stats:
   ```typescript
   {
     totalUsers, activeToday, activeWeek, activeMonth,
     avgProgress, avgBudget, onboardedCount,
     regionBreakdown: { north: N, central: N, south: N },
     langBreakdown: { vi: N, en: N }
   }
   ```

### Step 3: Create GET /api/admin/users (api/admin/users.ts)
1. Verify session
2. Parse query params: page (default 1), limit (default 50, max 100), search, sort (default updated_at), order (default desc)
3. Build Drizzle query:
   - If search: WHERE groomName ILIKE %search% OR brideName ILIKE %search%
   - ORDER BY sort column, order direction
   - LIMIT + OFFSET for pagination
4. Run count query in parallel for total
5. Return: `{ users: [...], total, page, limit }`
6. Each user in list: id, groomName, brideName, weddingDate, region, lang, guestCount, checklistProgress, budget, onboardingComplete, updatedAt (NO wedding_data blob in list view)

### Step 4: Create GET /api/admin/user-detail.ts
1. Verify session
2. Get userId from query param: `?id=<uuid>`
3. Query single user with all columns including wedding_data
4. If not found: 404
5. Return full user object

### Step 5: Create GET /api/admin/analytics (api/admin/analytics.ts)
1. Verify session
2. Parse query params: from (ISO date), to (ISO date), default last 30 days
3. Aggregation queries:
   - Event counts by type: `SELECT event_type, COUNT(*) FROM analytics_events WHERE created_at BETWEEN from AND to GROUP BY event_type ORDER BY count DESC`
   - Daily event counts: `SELECT DATE(created_at) as day, COUNT(*) FROM analytics_events WHERE ... GROUP BY day ORDER BY day`
   - Daily unique users: `SELECT DATE(created_at) as day, COUNT(DISTINCT user_id) FROM analytics_events WHERE ... GROUP BY day ORDER BY day`
4. Return: `{ eventsByType, dailyEvents, dailyUsers, from, to }`

### Step 6: Create GET /api/admin/system (api/admin/system.ts)
1. Verify session
2. Check DB connection (simple SELECT 1)
3. Check Redis connection (PING)
4. Count admin sessions: `SELECT COUNT(*) FROM admin_sessions WHERE expires_at > NOW()`
5. Get latest sync: `SELECT MAX(updated_at) FROM user_sessions`
6. Check env vars: list which are set (DATABASE_URL, UPSTASH_*, ADMIN_PASSWORD, Z_AI_KEY) -- values NOT exposed, just "set"/"missing"
7. Return: `{ db, redis, activeSessions, lastSync, envVars, version: process.env.VERCEL_GIT_COMMIT_SHA }`

### Step 7: Create admin stat card component (src/pages/admin/admin-stat-card.tsx)
1. Props: title, value, subtitle?, icon?, trend? (up/down/neutral)
2. Use shadcn Card component
3. Clean, minimal design: title in muted text, value in large bold, optional subtitle

### Step 8: Create admin bar chart component (src/pages/admin/admin-bar-chart.tsx)
1. Props: `data: { label: string, value: number, color?: string }[]`, title
2. Pure CSS implementation: horizontal bars with percentage widths
3. Calculate max value, render each bar as relative width
4. Labels on left, values on right

### Step 9: Create admin dashboard page (src/pages/admin/admin-dashboard.tsx)
1. Fetch /api/admin/dashboard on mount
2. Loading state with skeleton cards
3. Render stat cards grid (2x2 or 3 column):
   - Total Users
   - Active Today
   - Active This Week
   - Active This Month
4. Below: bar chart for region breakdown, lang breakdown
5. Additional stats: avg progress, avg budget, onboarded %
6. Auto-refresh every 60s (optional)

### Step 10: Create admin users page (src/pages/admin/admin-users.tsx)
1. Fetch /api/admin/users on mount and on filter change
2. Search input (debounced 500ms) at top
3. shadcn Table with columns: Groom, Bride, Wedding Date, Region, Progress, Budget, Last Active
4. Click row: open user detail (inline expandable or modal)
5. Pagination controls at bottom (prev/next, showing "X-Y of Z")
6. Sort by clicking column headers (toggle asc/desc)

### Step 11: Create admin user detail (src/pages/admin/admin-user-detail.tsx)
1. Fetch /api/admin/user-detail?id=X on mount
2. Display extracted fields in organized sections
3. Collapsible "Raw Data" section showing JSON.stringify(wedding_data, null, 2) in a <pre> block
4. Back button to return to user list
5. Could be a modal or a separate view -- DECISION: render as overlay/dialog using shadcn Dialog

### Step 12: Create admin analytics page (src/pages/admin/admin-analytics.tsx)
1. Date range picker (two date inputs: from, to)
2. Fetch /api/admin/analytics on mount and date change
3. Bar chart: events by type (page_view, checklist_toggle, etc.)
4. Bar chart: daily active users over time
5. Summary stats: total events, unique users in period

### Step 13: Create admin system page (src/pages/admin/admin-system.tsx)
1. Fetch /api/admin/system on mount
2. Status indicators (green/red/yellow dots):
   - Database: connected/error
   - Redis: connected/error
   - Environment: all vars set / some missing
3. Info: active admin sessions, last sync time, git commit SHA
4. Refresh button to re-check

### Step 14: Wire admin pages into admin-app.tsx
1. Import all admin page components (lazy load each)
2. Replace placeholder switch cases with real components
3. Pass auth context (onLogout callback) to pages that need it

## Todo List
- [x] Create api/admin/_auth.ts shared utility
- [x] Create api/admin/dashboard.ts
- [x] Create api/admin/users.ts
- [x] Create api/admin/user-detail.ts
- [x] Create api/admin/analytics.ts
- [x] Create api/admin/system.ts
- [x] Create src/pages/admin/admin-stat-card.tsx
- [x] Create src/pages/admin/admin-bar-chart.tsx
- [x] Create src/pages/admin/admin-dashboard.tsx
- [x] Create src/pages/admin/admin-users.tsx
- [x] Create src/pages/admin/admin-user-detail.tsx
- [x] Create src/pages/admin/admin-analytics.tsx
- [x] Create src/pages/admin/admin-system.tsx
- [x] Update admin-app.tsx to use real page components
- [ ] Test dashboard loads with real data
- [ ] Test user search and pagination
- [ ] Test analytics date range filtering
- [ ] Test system health indicators

## Success Criteria
- Dashboard shows accurate user counts matching DB
- Users table paginates correctly with search working
- User detail shows full wedding_data JSON
- Analytics shows event distribution and daily trends
- System page shows live DB/Redis status
- All admin endpoints return 401 without valid session
- All pages load < 1s with reasonable data volumes
- No external charting library added to bundle

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Slow aggregation queries on large dataset | Low (MVP scale) | Medium | Add indexes on updated_at, created_at; optimize later |
| Admin bundle too large | Low | Medium | Lazy-load each admin page; code-split via React.lazy |
| ILIKE search slow without index | Low | Low | Add GIN/trigram index if needed at scale |
| wedding_data JSON display crashes on huge data | Low | Low | Truncate display, virtualize if needed |

## Security Considerations
- All admin endpoints verify session before processing
- User data is read-only -- no modification/deletion endpoints
- wedding_data may contain personal names -- admin access is password-protected
- No user passwords or credentials stored (anonymous UUIDs)
- Env var values never returned to client (only "set"/"missing" status)
- SQL injection prevented by Drizzle parameterized queries

## Next Steps
- Post-MVP enhancements:
  - Export user data as CSV
  - Delete user data (GDPR compliance)
  - Real-time dashboard with WebSocket/SSE
  - OAuth admin auth (replace env var password)
  - Add DB indexes based on query patterns
  - Event funnel analysis (onboarding -> checklist completion)
