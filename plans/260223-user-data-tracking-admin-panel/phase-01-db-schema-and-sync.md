# Phase 1: DB Schema & Sync

## Context Links
- [Parent Plan](./plan.md)
- [DB Schema](../../src/db/schema.ts) -- currently empty (commented-out example)
- [DB Factory](../../src/db/index.ts) -- createDb() pattern
- [Wedding Types](../../src/types/wedding.ts) -- WeddingState interface
- [Wedding Store](../../src/hooks/use-wedding-store.ts) -- useWeddingStore hook
- [API Pattern](../../api/astrology-reading.ts) -- handler + CORS pattern
- [main.tsx](../../src/main.tsx) -- hash-based routing Root component

## Overview
- **Priority:** P1
- **Effort:** 4h
- **Status:** done
- **Description:** Define DB tables (user_sessions, analytics_events, admin_sessions), create sync API endpoint, implement client-side useUserId and useSync hooks.

## Key Insights
- Schema is currently blank -- first real tables for the project
- WeddingState is stored in localStorage under key `wp_v13`
- State updates happen via named setters in useWeddingStore (no central middleware)
- Existing API pattern: default export `handler(request: Request): Promise<Response>`, Web API Response, CORS headers
- main.tsx already does hash routing -- admin can plug in as `#/admin`
- drizzle.config.ts points to `./src/db/schema.ts`, migrations output to `./drizzle/`

## Requirements

### Functional
- F1: Define user_sessions table with UUID PK, wedding_data jsonb blob, extracted query columns (names, dates, region, lang, guest count, progress, budget, onboarding status)
- F2: Define analytics_events table with auto-increment PK, FK to user_sessions, event_type text, event_data jsonb
- F3: Define admin_sessions table with text PK, timestamps for created/expires
- F4: POST /api/sync endpoint: upsert user_sessions row, extract profile columns from wedding_data JSON
- F5: useUserId hook: generate UUID on first visit, persist in localStorage
- F6: useSync hook: debounced sync (5s after state change), visibilitychange sync, 5min heartbeat, sendBeacon on unload

### Non-Functional
- NF1: Sync endpoint completes < 500ms (single upsert)
- NF2: Rate limit sync to 30 req/min per userId
- NF3: Max wedding_data payload 50KB
- NF4: No module-level side effects in new files

## Architecture

### DB Schema (src/db/schema.ts)

```
user_sessions
  id          uuid PK (client-generated)
  wedding_data  jsonb
  groom_name    text
  bride_name    text
  groom_birth_date  text
  bride_birth_date  text
  wedding_date  text
  region        text
  lang          text
  guest_count   integer default 0
  checklist_progress  real default 0
  budget        integer default 0
  onboarding_complete  boolean default false
  created_at    timestamp defaultNow
  updated_at    timestamp defaultNow

analytics_events
  id            serial PK
  user_id       uuid FK -> user_sessions.id
  event_type    text not null
  event_data    jsonb
  created_at    timestamp defaultNow

admin_sessions
  id            text PK (crypto.randomUUID)
  created_at    timestamp defaultNow
  expires_at    timestamp not null
```

### Sync API Flow

```
Client (useSync) --POST /api/sync--> Vercel Function
  1. Rate limit check (userId, 30/min)
  2. Validate payload size (<50KB)
  3. Extract profile fields from wedding_data JSON
  4. Upsert into user_sessions (ON CONFLICT id DO UPDATE)
  5. Return { ok: true, synced_at }
```

### useSync Hook Flow

```
State changes --> debounce 5s --> POST /api/sync
visibilitychange (hidden) --> immediate sync
5min heartbeat interval --> POST /api/sync
beforeunload --> navigator.sendBeacon('/api/sync', blob)
```

## Related Code Files

### Files to Create
- `src/db/schema.ts` -- OVERWRITE: define all 3 tables (user_sessions, analytics_events, admin_sessions)
- `api/sync.ts` -- sync endpoint handler (~100 lines)
- `src/hooks/use-user-id.ts` -- anonymous UUID hook (~25 lines)
- `src/hooks/use-sync.ts` -- smart sync hook (~120 lines)

### Files to Modify
- `src/App.tsx` -- add useUserId + useSync hooks into App component
- `src/main.tsx` -- add `#/admin` route case (renders lazy AdminApp)
- `.env.example` -- add ADMIN_PASSWORD entry

### Files to Delete
- None

## Implementation Steps

### Step 1: Define DB schema (src/db/schema.ts)
1. Import pgTable, serial, text, timestamp, integer, jsonb, uuid, real, boolean from drizzle-orm/pg-core
2. Export `userSessions` table with all columns per schema above
3. Export `analyticsEvents` table with FK reference to userSessions.id
4. Export `adminSessions` table with text PK + timestamps
5. Keep file under 60 lines

### Step 2: Generate and run migration
1. Run `npm run db:generate` to create migration SQL
2. Run `npm run db:migrate` to apply to Neon
3. Verify tables in Drizzle Studio (`npm run db:studio`)

