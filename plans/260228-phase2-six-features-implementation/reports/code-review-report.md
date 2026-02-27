# Code Review Report: Phase 2 Six Features Implementation

**Date:** 2026-02-28
**Reviewer:** Code Review Agent
**Branch:** master (uncommitted working tree)
**Build:** Passes clean (`tsc -b` zero errors)
**Lint:** 0 new errors (18 pre-existing)

---

## Scope

- **Files reviewed:** 65 (13 modified + 52 new)
- **LOC added:** ~3,500+ (new files) + ~300 (modifications)
- **Focus:** All Phase 2 files -- foundation, 6 features, 3 API endpoints
- **Features:** Countdown, Timeline, Gift Tracker, Photo Wall, Task Board, Wedding Website

## Overall Assessment

Solid implementation. Clean separation of concerns across 7 phases with no file ownership conflicts. Good consistency in patterns (factory functions, token-based auth, rate limiting, CORS). TypeScript strict mode maintained with zero `any` types. API security is generally well-handled with input truncation, ownership checks, and rate limiting.

Three issues warrant attention before merge: an XSS vector in venue map links, missing `v14->v15` migration chain, and the userId-as-auth pattern lacking server-side verification.

---

## Critical Issues

### C1. XSS via `javascript:` URI in venue map link

**File:** `D:\Projects\wedding-planner\src\components\website\website-venue.tsx:12`

`encodeURI()` does NOT sanitize `javascript:` or `data:` URIs. A couple could enter `javascript:alert(1)` as their venue map link, which would be rendered in the public wedding website as a clickable `<a href>`.

```tsx
// Current (vulnerable)
const safeMapLink = venueMapLink ? encodeURI(venueMapLink) : null;

// Fix: validate protocol
const safeMapLink = venueMapLink && /^https?:\/\//i.test(venueMapLink)
  ? encodeURI(venueMapLink)
  : null;
```

Same validation should be applied in `api/website.ts:69` where venueMapLink is exposed to the public data payload.

**Impact:** Stored XSS on public wedding pages. Any visitor clicking the map link would execute arbitrary JavaScript.

### C2. `heroImage` URL in CSS `background-image` -- incomplete sanitization

**File:** `D:\Projects\wedding-planner\src\components\website\website-hero.tsx:46`

`CSS.escape()` is used, but CSS injection via `url()` with `javascript:` or `data:` protocols is still possible in some browsers. Validate the URL protocol server-side before exposing it.

```tsx
// Better: validate on the settings panel input side
const isValidUrl = (url: string) => /^https?:\/\//i.test(url);
```

---

## High Priority

### H1. userId used as auth token without verification

**Files:** `D:\Projects\wedding-planner\api\photos.ts:96-97`, `D:\Projects\wedding-planner\api\tasks.ts:43-46`

The `userId` is a client-generated UUID stored in localStorage. Any client can enumerate or guess UUIDs to access another couple's photos/tasks. The photo list endpoint (`GET /api/photos?userId=X`) and task list endpoint (`GET /api/tasks?userId=X`) expose data to anyone who knows or guesses the UUID.

**Mitigation:** UUIDv4 has 122 bits of entropy, making brute-force impractical. However, UUIDs are visible in browser dev tools, shared links, and could leak via referrer headers. Consider:
- Adding a session token (short-lived, stored in Redis) for dashboard API calls
- Or accept this as a known limitation for an MVP wedding planner

**Severity:** High for multi-user production; acceptable for v1 personal-use scope.

### H2. Migration chain gap: v13 skips v14 -> goes to v15

**File:** `D:\Projects\wedding-planner\src\lib\migrate-state.ts:68-110`

The v14->v15 migration correctly adds Phase 2 fields. However, the v13->v14 migration sets `wp_v14` but then `return`s. A subsequent call to `migrateState()` finds `wp_v15` absent, reads `wp_v14`, and runs v14->v15. This is correct.

