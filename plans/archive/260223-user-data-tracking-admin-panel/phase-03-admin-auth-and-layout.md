# Phase 3: Admin Auth & Layout

## Context Links
- [Parent Plan](./plan.md)
- [Phase 1 -- DB Schema](./phase-01-db-schema-and-sync.md) (dependency: admin_sessions table)
- [main.tsx](../../src/main.tsx) -- hash routing, lazy admin route added in Phase 1
- [App.tsx](../../src/App.tsx) -- theme variable pattern
- [shadcn components](../../src/components/ui/) -- existing UI components
- [Code Standards](../../docs/code-standards.md) -- file naming, size limits

## Overview
- **Priority:** P1
- **Effort:** 4h
- **Status:** done
- **Depends on:** Phase 1 (admin_sessions table, `#/admin` route in main.tsx)
- **Description:** Implement admin authentication (password-based login with httpOnly session cookie), admin routing, and admin shell layout with sidebar navigation.

## Key Insights
- Admin auth is simple: single password from ADMIN_PASSWORD env var, no user accounts
- Session stored in admin_sessions table with expiry (24h)
- httpOnly cookie prevents XSS token theft
- Admin panel is a separate mini-app rendered at `#/admin` -- completely independent from main wedding app
- Hash-based sub-routing within admin: `#/admin/dashboard`, `#/admin/users`, etc. parsed client-side
- Lazy-loaded via React.lazy in main.tsx (Phase 1 Step 7)
- Admin panel uses same shadcn/ui components but with default/neutral theme (no wedding theme variables)

## Requirements

### Functional
- F1: POST /api/admin/login -- verify password, create session, set httpOnly cookie
- F2: POST /api/admin/logout -- delete session, clear cookie
- F3: GET /api/admin/verify -- check if current session cookie is valid (for client-side auth check)
- F4: Admin login page at `#/admin` (or `#/admin/login`) -- password input + submit
- F5: Admin shell with sidebar: Dashboard, Users, Analytics, System pages
- F6: Auth guard: redirect to login if not authenticated
- F7: Sidebar navigation between admin pages via hash sub-routes

### Non-Functional
- NF1: Login response < 200ms
- NF2: Cookie httpOnly + Secure + SameSite=Lax
- NF3: Session expires after 24 hours
- NF4: Admin shell code-split from main app (React.lazy)
- NF5: Responsive sidebar (collapsible on mobile)
- NF6: Each admin component file < 200 lines

## Architecture

### Auth Flow

```
User visits #/admin
  --> AdminApp loads (lazy)
  --> GET /api/admin/verify (sends cookie)
    --> If valid session: show admin shell
    --> If no/expired session: show login page

Login:
  --> POST /api/admin/login { password }
  --> If match ADMIN_PASSWORD:
    --> Create row in admin_sessions (id=randomUUID, expires=now+24h)
    --> Set cookie: admin_session=<id>; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=86400
    --> Return { ok: true }
  --> Else: Return { error: "invalid_password" }, 401

Logout:
  --> POST /api/admin/logout
  --> Read cookie, delete session from DB
  --> Clear cookie (Max-Age=0)
  --> Return { ok: true }
```

### Admin Routing (client-side hash)

```
#/admin           --> redirect to #/admin/dashboard
#/admin/login     --> AdminLogin page
#/admin/dashboard --> AdminDashboard page
#/admin/users     --> AdminUsers page
#/admin/analytics --> AdminAnalytics page
#/admin/system    --> AdminSystem page
```

### Admin Shell Layout

```
+--sidebar (w-64)--+-----main content area-----+
| Logo/Title       |                            |
| Dashboard        |  <AdminPage />             |
| Users            |                            |
| Analytics        |                            |
| System           |                            |
| ---              |                            |
| Logout           |                            |
+------------------+----------------------------+
```

## Related Code Files

