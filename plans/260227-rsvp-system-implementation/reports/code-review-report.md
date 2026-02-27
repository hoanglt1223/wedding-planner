# Code Review Report -- RSVP System

**Reviewer:** code-reviewer
**Date:** 2026-02-27
**Scope:** Full RSVP feature (DB, API, guest page, dashboard)
**Files:** 25 new/modified | ~1380 LOC (RSVP-specific)
**Build:** TypeScript compiles clean, ESLint passes

---

## Overall Assessment

Solid feature implementation. Clean component decomposition, consistent patterns with existing codebase, proper atomic one-time response guard, and good bilingual support. The code follows project conventions (kebab-case files, factory DB pattern, i18n via `t()`, theme variables). Most files are well under 200 lines. The architecture is sound -- token-based auth for guests is appropriate for this use case.

Several security and correctness issues found, one critical.

---

## Critical Issues

### 1. CORS on `/api/rsvp/list.ts` is `Access-Control-Allow-Origin: *` with no auth

**File:** `D:\Projects\wedding-planner\api\rsvp\list.ts` (line 7)

The list endpoint exposes ALL RSVP invitations (names, tokens, dietary info, messages) for any userId. Since userId is a UUID stored in localStorage, it has some obscurity, but:
- The endpoint has no rate limiting (unlike the other RSVP endpoints)
- With `*` CORS, any website can call this endpoint
- The userId is included in sync payloads which go to `user_sessions.id`

Anyone who obtains a userId (e.g., from browser dev tools, shared screens, or a leaked DB entry) can enumerate all guest data including tokens (which grant RSVP modification ability).

**Recommendation:** Add rate limiting to the list endpoint (consistent with other endpoints). Consider using the `getCorsOrigin()` pattern from `sync.ts` for the list endpoint since it's planner-only. The GET `rsvp.ts` and `respond.ts` must stay `*` since guests access them from the RSVP landing page.

```typescript
// api/rsvp/list.ts -- add rate limiting
try {
  const redis = createRedis();
  const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rsvp_list_rl" });
  const { success } = await rl.limit(userId);
  if (!success) return res.status(429).json({ error: "rate_limited" });
} catch { /* Redis unavailable -- skip */ }
```

Also consider using `getCorsOrigin()` instead of `"*"` on this endpoint.

### 2. `venueMapLink` rendered as unsanitized `href` -- javascript: protocol XSS

**File:** `D:\Projects\wedding-planner\src\components\rsvp\rsvp-event-details.tsx` (line 22)

The `venueMapLink` comes from the planner's stored settings (via DB -> API -> guest page). If a planner enters `javascript:alert(1)` as the map link, it would execute in the guest's browser when clicked.

While the planner is the one entering this data (self-XSS vector is lower risk), the data flows through the DB and is rendered on a different user's browser (the guest). This is a stored XSS vector.

**Recommendation:** Validate that the URL starts with `http://` or `https://`:

```tsx
{venueMapLink && /^https?:\/\//i.test(venueMapLink) && (
  <a href={venueMapLink} target="_blank" rel="noopener noreferrer" ...>
```

---

## High Priority

### 3. Missing DB index on `rsvp_invitations.user_id`

**File:** `D:\Projects\wedding-planner\drizzle\0003_perfect_leader.sql`
**File:** `D:\Projects\wedding-planner\src\db\schema.ts` (line 49)

The `token` column has a UNIQUE constraint (which creates an index), but `user_id` has no index. The list endpoint queries `WHERE user_id = ?` with `ORDER BY created_at DESC`. Without an index, this becomes a sequential scan as the table grows.

**Recommendation:** Add an index on `user_id`:

```sql
CREATE INDEX idx_rsvp_invitations_user_id ON rsvp_invitations(user_id);
```

In Drizzle schema:
```typescript
import { index } from "drizzle-orm/pg-core";
// Add index definition to the table or as a separate export
```

