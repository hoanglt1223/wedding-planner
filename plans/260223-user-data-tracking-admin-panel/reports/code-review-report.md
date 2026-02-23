# Code Review Report: User Data Tracking & Admin Panel

**Date:** 2026-02-23
**Reviewer:** code-reviewer
**Build Status:** PASSING (tsc -b + vite build clean)
**Branch:** master

---

## Scope

- **Files Reviewed:** 22 files (5 API, 3 hooks, 1 lib, 10 admin pages, 1 schema, 2 modified)
- **LOC:** ~1,772 lines total across all files
- **Focus:** Security, data flow, error handling, performance, type safety, code quality

---

## Overall Assessment

This is a well-structured, pragmatic feature implementation. The consolidated endpoint pattern (auth.ts with `?action=`, data.ts with `?action=`) keeps file count low while maintaining clean separation. Code is readable, follows existing project patterns (factory functions, CORS headers, Web API Request/Response), and stays within file size limits. Security fundamentals are sound: httpOnly cookies, rate limiting, input validation, parameterized queries.

Several issues found, one critical (sensitive data leaking to DB), a few high-priority, and several medium observations.

---

## Critical Issues

### C1. WeddingState `apiKey` field synced to database as plaintext

**File:** `D:/Projects/wedding-planner/api/sync.ts` (line 89)
**Impact:** HIGH -- The entire `WeddingState` object, which contains `apiKey: string` (line 112 of `src/types/wedding.ts`), is stored as-is in the `wedding_data` jsonb column. If users enter an API key (e.g., for ZhipuAI), it gets persisted in the database and is viewable by admins via the user-detail endpoint.

The sync endpoint does:
```typescript
weddingData: data as unknown as Record<string, unknown>,
```

This stores the raw WeddingState blob including `apiKey`, `aiResponse` (which could contain personal content), and any other sensitive fields.

**Fix:** Strip sensitive fields before storing:
```typescript
// In api/sync.ts, before the upsert
const { apiKey, aiResponse, ...safeData } = data;
// Then use safeData instead of data for weddingData
```

### C2. Timing attack on admin password comparison

**File:** `D:/Projects/wedding-planner/api/admin/auth.ts` (line 21)
**Impact:** MEDIUM-HIGH -- Password comparison uses JavaScript's `!==` operator:
```typescript
if (!body.password || body.password !== process.env.ADMIN_PASSWORD)
```
This is vulnerable to timing side-channel attacks. An attacker can measure response times to infer password characters. Rate limiting (5/min) mitigates but doesn't eliminate this.

**Fix:** Use constant-time comparison:
```typescript
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

Note: `crypto.timingSafeEqual` is available in Node.js runtime on Vercel. Alternatively, since the rate limit is already at 5/min, this could be deferred to V2 if the team accepts the risk at MVP scale.

---

## High Priority

### H1. FK constraint prevents tracking events for new users (race condition)

**File:** `D:/Projects/wedding-planner/src/db/schema.ts` (line 33), `D:/Projects/wedding-planner/api/track.ts` (line 82)
**Impact:** MEDIUM-HIGH -- `analytics_events.user_id` has an FK reference to `user_sessions.id`. If tracking events flush (via useTracking) before the first sync completes (via useSync with 5s debounce), the DB insert will fail with an FK violation because the user_sessions row doesn't exist yet.

Scenario: User opens page, changes pages rapidly. Tracking buffer fills to 20 and flushes immediately via `fetch`. But useSync hasn't fired yet (5s debounce), so no `user_sessions` row exists for this userId.

**Fix options (pick one):**
1. Make the FK nullable with `ON DELETE SET NULL` and remove the strict FK (simplest for analytics)
2. Do a "touch" upsert on user_sessions in the track endpoint before inserting events
3. Change the track endpoint to catch FK violations and silently drop events for unknown users
4. Ensure sync fires before first track flush by triggering an immediate initial sync on mount

Option 3 is the pragmatic MVP fix:
```typescript
// In api/track.ts, wrap the insert
try {
  await db.insert(analyticsEvents).values(rows);
} catch (err: unknown) {
  // FK violation -- user not yet synced, drop silently
  if (String(err).includes("foreign key")) {
    return Response.json({ ok: true, count: 0, dropped: true }, { headers: CORS_HEADERS });
  }
  throw err;
}
```

### H2. No database indexes on frequently queried columns

**File:** `D:/Projects/wedding-planner/src/db/schema.ts`
**Impact:** MEDIUM -- No indexes on `user_sessions.updated_at`, `analytics_events.created_at`, `analytics_events.user_id`, or `analytics_events.event_type`. Dashboard queries filter by `updated_at > now() - interval`, analytics aggregates by `created_at` range and groups by `event_type`. At scale, these will do full table scans.

**Fix:** Add indexes in schema.ts:
```typescript
import { index } from "drizzle-orm/pg-core";

