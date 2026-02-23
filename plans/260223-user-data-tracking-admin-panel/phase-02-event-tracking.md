# Phase 2: Event Tracking

## Context Links
- [Parent Plan](./plan.md)
- [Phase 1 -- DB Schema & Sync](./phase-01-db-schema-and-sync.md) (dependency)
- [analytics_events table](../../src/db/schema.ts) -- defined in Phase 1
- [Page Router](../../src/pages/page-router.tsx) -- page navigation switch
- [Wedding Store](../../src/hooks/use-wedding-store.ts) -- state setters
- [App.tsx](../../src/App.tsx) -- main app component

## Overview
- **Priority:** P1
- **Effort:** 3h
- **Status:** done
- **Depends on:** Phase 1 (user_sessions table, useUserId hook)
- **Description:** Create event tracking API endpoint, client-side useTracking hook with batched flush, and instrument key user actions across existing components.

## Key Insights
- Events tracked to own DB -- no external analytics dependency
- Batch events client-side, flush periodically or on page hide to minimize API calls
- analytics_events table has userId FK, event_type text, event_data jsonb
- Keep instrumentation minimal and non-invasive -- add tracking calls alongside existing handlers
- PageRouter uses state.page switch -- track page views by observing page changes in App.tsx

## Requirements

### Functional
- F1: POST /api/track endpoint: accept batch of events `{ userId, events: [{ type, data }] }`, insert all to analytics_events
- F2: useTracking hook: buffer events in memory, flush every 30s or on visibilitychange or on buffer size > 20
- F3: Track these events:
  - `page_view` -- page name, timestamp
  - `onboarding_complete` -- region, lang
  - `checklist_toggle` -- step id, checked state
  - `guest_add` / `guest_remove` -- guest count after action
  - `budget_set` -- budget amount
  - `theme_change` -- theme id
  - `lang_change` -- new lang
  - `region_change` -- new region
  - `ai_reading_request` -- birth date (year only), gender
  - `share_create` -- success/failure

### Non-Functional
- NF1: Track calls must be fire-and-forget -- never block UI
- NF2: Rate limit track endpoint: 10 req/min per userId
- NF3: Max 50 events per batch
- NF4: Tracking failure must be silent -- no user-visible errors
- NF5: useTracking hook < 80 lines

## Architecture

### Track API Flow

```
Client (useTracking) --POST /api/track--> Vercel Function
  1. Rate limit check (userId, 10/min)
  2. Validate payload (userId valid, events array, max 50 events)
  3. Batch insert into analytics_events
  4. Return { ok: true, count }
```

### useTracking Hook Flow

```
Component calls track("event_type", { ...data })
  --> pushes to in-memory buffer (useRef array)
  --> if buffer.length >= 20: flush immediately
  --> else: 30s interval auto-flushes
  --> visibilitychange (hidden): flush via sendBeacon
  --> beforeunload: flush via sendBeacon
```

### Event Schema

```typescript
interface TrackEvent {
  type: string;       // e.g. "page_view"
  data?: unknown;     // arbitrary JSON payload
  timestamp: string;  // ISO 8601, set client-side
}
```

## Related Code Files

### Files to Create
- `api/track.ts` -- batch event insert endpoint (~70 lines)
- `src/hooks/use-tracking.ts` -- event buffer + flush hook (~75 lines)

### Files to Modify
- `src/App.tsx` -- add useTracking, track page_view on page changes
- `src/hooks/use-wedding-store.ts` -- NO modification needed. Tracking is done at the component level, not inside the store.
- `src/components/onboarding/onboarding-wizard.tsx` -- track onboarding_complete
- `src/pages/page-router.tsx` -- NO modification. Page views tracked in App.tsx via useEffect on state.page.

### Files to Delete
- None

## Implementation Steps

### Step 1: Create track API endpoint (api/track.ts)
1. Copy CORS pattern from api/sync.ts
2. Handle OPTIONS preflight, POST-only guard
3. Parse body: `{ userId: string, events: TrackEvent[] }`
4. Validate: userId is UUID format, events is array, events.length <= 50
5. Rate limit: 10 req/min per userId (Upstash Ratelimit)
6. Map events to insert rows:
   ```typescript
   const rows = events.map(e => ({
     userId: body.userId,
     eventType: e.type,
     eventData: e.data ?? null,
     createdAt: new Date(e.timestamp),
   }));
   ```
