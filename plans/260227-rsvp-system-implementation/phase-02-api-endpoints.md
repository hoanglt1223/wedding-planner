# Phase 2: API Endpoints

## Context Links

- [Brainstorm Report](./reports/brainstorm-report.md)
- [Phase 1 — DB Schema](./phase-01-database-schema-migration.md)
- [Existing API — share.ts](../../api/share.ts) (CORS + VercelRequest/VercelResponse pattern)
- [Existing API — sync.ts](../../api/sync.ts) (rate limiting + DB upsert pattern)
- [Existing API — ai/chat.ts](../../api/ai/chat.ts) (nested API route pattern)

## Overview

- **Priority:** P1 (blocks phases 3 and 4)
- **Status:** complete
- **Description:** Four RSVP API endpoints: bulk token creation, invitation fetch (public), response submission (public, one-time), and dashboard listing.

## Key Insights

- Vercel file-based routing: `api/rsvp.ts` handles GET/POST on `/api/rsvp`, `api/rsvp/respond.ts` handles POST on `/api/rsvp/respond`, `api/rsvp/list.ts` handles GET on `/api/rsvp/list`
- All handlers use `VercelRequest`/`VercelResponse` types (not Web API Request/Response)
- Factory functions `createDb()` and `createRedis()` instantiated per-request
- CORS headers set via helper function; OPTIONS pre-flight handled
- Rate limiting via `@upstash/ratelimit` with graceful fallback when Redis unavailable
- `nanoid` must be imported; needs `npm install nanoid` first

## Requirements

