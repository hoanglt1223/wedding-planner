# Code Review: Numerology Feature

**Date:** 2026-03-02
**Reviewer:** code-reviewer
**Score:** 8/10

## Scope

- **Files reviewed:** 16 (13 new, 3 modified)
- **LOC:** 1,666 total
- **Focus:** Full feature review (lib, data, UI, API)
- **Build:** PASSES (tsc + vite)
- **Lint:** 0 new errors (19 pre-existing)

## Overall Assessment

Solid, well-structured feature implementation. Clean separation between calculation engine, data, and UI. Follows existing patterns (astrology page, theme variables, API conventions). Good use of `useMemo` for expensive calculations. All files under 200-line limit except `api/ai.ts` (206 lines, minor overshoot). Vietnamese content reads naturally with proper diacritics.

---

## Critical Issues

### 1. [SECURITY] No input length validation on fullName in API (api/ai.ts:156)

The `handleNumerology` handler validates `birthDate` format but applies no length/character constraints on `fullName`. A malicious actor could send a multi-megabyte string, inflating the AI prompt and Redis cache key.

**Impact:** Potential prompt injection, memory exhaustion, excessive AI token consumption.

**File:** `D:\Projects\wedding-planner\api\ai.ts`, line 156

```typescript
// Current
if (!body?.birthDate || !body.fullName) return res.status(400).json({ error: "missing_fields" });

// Recommended: add after existing validation
if (typeof body.fullName !== 'string' || body.fullName.length > 100) {
  return res.status(400).json({ error: "invalid_name" });
}
if (typeof body.lifePath !== 'number' || body.lifePath < 0 || body.lifePath > 33) {
  return res.status(400).json({ error: "invalid_life_path" });
}
```

### 2. [SECURITY] fullName injected directly into AI prompt (numerology-prompt.ts:16)

User-supplied `fullName` is interpolated into the AI prompt without sanitization. Combined with the missing length check above, this is a prompt injection vector.

**Impact:** Attacker could manipulate AI output via crafted name strings.

**File:** `D:\Projects\wedding-planner\src\lib\numerology-prompt.ts`, line 16

```typescript
// Current
const user = `Phan tich than so hoc ca nhan:\n- Ho ten: ${input.fullName}\n...`;

// Recommended: sanitize before interpolation
const safeName = input.fullName.replace(/[^\p{L}\p{N}\s]/gu, '').slice(0, 100);
```

---

## High Priority

### 3. [DRY] ToggleBtn duplicated in 3 files

Identical `ToggleBtn` component copied across `tab-personal-profile.tsx`, `tab-yearly-forecast.tsx`, and `tab-lucky-attributes.tsx`.

**Files:**
- `D:\Projects\wedding-planner\src\components\numerology\tab-personal-profile.tsx`, line 97
- `D:\Projects\wedding-planner\src\components\numerology\tab-yearly-forecast.tsx`, line 76
- `D:\Projects\wedding-planner\src\components\numerology\tab-lucky-attributes.tsx`, line 84

**Recommendation:** Extract to a shared file, e.g. `src/components/numerology/toggle-btn.tsx`.

### 4. [DRY] Card helper duplicated in 2 files

Two different `Card` helper components (one with `children`, one with `emoji+title+text`) exist in `tab-personal-profile.tsx` and `tab-yearly-forecast.tsx`. Both could be unified or extracted.

**Files:**
- `D:\Projects\wedding-planner\src\components\numerology\tab-personal-profile.tsx`, line 105
- `D:\Projects\wedding-planner\src\components\numerology\tab-yearly-forecast.tsx`, line 84

### 5. [EDGE CASE] simpleHash collision risk in cache key (api/ai.ts:160-163)

The `simpleHash` function uses a 32-bit integer hash (`djb2`-style). Collision probability is non-trivial for a name-based cache key. Two different names could produce the same hash and return cached results for the wrong person.

**Impact:** Incorrect AI reading served from cache (low probability but real).

**File:** `D:\Projects\wedding-planner\api\ai.ts`, lines 160-163

**Recommendation:** Use a more robust hash or include a longer digest. Even appending the name length reduces collisions:
```typescript
const cacheKey = `num:reading:${body.birthDate}:${simpleHash(body.fullName)}_${body.fullName.length}:${year}`;
```

### 6. [UNUSED PROP] onUpdateInfo accepted but never used (numerology-page.tsx:13,23)

`NumerologyPageProps` declares `onUpdateInfo` and `NumerologyPage` receives it in props, but it is never referenced in the component body. The build passes because TypeScript destructuring `{ info }` ignores it, but calling code in `page-router.tsx` still passes `onUpdateInfo={store.updateInfo}`.

**File:** `D:\Projects\wedding-planner\src\pages\numerology-page.tsx`, lines 11-13, 23

**Recommendation:** Remove `onUpdateInfo` from the interface and the JSX in `page-router.tsx`.

---

## Medium Priority

### 7. [EDGE CASE] Y classified as vowel for all positions (numerology.ts:12)

In Pythagorean numerology, Y is traditionally treated as a vowel when it produces a vowel sound (e.g., "Mary") and as a consonant when it doesn't (e.g., "Yogi"). The implementation always treats Y as a vowel.