7. Batch insert: `db.insert(analyticsEvents).values(rows)`
8. Return `Response.json({ ok: true, count: rows.length })`
9. Wrap in try/catch, return 500 on error

### Step 2: Create useTracking hook (src/hooks/use-tracking.ts)
1. Accept `userId: string` parameter
2. Internal refs: `bufferRef = useRef<TrackEvent[]>([])`, `timerRef = useRef<number>()`
3. `track(type: string, data?: unknown)` function:
   - Push `{ type, data, timestamp: new Date().toISOString() }` to buffer
   - If buffer.length >= 20: call flush()
4. `flush(beacon?: boolean)` function:
   - If buffer empty, return
   - Copy + clear buffer (to prevent double-flush)
   - Payload: `{ userId, events: copied }`
   - If beacon: `navigator.sendBeacon('/api/track', new Blob([JSON.stringify(payload)], { type: 'application/json' }))`
   - Else: `fetch('/api/track', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }).catch(() => {})` -- silent failure
5. Auto-flush interval: `setInterval(flush, 30_000)` in useEffect
6. Visibility listener: `document.addEventListener('visibilitychange', () => { if (document.hidden) flush(true) })`
7. Unload listener: `window.addEventListener('beforeunload', () => flush(true))`
8. Cleanup: clear interval, remove listeners on unmount
9. Return `{ track }` -- just the track function

### Step 3: Integrate tracking in App.tsx
1. Import useTracking
2. Call `const { track } = useTracking(userId)` after useUserId
3. Track page views: `useEffect(() => { track('page_view', { page: state.page }) }, [state.page])`
4. Pass `track` down to components that need it via props or create a context? DECISION: Pass as prop to PageRouter and let it pass to child pages. Simpler than context, avoids over-engineering. Alternatively, track high-level events in App.tsx only and use useEffect watchers.
5. SIMPLIFICATION: For MVP, track most events in App.tsx using useEffect watchers on state changes:
   - `useEffect on state.page` -- page_view (already above)
   - `useEffect on state.lang` -- lang_change
   - `useEffect on state.region` -- region_change
   - `useEffect on state.themeId` -- theme_change
   - `useEffect on state.budget` -- budget_set
   - `useEffect on state.guests.length` -- guest count change
   - `useEffect on state.onboardingComplete` -- onboarding_complete
6. Skip initial mount tracking: use a mountRef pattern (already exists in App.tsx for save toast)

### Step 4: Add tracking to specific components (optional, Phase 2b)
- Checklist toggle: track in PlanningPage or the checklist component
- AI reading request: track in AstrologyPage
- Share create: track in share handler
- These can be added incrementally -- not blocking Phase 2 completion

## Todo List
- [ ] Create api/track.ts with batch insert + rate limiting
- [ ] Create src/hooks/use-tracking.ts with buffer/flush/beacon
- [ ] Add useTracking + page_view tracking in App.tsx
- [ ] Add state-change watchers for lang/region/theme/budget/guests/onboarding
- [ ] Test: verify events appear in analytics_events table
- [ ] Test: verify beacon fires on tab close
- [ ] Test: verify rate limiting works

## Success Criteria
- Navigating between pages creates page_view events in DB
- Changing language/region/theme creates corresponding events
- Events are batched (not individual API calls per action)
- Buffer flushes on visibility change (tab switch)
- sendBeacon fires on page unload
- Rate limiting at 10 req/min per user works
- No console errors or UI disruptions from tracking

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Event flood from rapid state changes | Medium | Low | Buffer + debounced flush + max 50/batch |
| sendBeacon payload too large | Low | Low | 50 event max keeps payload small (~5KB) |
| Analytics table grows very large | Medium | Medium | Add index on created_at; partition later if needed |
| Tracking slows UI rendering | Low | High | All async, fire-and-forget, no await in render |

## Security Considerations
- No sensitive data in events (no full names, no passwords)
- event_data is arbitrary JSON -- validate type is string, data is object/null
- Rate limiting prevents event spam
- userId is anonymous UUID

## Next Steps
- Phase 3 needs no tracking data but benefits from knowing active user patterns
- Phase 4 admin analytics page will query analytics_events via aggregation endpoints