### Functional
- **POST /api/rsvp** — Bulk-create tokens for guests. Input: `userId`, `guests: {name}[]`. Output: `{tokens: {guestName, token}[]}`. Generates 12-char nanoid per guest. Also accepts `themeId` and `lang` to store with invitations for guest page rendering.
- **GET /api/rsvp?token=X** — Fetch single invitation by token. Public, no auth. Returns guest name, status, event details (from planner's rsvpSettings synced in user_sessions), theme, lang. If already responded, returns response data too.
- **POST /api/rsvp/respond** — Submit RSVP response. Input: `token`, `status`, `plusOnes`, `dietary`, `message`. One-time: fails if `responded_at` is not null. Returns success + timestamp.
- **GET /api/rsvp/list?userId=X** — Fetch all invitations for a planner. Returns array of invitation objects for dashboard rendering.

### Non-functional
- Rate limit POST /api/rsvp: 10 req/min per userId (prevent spam generation)
- Rate limit POST /api/rsvp/respond: 20 req/min per IP (prevent brute-force)
- No rate limit on GET endpoints (public read)
- Input validation on all endpoints
- CORS headers on all endpoints

## Architecture

### File Structure

```
api/
├── rsvp.ts           # POST (bulk create) + GET (fetch by token)
├── rsvp/
│   ├── respond.ts    # POST (submit response)
│   └── list.ts       # GET (dashboard list)
```

### Data Flow

```
Planner Dashboard                              Guest Page
       │                                           │
  POST /api/rsvp                             GET /api/rsvp?token=X
  (bulk create tokens)                       (fetch invitation + event details)
       │                                           │
       ▼                                           ▼
  rsvp_invitations                           rsvp_invitations
  (INSERT rows)                              + user_sessions.wedding_data
       │                                           │
       │                                    POST /api/rsvp/respond
       │                                    (submit response)
       │                                           │
  GET /api/rsvp/list?userId=X                      ▼
  (fetch all for dashboard)                  rsvp_invitations
       │                                    (UPDATE status, dietary, etc.)
       ▼
  Response table + stats
```

## Related Code Files

### Files to Create
- `api/rsvp.ts` — handles POST (bulk create) and GET (fetch by token)
- `api/rsvp/respond.ts` — handles POST (submit response)
- `api/rsvp/list.ts` — handles GET (dashboard listing)

### Files to Modify
- None (Phase 1 handles all schema/type changes)

### Dependencies to Install
- `nanoid` — `npm install nanoid`

## Implementation Steps

### 1. Install nanoid

```bash
npm install nanoid
```

### 2. Create `api/rsvp.ts` — Bulk Create + Fetch by Token

Handles two methods on same path:

**POST /api/rsvp** (Bulk Create):
```typescript
// Input validation
interface BulkCreateRequest {
  userId: string;
  guests: { name: string }[];
  themeId?: string;
  lang?: string;
}
```
- Validate userId is UUID format (reuse UUID_RE from sync.ts pattern)
- Validate guests array exists, max 500 guests per call
- For each guest: generate 12-char nanoid token
- Batch INSERT into rsvp_invitations (single query with `.values([...])`)
- Return `{ tokens: [{ guestName, token }] }`
- Rate limit: 10 req/min per userId

**GET /api/rsvp?token=X** (Fetch Invitation):
```typescript
// Query params
// token: string (12-char nanoid)
```
- Validate token exists and length <= 20
- SELECT from rsvp_invitations WHERE token = X
- If not found: 404
- Fetch planner's wedding_data from user_sessions WHERE id = invitation.userId
- Extract: info (couple names, date), rsvpSettings, themeId, lang
- Return combined payload for guest page rendering:
  ```typescript
  {
    guestName: string;
    status: string;           // pending|accepted|declined
    respondedAt: string|null;
    plusOnes: number;
    dietary: string|null;
    message: string|null;
    event: {
      bride: string;
      groom: string;
      date: string;
      welcomeMessage: string;
      venue: string;
      venueAddress: string;
      venueMapLink: string;
      coupleStory: string;
    };
    themeId: string;
    lang: string;
  }
  ```

### 3. Create `api/rsvp/respond.ts` — Submit Response

**POST /api/rsvp/respond**:
```typescript
interface RespondRequest {
  token: string;
  status: "accepted" | "declined";
  plusOnes?: number;
  dietary?: string;
  message?: string;
}
```
- Validate token
- Validate status is "accepted" or "declined"
- Validate plusOnes is integer 0-20 (if provided)
- Validate dietary/message string length <= 500
- SELECT invitation WHERE token = X
- If not found: 404
- If `responded_at IS NOT NULL`: 409 Conflict (already responded)
- UPDATE: set status, plusOnes, dietary, message, respondedAt = now()
- Return `{ ok: true, respondedAt: timestamp }`
- Rate limit: 20 req/min per IP (use `x-forwarded-for` or `x-real-ip`)

### 4. Create `api/rsvp/list.ts` — Dashboard List

**GET /api/rsvp/list?userId=X**:
```typescript
// Query params
// userId: string (UUID)
```
- Validate userId is UUID format
- SELECT * FROM rsvp_invitations WHERE userId = X ORDER BY createdAt DESC
- Return `{ invitations: [...] }`
- No rate limiting (planner-facing, low volume)

### 5. Shared CORS Helper

All 3 files need CORS. Extract pattern from `api/share.ts`:
- `Access-Control-Allow-Origin: *` (public guest page needs cross-origin)
- `Access-Control-Allow-Methods` per endpoint
- `Access-Control-Allow-Headers: Content-Type`

### 6. Build check

```bash
npm run build
```

## API Response Codes

| Endpoint | Code | Meaning |
|----------|------|---------|
| POST /api/rsvp | 200 | Tokens created |
| POST /api/rsvp | 400 | Invalid input |
| POST /api/rsvp | 429 | Rate limited |
| GET /api/rsvp?token= | 200 | Invitation found |
| GET /api/rsvp?token= | 404 | Token not found |
| POST /api/rsvp/respond | 200 | Response recorded |
| POST /api/rsvp/respond | 404 | Token not found |
| POST /api/rsvp/respond | 409 | Already responded |
| POST /api/rsvp/respond | 429 | Rate limited |
| GET /api/rsvp/list | 200 | Invitations listed |
| GET /api/rsvp/list | 400 | Missing/invalid userId |

## Todo List

- [ ] Install nanoid: `npm install nanoid`
- [ ] Create api/rsvp.ts with POST (bulk create) and GET (fetch by token)
- [ ] Create api/rsvp/respond.ts with POST (submit response)
- [ ] Create api/rsvp/list.ts with GET (dashboard list)
- [ ] Add rate limiting to POST endpoints
- [ ] Validate all input parameters
- [ ] Run npm run build -- verify clean

## Success Criteria

- All 4 endpoints respond correctly to valid requests
- Invalid input returns appropriate 4xx codes
- One-time guard: second POST to /respond returns 409
- Rate limiting active on POST endpoints
- `npm run build` passes

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| nanoid ESM import issues | Medium | Low | nanoid v5 is ESM-only; may need v3 for CJS compat. Check Vercel Node runtime. If issue, use `crypto.randomBytes` fallback |
| Batch INSERT performance | Low | Low | Single query; max 500 guests per call |
| CORS issues on guest page | Low | Medium | Use `Access-Control-Allow-Origin: *` for public endpoints |

## Security Considerations

- Tokens are generated server-side with nanoid (cryptographically secure)
- Guest page fetch does NOT expose planner userId in response
- Response endpoint validates status enum (no arbitrary strings)
- String lengths capped (dietary 500 chars, message 500 chars)
- plusOnes capped at 20 to prevent absurd values
- Rate limiting prevents brute-force token guessing (20 req/min per IP)

## Next Steps

Phases 3 (Guest Page) and 4 (Dashboard) can proceed in parallel once this phase completes. Both consume these API endpoints.