### Files to Create
- `api/admin/login.ts` -- login endpoint (~60 lines)
- `api/admin/logout.ts` -- logout endpoint (~40 lines)
- `api/admin/verify.ts` -- session verification endpoint (~45 lines)
- `src/pages/admin/admin-app.tsx` -- admin shell + router (~100 lines)
- `src/pages/admin/admin-login.tsx` -- login page (~80 lines)
- `src/pages/admin/admin-sidebar.tsx` -- sidebar navigation (~70 lines)
- `src/pages/admin/admin-route-guard.tsx` -- auth guard wrapper (~40 lines)
- `src/lib/admin-api.ts` -- admin API client helpers (~40 lines)

### Files to Modify
- `src/main.tsx` -- already modified in Phase 1 (lazy AdminApp import)
- `.env.example` -- already has ADMIN_PASSWORD from Phase 1

### Files to Delete
- None

## Implementation Steps

### Step 1: Create shared admin CORS + cookie helper
NOTE: Vercel serverless functions in `api/admin/` are separate files. Each needs CORS headers. Create a minimal pattern (copy getCorsOrigin per file, or accept the 3-line duplication since each function is standalone).

For cookie parsing, use a simple helper inline -- no external library needed:
```typescript
function parseCookies(header: string): Record<string, string> {
  return Object.fromEntries(header.split(';').map(c => {
    const [k, ...v] = c.trim().split('=');
    return [k, v.join('=')];
  }));
}
```

### Step 2: Create POST /api/admin/login (api/admin/login.ts)
1. Handle OPTIONS + POST-only guard with CORS
2. Parse body: `{ password: string }`
3. Compare `password === process.env.ADMIN_PASSWORD`
4. If no match: return 401 `{ error: "invalid_password" }`
5. If match:
   - Generate session id: `crypto.randomUUID()`
   - Compute expiresAt: `new Date(Date.now() + 24 * 60 * 60 * 1000)`
   - Insert into admin_sessions: `db.insert(adminSessions).values({ id, createdAt: new Date(), expiresAt })`
   - Set response header: `Set-Cookie: admin_session=${id}; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=86400`
   - Return `{ ok: true }`

### Step 3: Create POST /api/admin/logout (api/admin/logout.ts)
1. Handle OPTIONS + POST-only guard
2. Parse cookie header for `admin_session`
3. If session id found: `db.delete(adminSessions).where(eq(adminSessions.id, sessionId))`
4. Clear cookie: `Set-Cookie: admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=0`
5. Return `{ ok: true }`

### Step 4: Create GET /api/admin/verify (api/admin/verify.ts)
1. Handle OPTIONS + GET-only guard
2. Parse cookie header for `admin_session`
3. If no cookie: return 401 `{ authenticated: false }`
4. Query: `db.select().from(adminSessions).where(eq(adminSessions.id, sessionId)).limit(1)`
5. If no row or expiresAt < now: return 401 `{ authenticated: false }`
6. Return `{ authenticated: true }`

### Step 5: Create admin API client (src/lib/admin-api.ts)
1. Helper functions:
   - `adminLogin(password: string): Promise<{ ok: boolean; error?: string }>`
   - `adminLogout(): Promise<void>`
   - `adminVerify(): Promise<boolean>`
2. Each wraps fetch with `credentials: 'include'` (sends cookies)
3. Base URL: `/api/admin`
4. Error handling: return false/throw on network errors

### Step 6: Create admin login page (src/pages/admin/admin-login.tsx)
1. Simple centered card with password input + submit button
2. Use shadcn Card, Input, Button, Label components
3. State: password string, loading boolean, error string
4. On submit: call adminLogin, on success set parent auth state
5. Minimal styling: neutral background, centered card, no wedding theme
6. Show error message on failed login

### Step 7: Create admin sidebar (src/pages/admin/admin-sidebar.tsx)
1. Fixed-width sidebar (w-64, collapsible on mobile)
2. Nav items: Dashboard, Users, Analytics, System (lucide-react icons)
3. Active state based on current hash sub-route
4. Logout button at bottom
5. On logout: call adminLogout, set auth state to false, redirect to `#/admin/login`
6. Use shadcn Button with variant ghost for nav items
7. Mobile: hamburger toggle via useState