**File:** `D:\Projects\wedding-planner\src\lib\numerology.ts`, line 12

**Impact:** Soul Urge and Personality numbers may differ from some reference implementations. For Vietnamese names this is less impactful since Y appears primarily in vowel positions (Yen, Huy), but it is technically a known simplification.

**Recommendation:** Acceptable simplification for this context. Document the decision with a comment.

### 8. [EDGE CASE] Empty name produces lifePath=0 but profiles start at 1 (numerology-profiles.ts:154-159)

When no name is provided, `calcExpression("")` returns 0, `calcSoulUrge("")` returns 0. The `getNumerologyProfile(0)` lookup has a fallback chain: direct match fails, then `num % 9 || 9` produces `9`, then falls back to `NUMEROLOGY_PROFILES[0]` (number 1). This means profile 9 is returned for number 0.

**File:** `D:\Projects\wedding-planner\src\data\numerology-profiles.ts`, lines 154-159

**Impact:** Minor UX inconsistency. A user with no name entered sees Life Path profile data based on birth date, but Expression/Soul Urge show `0` in the grid while the overall profile card shows lifePath-based content. Not broken but slightly confusing.

### 9. [PERFORMANCE] Wedding date calendar recalculates all 28-31 days on each month (tab-wedding-dates.tsx:32-40)

`useMemo` dependency array includes `daysInMonth` which is derived from `year` and `month`, causing potential double-compute. Minor; the computation is lightweight (31 iterations max).

**File:** `D:\Projects\wedding-planner\src\components\numerology\tab-wedding-dates.tsx`, lines 32-40

### 10. [STYLE] api/ai.ts at 206 lines, exceeds 200-line guideline

**File:** `D:\Projects\wedding-planner\api\ai.ts`

**Recommendation:** Extract `handleNumerology` into a separate helper or split the handler file. The file handles 3 action types (chat, astrology, numerology) and is growing.

### 11. [EDGE CASE] Cache TTL of 300 days for AI readings may serve stale content (api/ai.ts:183)

The `redis.set(cacheKey, text, { ex: 86400 * 300 })` sets a ~10-month TTL. The cache key includes the current year, so it won't persist across years, but within a year the same person always gets the same reading even if the AI model improves.

**File:** `D:\Projects\wedding-planner\api\ai.ts`, line 183

**Impact:** Low -- consistent with astrology handler (line 135). Acceptable tradeoff.

---

## Low Priority

### 12. [STYLE] prevMonth/nextMonth arrow functions on one line (tab-wedding-dates.tsx:45-46)

Dense one-liners for month navigation. Readable but slightly compressed.

### 13. [ACCESSIBILITY] Tab navigation buttons lack aria attributes

Tab buttons in `numerology-page.tsx` use regular `<button>` without `role="tab"`, `aria-selected`, or `tablist` wrapper.

**File:** `D:\Projects\wedding-planner\src\pages\numerology-page.tsx`, lines 97-111

---

## Positive Observations

1. **Clean architecture**: calc engine (lib/) -> data (data/) -> UI (components/) separation is textbook
2. **Consistent patterns**: Follows existing astrology feature structure exactly
3. **Master number handling**: 11/22/33 properly preserved throughout the pipeline
4. **useMemo usage**: Applied correctly on all expensive computations with correct dependency arrays
5. **Theme compliance**: All components use `var(--theme-*)` CSS variables consistently
6. **Error handling in AI card**: Graceful handling of 429, 503, and network errors with retry
7. **Rate limiting**: Separate `num_rl` prefix avoids interfering with astrology quotas
8. **PII awareness**: Cache key hashes the fullName instead of storing it plainly in Redis
9. **Vietnamese content**: Proper diacritics throughout, natural phrasing, accurate numerology terminology
10. **File sizes**: All under 200 lines (except api/ai.ts at 206, minor)

---

## Recommended Actions (Prioritized)

1. **Add input validation** for `fullName` length and `lifePath` range in `api/ai.ts` handleNumerology
2. **Sanitize fullName** before injecting into AI prompt in `numerology-prompt.ts`
3. **Extract `ToggleBtn`** to shared component to eliminate 3x duplication
4. **Remove unused `onUpdateInfo`** from NumerologyPage props
5. **Add name length to cache key** to reduce hash collision risk
6. **Add comment** documenting Y-as-vowel simplification in `numerology.ts`
7. Consider splitting `api/ai.ts` as it grows (optional, 6 lines over)

---

## Metrics

| Metric | Value |
|--------|-------|
| Type Coverage | 100% (strict mode, all types explicit) |
| Test Coverage | N/A (no test framework configured) |
| Lint Issues (new) | 0 |
| Files under 200 LOC | 15/16 (api/ai.ts at 206) |
| DRY violations | 2 (ToggleBtn x3, Card x2) |

---

## Unresolved Questions

1. Should the `Y` vowel classification be revisited for accuracy, or is the simplification acceptable given the Vietnamese name context?
2. Should `api/ai.ts` be split now or deferred until another action is added?