// After table definitions:
export const userSessionsUpdatedIdx = index("idx_user_sessions_updated_at")
  .on(userSessions.updatedAt);
export const analyticsEventsCreatedIdx = index("idx_analytics_events_created_at")
  .on(analyticsEvents.createdAt);
export const analyticsEventsUserIdx = index("idx_analytics_events_user_id")
  .on(analyticsEvents.userId);
```

Note: This can be deferred to post-MVP if the dataset is expected to remain small (<10k rows). But adding indexes early is low-cost.

### H3. Invalid timestamp in track events not validated

**File:** `D:/Projects/wedding-planner/api/track.ts` (line 78)
**Impact:** MEDIUM -- `new Date(e.timestamp)` can produce `Invalid Date` if the client sends a malformed timestamp string. This would insert a null/invalid `created_at` into the DB, potentially breaking analytics queries.

**Fix:**
```typescript
const rows = events.map((e) => {
  const ts = new Date(e.timestamp);
  return {
    userId,
    eventType: e.type,
    eventData: (e.data ?? null) as Record<string, unknown> | null,
    createdAt: isNaN(ts.getTime()) ? new Date() : ts, // fallback to server time
  };
});
```

### H4. CORS headers missing `Access-Control-Allow-Credentials` on sync/track endpoints

**File:** `D:/Projects/wedding-planner/api/sync.ts` (lines 13-17), `D:/Projects/wedding-planner/api/track.ts` (lines 12-16)
**Impact:** LOW-MEDIUM -- The sync and track endpoints don't include `Access-Control-Allow-Credentials: "true"`, while admin endpoints do. Currently this is fine because sync/track don't use cookies. But `sendBeacon` with a Blob doesn't send custom headers at all -- it relies on the browser's CORS preflight handling. No immediate bug, but inconsistency could confuse future maintainers.

Not a blocking issue -- included for completeness.

---

## Medium Priority

### M1. useSync recreates doSync closure on every render

**File:** `D:/Projects/wedding-planner/src/hooks/use-sync.ts` (lines 21-47)
**Impact:** LOW-MEDIUM -- `doSync` and `buildPayload` are plain functions defined inside the hook body, recreated every render. The `eslint-disable-next-line react-hooks/exhaustive-deps` comments suppress warnings, but the closures capture stale state in the event listener effects (visibility, heartbeat, unload). The effects have `[state, progress, userId]` in their dependency arrays, so they re-register listeners on every state change, which is correct but heavy.

This works correctly today because effects with `state` in deps re-subscribe on every state change. But it's fragile. Consider using `useCallback` + `useRef` pattern:
```typescript
const stateRef = useRef(state);
stateRef.current = state;
// Then doSync reads from stateRef.current
```
This would let visibility/heartbeat/unload effects have `[]` deps and avoid constant listener churn.

### M2. Admin users search double-fires on search input

**File:** `D:/Projects/wedding-planner/src/pages/admin/admin-users.tsx` (lines 53-59)
**Impact:** LOW-MEDIUM -- `onSearchChange` sets `search` state AND manually calls `load()` after a 500ms debounce. But the `useEffect` on line 53 already fires `load()` whenever `search` changes. This means every search change fires twice: once from the effect (immediately on state change), and once from the debounced manual call.

**Fix:** Remove the manual debounced `load` call and rely solely on the useEffect:
```typescript
function onSearchChange(val: string) {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    setSearch(val);
    setPage(1);
  }, 500);
}
```
Or keep a controlled input value separate from the debounced search state.

### M3. `.env.example` comment says "hashed at runtime" but password is compared as plaintext

**File:** `D:/Projects/wedding-planner/.env.example` (line 12)
**Impact:** LOW -- Comment says `# Admin panel password (hashed at runtime)` but the actual implementation in `auth.ts` line 21 does a direct string comparison: `body.password !== process.env.ADMIN_PASSWORD`. The comment is misleading.