BUT: if a user has `wp_v13` and the v13->v14 migration succeeds, it writes `wp_v14` and returns. The **next page load** triggers v14->v15. During the **first** page load after upgrading from v13, the store reads `wp_v15` (which doesn't exist yet) and falls back to `DEFAULT_STATE` -- the user loses their existing data for one session.

**Fix:** After writing v14, don't `return` -- fall through to the v14->v15 block, or re-call `migrateState()` like the v10->v11 migration does:
```ts
localStorage.setItem(V14_KEY, JSON.stringify(v14Data));
// Instead of: return;
migrateState(); // Re-run to chain v14->v15
return;
```

**Impact:** Users upgrading from v13 (current production) would see blank state on first load after deploy, then correct data on refresh. Data is not lost (it's in wp_v14) but UX is bad.

### H3. Photo wall token not persisted -- lost on page refresh

**Files:** `D:\Projects\wedding-planner\src\components\photo-wall\photo-gallery-dashboard.tsx:20`, `D:\Projects\wedding-planner\src\components\photo-wall\photo-upload-link.tsx`

The upload token is stored in React state (`useState<string>("")`). When the couple navigates away from the photo dashboard and returns, the token is gone. They must regenerate it, invalidating any previously shared QR codes/links (Redis-stored tokens have 24h TTL).

**Fix:** Persist the photo upload token in `WeddingState` (or at minimum in sessionStorage).

---

## Medium Priority

### M1. File size limit exceeded: `i18n-translations.ts` (368 lines)

**File:** `D:\Projects\wedding-planner\src\lib\i18n-translations.ts`

The project standard is max 200 lines per file. This file has 368 lines and will keep growing. Consider splitting by feature:
- `i18n-base.ts` (existing nav, budget, guests, etc.)
- `i18n-phase2.ts` (countdown, timeline, gifts, photos, tasks, website)

### M2. File size: `wedding.ts` (224 lines), `use-wedding-store.ts` (230 lines), `migrate-state.ts` (281 lines)

These are over the 200-line limit. The store was wisely split (`use-wedding-store-phase2.ts`), but the types file and migration file still exceed limits. Acceptable for now since types are declaration-only and migrations are append-only.

### M3. Masonry grid uses fixed `gridRowEnd: span 20` for all photos

**File:** `D:\Projects\wedding-planner\src\components\photo-wall\photo-masonry-grid.tsx:35`

All photos have the same row span, defeating the purpose of a masonry layout. Images of different aspect ratios will have large gaps. Consider using `onLoad` to measure image natural dimensions and compute the span dynamically, or use a CSS-only columns approach.

### M4. Countdown timer interval never cleaned on date change

**File:** `D:\Projects\wedding-planner\src\components\countdown\use-countdown.ts:54-61`

The effect depends only on `[weddingDate]`, and the interval is cleaned on unmount. However, on every `weddingDate` change, a new interval starts immediately (correct) and the old one is cleaned (correct). The initial `useState(() => computeCountdown(weddingDate))` computes once; then the interval re-computes every second. Between mount and first interval tick (~1s), the displayed value can be stale if the date changed. Minor visual glitch.

**Fix:** Add `setValues(computeCountdown(weddingDate))` at the top of the effect body before `setInterval`.

### M5. Task board -- `confirm()` not internationalized

**File:** `D:\Projects\wedding-planner\src\components\tasks\task-board-dashboard.tsx:63`

```ts
if (!confirm("Xóa công việc này?")) return;
```

Hardcoded Vietnamese. Should use `lang` parameter like timeline does.

### M6. DRY violation: `sideLabel()` function duplicated

**Files:** `gift-entry-form.tsx:15`, `gift-entry-row.tsx:14`, `gift-csv-export.tsx:24`, `gift-summary-bar.tsx:28`

The same groom/bride/other label logic is repeated 4 times. Extract to a shared utility.

### M7. Photo wall `autoApprove` setting not used

**File:** `D:\Projects\wedding-planner\src\components\photo-wall\photo-gallery-dashboard.tsx:23`

The `PhotoWallSettings.autoApprove` field exists in the type and default state but is never read. The API always sets `approved: true` (line 89 of `api/photos.ts`). Either remove the field (YAGNI) or wire it up.

### M8. Task board "group by" labels not translated

**File:** `D:\Projects\wedding-planner\src\components\tasks\task-board-dashboard.tsx:121-122`

Hardcoded "Theo trang thai" / "Theo nguoi" without i18n support.

---

## Low Priority

### L1. Unnecessary `@vercel/blob` in main bundle concern

The `@vercel/blob/client` import in `photo-upload-form.tsx` brings the Vercel Blob SDK into the client bundle. Since `PhotoUploadPage` is lazy-loaded, this is already code-split and only downloaded when visiting `#/photos/:token`. Acceptable.

### L2. `PhotoCard` hardcodes "Anh cuoi" / "Da an" labels in Vietnamese

**File:** `D:\Projects\wedding-planner\src\components\photo-wall\photo-card.tsx:42-43`

Not using i18n for "Da an" label. Minor since the dashboard is couple-facing, but inconsistent with the pattern.

### L3. Wedding website page loads all section components even when toggled off

**File:** `D:\Projects\wedding-planner\src\pages\wedding-website-page.tsx:89-123`

Toggled-off sections are not imported, but the conditional renders still exist. React already handles this efficiently (returns null). No action needed.

### L4. Timeline template `generateTimelineFromSteps` creates IDs starting at 1

**File:** `D:\Projects\wedding-planner\src\data\timeline-templates.ts:46`

When generating from template, IDs start at 1 regardless of existing `timelineIdCounter`. This is fine because `setTimelineEntries` replaces all entries, but `timelineIdCounter` is not updated. If user then adds an entry manually, the counter-based ID could collide.

**Fix:** After `store.setTimelineEntries(generated)`, also update `timelineIdCounter` to the max generated ID.

---

## Positive Observations

1. **Clean phase ownership** -- No cross-phase file conflicts. Phase 01 foundation defines contracts, Phases 02-07 work within boundaries.
2. **Zero `any` types** -- Strict TypeScript maintained across all new files.
3. **Consistent API patterns** -- All 3 API endpoints use the same CORS, rate-limiting, error-handling structure. Factory functions used correctly.
4. **Input sanitization** -- Titles/descriptions truncated server-side (`.trim().slice(0, N)`). CSV export includes formula injection prevention. Slug validated with regex both client and server-side.
5. **SQL injection prevented** -- Drizzle ORM parameterizes all queries. The `sql` tagged template in website.ts safely parameterizes the slug value.
6. **Lazy loading** -- New feature pages (TimelinePage, GiftPage, TaskBoardDashboard, WebsiteSettingsPanel, WeddingWebsitePage, PhotoUploadPage, TaskLandingPage) all lazy-loaded. Bundle impact minimal.
7. **Token-based access** -- Photo wall and task board use nanoid tokens stored in Redis/DB. Reuses proven RSVP pattern.
8. **Data exposure control** -- Website API extracts a PUBLIC subset only, explicitly excluding budget, vendors, expenses, guests, apiKey, notes.
9. **Photo upload pipeline** -- Client-side resize (1920px max) before upload reduces storage cost. Vercel Blob client token pattern limits file size/type server-side.
10. **CSS security** -- `CSS.escape()` on hero image URL, `encodeURI()` on map links (though needs protocol validation -- see C1).

---

## Recommended Actions

| # | Priority | Action | Effort |
|---|----------|--------|--------|
| 1 | Critical | Add URL protocol validation for venue map link + hero image | 15 min |
| 2 | High | Fix v13->v14 migration to chain into v14->v15 | 5 min |
| 3 | High | Persist photo upload token in state or sessionStorage | 20 min |
| 4 | Medium | Split i18n-translations.ts by feature area | 30 min |
| 5 | Medium | Fix masonry grid static row spans | 30 min |
| 6 | Medium | Extract `sideLabel()` into shared utility | 10 min |
| 7 | Medium | Internationalize remaining hardcoded Vietnamese strings | 20 min |
| 8 | Low | Fix timeline ID counter after template generation | 5 min |

---

## Metrics

| Metric | Value |
|--------|-------|
| Type Coverage | 100% (zero `any`) |
| Test Coverage | 0% (no test framework) |
| Lint Issues (new) | 0 |
| Files over 200 lines | 4 (i18n-translations 368, migrate-state 281, use-wedding-store 230, wedding.ts 224) |
| Security issues | 1 critical (XSS), 1 high (auth model) |
| New dependencies | 1 (`@vercel/blob`) |

---

## Unresolved Questions

1. **Photo token TTL vs QR code longevity** -- Tokens expire in 24h. QR codes printed/shared physically may be scanned days later. Should TTL be longer (7d?) or should token refresh be automatic?
2. **Task board: one token per assignee name** -- If two tasks have the same assignee name, they share a token. If assignee names differ slightly ("Lan" vs "Nguyen Lan"), they get separate tokens. Is this the intended behavior?
3. **Website slug uniqueness** -- No server-side check for slug collisions. Two couples could set the same slug; the API returns the first match. Consider a uniqueness check endpoint.