### Step 8: Create admin route guard (src/pages/admin/admin-route-guard.tsx)
1. Wraps admin content pages
2. On mount: call adminVerify()
3. States: loading (show spinner), authenticated (show children), unauthenticated (redirect to login)
4. Pass `onLogout` callback to children for logout flow

### Step 9: Create admin app shell (src/pages/admin/admin-app.tsx)
1. This is the top-level component rendered by main.tsx at `#/admin`
2. State: `isAuthenticated`, `isLoading`, current admin sub-route
3. Parse hash to get sub-route: `window.location.hash.replace('#/admin', '') || '/dashboard'`
4. Listen to hashchange for client-side navigation
5. If not authenticated and not loading: render AdminLogin
6. If authenticated: render sidebar + main content area
7. Main content area switches on sub-route:
   - `/dashboard` -> AdminDashboard (Phase 4, placeholder for now)
   - `/users` -> AdminUsers (Phase 4, placeholder)
   - `/analytics` -> AdminAnalytics (Phase 4, placeholder)
   - `/system` -> AdminSystem (Phase 4, placeholder)
8. Placeholder pages: simple `<div>Coming soon: {pageName}</div>`
9. Export as default for React.lazy: `export default function AdminApp() { ... }`

### Step 10: Verify admin flow end-to-end
1. Set ADMIN_PASSWORD in .env.local
2. Navigate to `#/admin`
3. Verify login page appears
4. Enter correct password, verify redirect to dashboard
5. Verify session cookie set (httpOnly, not visible in JS)
6. Refresh page, verify still authenticated
7. Click logout, verify redirected to login
8. Verify session deleted from DB

## Todo List
- [x] Create api/admin/login.ts
- [x] Create api/admin/logout.ts
- [x] Create api/admin/verify.ts
- [x] Create src/lib/admin-api.ts
- [x] Create src/pages/admin/admin-login.tsx
- [x] Create src/pages/admin/admin-sidebar.tsx
- [ ] Create src/pages/admin/admin-route-guard.tsx (merged into admin-app.tsx)
- [x] Create src/pages/admin/admin-app.tsx with placeholder pages
- [ ] Set ADMIN_PASSWORD in .env.local
- [ ] Test full auth flow (login/verify/logout)
- [ ] Test session expiry (manually set short TTL)
- [ ] Verify httpOnly cookie not accessible from JS

## Success Criteria
- Login with correct password creates session + sets httpOnly cookie
- Login with wrong password shows error, no session created
- Refreshing `#/admin/dashboard` stays authenticated (cookie sent to verify)
- Logout clears cookie + deletes DB session
- Expired session returns 401, shows login page
- Sidebar navigation works between admin pages
- Admin shell is code-split (not in main bundle)

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Password in env var leaked | Low | High | Vercel secrets are encrypted; rotate if compromised |
| Cookie not sent cross-origin | Medium | High | Set Path=/api/admin; use same-origin deploy on Vercel |
| Session fixation attack | Low | Medium | Session ID is random UUID; expires in 24h |
| Brute force login | Medium | Medium | Add rate limiting on login (5 attempts/min per IP) |

## Security Considerations
- ADMIN_PASSWORD never exposed to client (server-side only env var)
- httpOnly cookie prevents XSS-based session theft
- Secure flag ensures HTTPS-only transmission
- SameSite=Lax prevents CSRF for GET requests; POST admin APIs should check referer or use CSRF token (V2 enhancement)
- Rate limit login endpoint: 5 attempts per IP per minute
- Session expiry ensures stale sessions are invalidated
- Cookie Path=/api/admin scopes cookie to admin endpoints only

## Next Steps
- Phase 4 replaces placeholder admin pages with real dashboard, user list, analytics, and system health