**Fix:** Change comment to:
```
# Admin panel password (compared at runtime, use a strong password)
```

### M4. `getCorsOrigin()` duplicated across 3 non-admin API files

**File:** `D:/Projects/wedding-planner/api/sync.ts`, `D:/Projects/wedding-planner/api/track.ts`, `D:/Projects/wedding-planner/api/astrology-reading.ts`
**Impact:** LOW -- The exact same 4-line function is copy-pasted in sync.ts, track.ts, and the pre-existing astrology-reading.ts. The admin endpoints correctly extract this to `_auth.ts`. For the non-admin endpoints, consider a shared `api/_cors.ts` utility.

Not blocking for this PR -- acceptable serverless pattern.

### M5. `SortIndicator` component defined inside render function

**File:** `D:/Projects/wedding-planner/src/pages/admin/admin-users.tsx` (lines 68-69)
**Impact:** LOW -- `SortIndicator` is a React component defined inside the render scope, causing it to be recreated on every render. React will unmount/remount it every time.

**Fix:** Move outside the component:
```typescript
function SortIndicator({ col, sort, order }: { col: string; sort: string; order: string }) {
  return sort === col ? (order === "asc" ? " ↑" : " ↓") : "";
}
```

### M6. No expired admin session cleanup

**File:** `D:/Projects/wedding-planner/src/db/schema.ts`, `D:/Projects/wedding-planner/api/admin/auth.ts`
**Impact:** LOW -- Expired sessions remain in the `admin_sessions` table forever. Verification checks `expiresAt > now()`, so they're functionally dead, but the table will grow unboundedly over time.

**Fix:** Add cleanup logic to the verify endpoint (piggyback):
```typescript
// In handleVerify or verifyAdminSession, after successful verify:
db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date())).catch(() => {});
```

### M7. `analytics_events` FK has `ON DELETE no action`