### Step 3: Create sync API endpoint (api/sync.ts)
1. Copy CORS pattern from api/astrology-reading.ts (getCorsOrigin, CORS_HEADERS)
2. Extract CORS helper into a shared file? NO -- keep DRY but each endpoint is standalone on Vercel. Copy the pattern (3 lines).
3. Handle OPTIONS preflight
4. Guard POST-only
5. Parse body as `{ userId: string, data: WeddingState }`
6. Validate: userId is valid UUID format, JSON.stringify(data).length < 50_000
7. Rate limit: 30 req/min per userId using Upstash Ratelimit (sliding window)
8. Extract profile fields from data:
   - `data.info.groom` -> groomName
   - `data.info.bride` -> brideName
   - `data.info.groomBirthDate` -> groomBirthDate
   - `data.info.brideBirthDate` -> brideBirthDate
   - `data.info.date` -> weddingDate
   - `data.region` -> region
   - `data.lang` -> lang
   - `data.guests.length` -> guestCount
   - compute checklist progress: `Object.values(data.checkedItems).filter(Boolean).length / totalCheckable` -- but totalCheckable requires step data. SIMPLIFY: store raw checked count and total as separate fields? NO -- store just the pct as a number passed from client. The sync payload should include `{ userId, data, progress }` where progress is the pct number.
   - `data.budget` -> budget
   - `data.onboardingComplete` -> onboardingComplete
9. Upsert using Drizzle: `db.insert(userSessions).values({...}).onConflictDoUpdate({ target: userSessions.id, set: {...} })`
10. Return `Response.json({ ok: true, syncedAt: new Date().toISOString() })`

### Step 4: Create useUserId hook (src/hooks/use-user-id.ts)
1. Generate UUID via `crypto.randomUUID()`
2. Store in localStorage key `wp_user_id`
3. On init: read from localStorage, if missing generate + persist
4. Return stable userId string
5. Do NOT use React state -- just a synchronous read/write to localStorage (the ID never changes)

### Step 5: Create useSync hook (src/hooks/use-sync.ts)
1. Accept params: `{ userId: string, state: WeddingState, progress: number }`
2. Use useRef for debounce timer, last-synced JSON snapshot
3. Core `doSync(beacon?: boolean)` function:
   - Serialize state to JSON, compare with lastSynced ref -- skip if identical
   - If `beacon` flag: use `navigator.sendBeacon('/api/sync', new Blob([JSON.stringify(payload)], { type: 'application/json' }))`
   - Else: `fetch('/api/sync', { method: 'POST', body, headers })` with try/catch (silent fail)
   - On success: update lastSynced ref
4. Debounced sync: useEffect on state changes, clearTimeout + setTimeout 5000ms
5. Visibility sync: useEffect to add visibilitychange listener, call doSync when hidden
6. Heartbeat: useEffect with setInterval 5min (300_000ms), call doSync
7. Unload: useEffect to add beforeunload listener, call doSync(true) for beacon
8. Cleanup all timers/listeners on unmount

### Step 6: Integrate hooks in App.tsx
1. Import useUserId, useSync
2. Call `const userId = useUserId()` at top of App
3. Call `useSync({ userId, state, progress: progress.pct })` after progress computation
4. No UI changes needed

### Step 7: Add admin route in main.tsx
1. Add lazy import: `const AdminApp = lazy(() => import('./pages/admin/admin-app.tsx'))`
2. In Root component, add before LandingPage fallback:
   ```
   if (hash.startsWith('#/admin')) return <Suspense fallback={<div>Loading...</div>}><AdminApp /></Suspense>
   ```
3. Import `lazy, Suspense` from react (already has useEffect, useState)
4. AdminApp component will be created in Phase 3 -- for now this route will show loading/error

### Step 8: Update .env.example
1. Add `ADMIN_PASSWORD=` entry with comment

## Todo List
- [ ] Define user_sessions, analytics_events, admin_sessions in schema.ts
- [ ] Generate Drizzle migration
- [ ] Run migration against Neon
- [ ] Create api/sync.ts with upsert + rate limiting
- [ ] Create src/hooks/use-user-id.ts
- [ ] Create src/hooks/use-sync.ts with debounce/visibility/heartbeat/beacon
- [ ] Integrate useUserId + useSync in App.tsx
- [ ] Add #/admin route placeholder in main.tsx
- [ ] Update .env.example
- [ ] Verify sync works via manual test (check DB row appears)

## Success Criteria
- DB tables created and visible in Drizzle Studio
- Navigating the app creates/updates a user_sessions row within 5s
- Page visibility change triggers immediate sync
- sendBeacon fires on tab close (verify via network panel)
- Rate limiting kicks in at >30 req/min
- Payloads >50KB are rejected with 413

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| sendBeacon blocked by browser | Low | Low | Visibility + heartbeat as fallbacks |
| Large JSON blobs slow upsert | Low | Medium | 50KB payload guard; jsonb is efficient |
| localStorage UUID deleted by user | Medium | Low | New UUID generated, old session orphaned (acceptable) |
| Race condition on rapid state changes | Low | Low | Debounce ensures only latest state sent |

## Security Considerations
- No PII beyond names voluntarily entered by user
- UUID is anonymous -- no email/login required
- Rate limiting prevents abuse
- Payload size guard prevents DoS
- CORS restricted to production origin

## Next Steps
- Phase 2 uses userId + analytics_events table from this phase
- Phase 3 uses admin_sessions table from this phase
- Phase 4 queries user_sessions for admin dashboard