### 4. Token extraction from hash is not URL-decoded and accepts arbitrary content

**File:** `D:\Projects\wedding-planner\src\main.tsx` (line 29)

```typescript
const rsvpToken = hash.replace('#/rsvp/', '');
```

This does a simple string replace. If the hash contains additional path segments (e.g., `#/rsvp/abc123/extra`), the token becomes `abc123/extra`. The API does validate token length (`token.length > 20`), which provides some protection, but it would be cleaner to extract just the token segment.

**Recommendation:**
```typescript
const rsvpToken = decodeURIComponent(hash.replace('#/rsvp/', '').split('/')[0]);
```

### 5. Guest name matching by array index is fragile

**File:** `D:\Projects\wedding-planner\src\components\guests\rsvp-generate-links.tsx` (lines 34-38)

```typescript
tokens.forEach((t, i) => {
  const guest = guestsWithoutToken[i];
  if (guest) onUpdateGuestRsvpToken(guest.id, t.token);
});
```

This assumes the API returns tokens in the same order as the input guests array. The API does `body.guests.map(...)` which preserves order, but this is an implicit contract. If the API ever changes to batch insert differently (or a future refactor adds sorting), token-to-guest mapping silently breaks.

**Recommendation:** Match by `guestName` instead of index:
```typescript
tokens.forEach((tok) => {
  const guest = guestsWithoutToken.find((g) => g.name === tok.guestName);
  if (guest) onUpdateGuestRsvpToken(guest.id, tok.token);
});
```

Note: this still has a potential issue with duplicate guest names. If two guests share a name, both would get the first matching token. Could consider returning a `guestIndex` from the API or matching by position with a comment documenting the contract.

### 6. `guest-panel.tsx` exceeds 200-line limit

**File:** `D:\Projects\wedding-planner\src\components\guests\guest-panel.tsx` -- 227 lines

Project standard mandates max 200 lines per file. The RSVP tab addition pushed it over. Consider extracting the add-guest form or the import/export buttons into a separate component.

---

## Medium Priority

### 7. CSV export vulnerable to formula injection

**File:** `D:\Projects\wedding-planner\src\components\guests\rsvp-export-actions.tsx` (lines 32-39)

Guest names, dietary info, and messages are user-supplied and inserted into CSV with only quote escaping. If a guest submits a message like `=CMD("calc")`, Excel will interpret it as a formula.

**Recommendation:** Prefix cell values that start with `=`, `+`, `-`, `@`, `\t`, `\r` with a single quote:

```typescript
function sanitizeCsvCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`;
  return value;
}
```

### 8. CORS pattern inconsistency

**Files:** `api/rsvp.ts`, `api/rsvp/respond.ts`, `api/rsvp/list.ts`

The `CORS_HEADERS` object and `setCors` function are duplicated across all three RSVP API files. Other endpoints in the codebase (`sync.ts`, `track.ts`) use `getCorsOrigin()` for private endpoints.

- `rsvp.ts` GET (public guest access) and `respond.ts` (public guest access) -- `*` is correct
- `rsvp.ts` POST (planner creates tokens) -- should arguably use `getCorsOrigin()`
- `rsvp/list.ts` (planner dashboard) -- should use `getCorsOrigin()`

**Recommendation:** Extract CORS helpers to a shared module. Apply `getCorsOrigin()` to planner-only routes. At minimum, deduplicate the helper.

### 9. No error feedback in `submitRsvpResponse` on non-JSON errors

**File:** `D:\Projects\wedding-planner\src\lib\rsvp-api.ts` (lines 57-70)

```typescript
export async function submitRsvpResponse(...): Promise<...> {
  const res = await fetch("/api/rsvp/respond", { ... });
  return res.json() as Promise<{ ok: boolean; respondedAt?: string; error?: string }>;
}
```

If the server returns a 500 with non-JSON body (e.g., Vercel cold start timeout), `res.json()` will throw an unhandled error. The caller in `rsvp-landing-page.tsx` has no try/catch on the `handleSubmit` that would show the user an error state.

**Recommendation:** Wrap in try/catch:
```typescript
export async function submitRsvpResponse(...) {
  try {
    const res = await fetch("/api/rsvp/respond", { ... });
    if (!res.ok) return { ok: false, error: "server_error" };
    return res.json() as Promise<{ ok: boolean; respondedAt?: string; error?: string }>;
  } catch {
    return { ok: false, error: "network_error" };
  }
}
```

### 10. `RsvpForm` has no user-facing error state on failed submit

**File:** `D:\Projects\wedding-planner\src\components\rsvp\rsvp-form.tsx` (lines 17-25)

The `onSubmit` callback in `rsvp-landing-page.tsx` checks `result.ok` and `result.error === "already_responded"`, but there is no handling for other errors (network failure, 500, rate limit). The guest sees the form return to its non-submitting state with no feedback.

**Recommendation:** Surface an error message in the form component when the promise rejects or returns a non-ok result. The `RsvpForm` could accept an `error` prop or the `handleSubmit` in the landing page could throw to trigger a local error state.

### 11. `rsvp-qr-modal.tsx` computes `rsvpLink` on every render

**File:** `D:\Projects\wedding-planner\src\components\guests\rsvp-qr-modal.tsx` (line 15)

```typescript
const rsvpLink = `${window.location.origin}/#/rsvp/${token}`;
```

This runs on every render, not just when `open` or `token` changes. Minor performance concern given this is a modal, but `useMemo` would be more correct.

---

## Low Priority

### 12. `Đang tải...` i18n key may not exist

**File:** `D:\Projects\wedding-planner\src\pages\rsvp-landing-page.tsx` (line 53)

The loading state uses `t("Dang tai...", lang)`. Checking the i18n file, the actual key is `"Dang giai..."` -- needs verification that this exact key exists. If missing, `t()` likely falls back to the key itself, which is acceptable but not ideal.

**Edit:** Actual key in file is `"Dang gui..."` at line 259. The `"Dang tai..."` key should be verified.

### 13. Plus-ones max is 10 on client but 20 on server

**File:** `D:\Projects\wedding-planner\src\components\rsvp\rsvp-form.tsx` (line 76) -- max 10
**File:** `D:\Projects\wedding-planner\api\rsvp\respond.ts` (line 40) -- max 20

The client UI limits plus-ones to 10 with `Math.min(10, plusOnes + 1)`, but the server accepts up to 20 with `Math.min(..., 20)`. These should match. A direct API caller could submit up to 20.

**Recommendation:** Align both to the same constant (10 seems reasonable for a wedding).

### 14. Hardcoded colors in RSVP guest components

**Files:** All `src/components/rsvp/*.tsx` files

The guest page uses hardcoded hex colors (`#2c1810`, `#8a7060`, `#5a4a3a`, `#f5f0eb`, `#e8ddd0`) rather than theme CSS variables. While the `primaryLight` from the theme is passed in for the hero gradient, the rest of the page has a fixed warm-neutral palette.

This is a deliberate design choice for the guest-facing page (consistent brand regardless of planner's theme), but it means the theme selection only partially affects the guest experience.

### 15. `RsvpThankYou` link to `/` may not work with hash routing

**File:** `D:\Projects\wedding-planner\src\components\rsvp\rsvp-thank-you.tsx` (line 54)

```tsx
<a href="/">{...}</a>
```

Since the app uses hash-based routing, navigating to `/` works (it shows the landing page since no hash is set). This is fine.

---

## Edge Cases Found by Scout

1. **Duplicate guest names:** If a planner has two guests named "Nguyen Van A", generating RSVP links creates two separate tokens. The name-based matching in `rsvp-generate-links.tsx` would assign tokens correctly by index, but if matched by name (per recommendation #5), the second guest would be skipped.

2. **Empty guest list + RSVP tab visible:** When `guests.length === 0`, the RSVP tab is still accessible (line 152 of `guest-panel.tsx`: `guests.length > 0 || view === "rsvp"`). The dashboard shows "No RSVP links generated" message, which is appropriate.

3. **userId undefined in RSVP dashboard:** If `useUserId()` fails (e.g., localStorage is full), `userId` propagates as `undefined`. The `GuestPanel` checks `userId && rsvpSettings && ...` before rendering `RsvpDashboard`, so this is handled.

4. **Race condition on double-click submit:** The `RsvpForm` sets `submitting = true` which disables the button, but the atomic DB guard (`respondedAt IS NULL`) in the API provides the real protection. Even if two requests race, only one succeeds. The second gets a 409 which surfaces as "already responded". Good defense-in-depth.

5. **Token stored in localStorage via `updateGuestRsvpToken`:** Tokens are stored in the `guests[]` array in `WeddingState`, which is persisted to localStorage and synced to the server via the sync endpoint. This means tokens are also stored in `user_sessions.wedding_data` JSONB. Acceptable since the planner owns this data, but worth noting for data lifecycle awareness.

6. **Browser back after RSVP submit:** Guest submits, sees thank-you page. If they modify the hash manually or navigate back, the page re-fetches the invitation and shows "already-responded" state. Correct behavior.

---

## Positive Observations

- **Atomic one-time response guard** (`respondedAt IS NULL` in WHERE clause) is the correct pattern. No TOCTOU vulnerability.
- **Input sanitization** on the API side is thorough: `guestName` trimmed and sliced to 200 chars, `dietary`/`message` sliced to 500, `plusOnes` clamped and rounded.
- **Component decomposition** is clean -- each RSVP component has a single responsibility and clear props interface.
- **Bilingual support** is complete with ~35 new i18n keys covering all user-facing strings.
- **Rate limiting** on create and respond endpoints.
- **CSV export** includes BOM for Excel UTF-8 compatibility with Vietnamese characters.
- **QR code generation** is lazy (only when modal opens), avoiding unnecessary computation.
- **State migration** from v13->v14 correctly uses null-coalescing for backward compatibility.
- **No `dangerouslySetInnerHTML`** anywhere in the RSVP code -- all content rendered as text nodes.

---

## Recommended Actions (Priority Order)

1. **[Critical]** Validate `venueMapLink` protocol before rendering as `href` in `rsvp-event-details.tsx`
2. **[Critical]** Add rate limiting to `api/rsvp/list.ts`; consider `getCorsOrigin()` for planner-only endpoints
3. **[High]** Add DB index on `rsvp_invitations.user_id`
4. **[High]** Sanitize token extraction in `main.tsx` (split on `/`, take first segment)
5. **[High]** Reduce `guest-panel.tsx` below 200 lines
6. **[Medium]** Add CSV formula injection protection in export
7. **[Medium]** Add error handling in `submitRsvpResponse` and surface error state in `RsvpForm`
8. **[Medium]** Align plus-ones max between client (10) and server (20)
9. **[Low]** Deduplicate CORS helpers across RSVP API files
10. **[Low]** Verify `"Dang tai..."` i18n key exists

---

## Metrics

- **TypeScript:** Compiles clean (0 errors)
- **ESLint:** 0 issues on RSVP files
- **File sizes:** All under 200 lines except `guest-panel.tsx` (227)
- **Test coverage:** No test framework configured (per project CLAUDE.md)
- **i18n coverage:** ~35 keys, all have vi/en translations

---

## Unresolved Questions

1. Should the planner be able to regenerate/revoke a token for a specific guest? Currently tokens are permanent once created. No revocation mechanism exists.
2. Should there be a maximum total invitation count per userId (beyond the per-request 500 limit)? A user could call the bulk create endpoint repeatedly.
3. Is there a plan to add a `user_id` foreign key constraint referencing `user_sessions.id`? Currently the relationship is implicit.