**File:** `D:/Projects/wedding-planner/drizzle/0000_bitter_gorilla_man.sql` (line 33)
**Impact:** LOW -- If a user_sessions row is ever deleted, analytics_events rows referencing it will block the delete (FK constraint). Since there's no delete functionality in the admin panel currently, this isn't an immediate issue. But for future GDPR compliance (mentioned in plan.md's "Next Steps"), the FK should use `ON DELETE CASCADE` or `ON DELETE SET NULL`.

---

## Low Priority

### L1. `useUserId` not SSR-safe

**File:** `D:/Projects/wedding-planner/src/hooks/use-user-id.ts`
**Impact:** NEGLIGIBLE -- `localStorage` is accessed directly at the top of the function call. If this were ever rendered server-side, it would throw. Not relevant for this SPA, but worth noting if SSR is considered later.

### L2. Admin dashboard `load` function not wrapped in useCallback

**File:** `D:/Projects/wedding-planner/src/pages/admin/admin-dashboard.tsx` (line 30)
**Impact:** NEGLIGIBLE -- React strict mode may double-invoke the effect, causing two fetches on mount. Functionally harmless but slightly wasteful.

### L3. `useTracking` buffer uses `splice(0)` which mutates ref array in-place

**File:** `D:/Projects/wedding-planner/src/hooks/use-tracking.ts` (line 16)
**Impact:** NEGLIGIBLE -- `bufferRef.current.splice(0)` atomically empties and returns items. This is actually correct and prevents double-flush scenarios. Just noting it's unconventional compared to `const copy = [...buffer]; buffer.length = 0;`.

---

## Edge Cases Found by Scout

1. **Race: tracking before sync** -- Analytics events can fail FK constraint if tracking flushes before first sync creates user_sessions row (see H1)
2. **apiKey leaking to DB** -- Full WeddingState blob synced including `apiKey` and `aiResponse` fields (see C1)
3. **`sendBeacon` Content-Type** -- `sendBeacon` with `new Blob([...], { type: 'application/json' })` correctly sends Content-Type: application/json. Verified -- this is handled correctly.
4. **Double search load** -- Admin user search fires load twice per keystroke due to state change + manual debounced call (see M2)
5. **NaN date in analytics** -- Invalid client timestamp produces `Invalid Date` stored in DB (see H3)

---

## Positive Observations

1. **Consolidated endpoints** -- Using `?action=` pattern instead of many small files is pragmatic for Vercel and reduces deployment surface
2. **Shared auth utility** -- `api/admin/_auth.ts` with `_` prefix convention for non-endpoint files is clean Vercel pattern
3. **Rate limiting** -- All public endpoints properly rate-limited with distinct limits and prefixes
4. **CORS properly scoped** -- Admin endpoints include `Access-Control-Allow-Credentials: "true"` for cookie-based auth
5. **Parallel DB queries** -- Dashboard and users endpoints use `Promise.all` for parallel query execution
6. **Lazy loading** -- Admin sub-pages lazy-loaded with React.lazy, keeping main bundle clean
7. **sendBeacon fallback** -- useTracking checks `typeof navigator.sendBeacon === "function"` before calling
8. **Input validation** -- UUID regex validation, payload size guards, batch limits, pagination bounds all present
9. **Silent failure in hooks** -- Tracking/sync failures are properly swallowed to never impact user experience
10. **File sizes** -- All files within 200-line limit; most well under 130 lines
11. **Mobile-responsive sidebar** -- Admin sidebar has proper mobile toggle with overlay

---

## Recommended Actions

### Must Fix (before merge):
1. **[C1]** Strip `apiKey` and `aiResponse` from wedding_data before DB storage
2. **[H1]** Handle FK violation in track endpoint (catch + silent drop)
3. **[H3]** Validate event timestamps in track endpoint (fallback to server time)

### Should Fix (soon after merge):
4. **[C2]** Use constant-time comparison for admin password
5. **[M2]** Fix double-fire search in admin users page
6. **[M3]** Correct misleading `.env.example` comment about hashing
7. **[M5]** Move SortIndicator outside render function

### Nice to Have (backlog):
8. **[H2]** Add DB indexes on `updated_at`, `created_at`, `user_id`
9. **[M1]** Refactor useSync to use refs for stable closures
10. **[M6]** Add expired admin session cleanup
11. **[M7]** Change FK to `ON DELETE CASCADE` or `SET NULL`
12. **[M4]** Extract shared `_cors.ts` utility for non-admin endpoints

---

## Metrics

| Metric | Value |
|--------|-------|
| Type Coverage | 100% -- all files TypeScript, strict mode, no `any` casts |
| Test Coverage | 0% -- no tests exist (MVP acceptable per plan) |
| Linting Issues | 4 eslint-disable comments for exhaustive-deps (justified) |
| Build Status | PASSING |
| File Size Compliance | 100% -- all files under 200 lines |
| Security Controls | Rate limiting, httpOnly cookies, UUID validation, payload guards, CORS |

---

## Unresolved Questions

1. Should `apiKey` be removed from `WeddingState` type entirely, or just stripped during sync? If users stop using client-side API keys in favor of server-side only, the field could be deprecated.
2. The `analytics_events` table will grow unboundedly. Is there a retention policy? Consider adding a cron/scheduled cleanup for events older than 90 days.
3. The `share.ts` endpoint uses `CORS: "*"` while sync/track use `getCorsOrigin()`. Should share.ts be updated for consistency?
