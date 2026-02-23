# Code Review Report: Vietnamese Wedding Content Expansion

**Reviewer:** code-reviewer agent
**Date:** 2026-02-23
**Branch:** master
**Build:** PASS (tsc + vite)
**Lint:** 0 new errors (14 pre-existing, none from expansion code)

---

## Scope

- **Files reviewed:** 39 (foundation + UI + data + calendar + integration)
- **New files:** 25 (4 calendar, 2 wedding, 6 auspicious, 9 traditional-items, 5 family-roles, region-selector)
- **Modified files:** 9 (wedding.ts, use-wedding-store.ts, migrate-state.ts, resolve-data.ts, step-panel.tsx, ceremony-section.tsx, panel-router.tsx, header.tsx, i18n-translations.ts)
- **Total LOC (new + modified):** ~3,900
- **Focus:** Full review of all 4 features + foundation layer

---

## Overall Assessment

**GOOD.** The implementation is well-structured, follows established patterns, and the DRY `RegionalContent<T>` generic pattern is clean. TypeScript compiles without errors, the build succeeds, and bilingual support is thorough. Architecture decisions are sound: region stored in Zustand, migration chain is correct, data files are well-separated by language and phase.

**Rating: 7.5/10** -- solid implementation with a few medium-priority items to address.

---

## Critical Issues

**None found.** No security vulnerabilities (XSS, injection, auth). No breaking changes. No data loss risks.

---

## High Priority

### H1. File size violations (200-line limit)

The following files exceed the 200-line limit per `code-standards.md`:

| File | Lines | Over by |
|------|-------|---------|
| `src/hooks/use-wedding-store.ts` | 226 | +26 |
| `src/lib/migrate-state.ts` | 235 | +35 |
| `src/lib/i18n-translations.ts` | 249 | +49 |
| `src/components/layout/header.tsx` | 208 | +8 |
| `src/data/traditional-items/items-betrothal.ts` | 166 | OK but nearing limit |
| `src/data/traditional-items/items-betrothal.en.ts` | 166 | OK but nearing limit |

**Recommendation:**
- `use-wedding-store.ts`: Extract the `getProgress` function into a separate utility. Consider grouping setters (region, itemsChecked, partyTime) into a separate hook or composing hooks.
- `migrate-state.ts`: Extract v7-v10 legacy migrations into a `legacy-migrations.ts` file. Only keep v11+ in main file.
- `i18n-translations.ts`: Split into category-based files (e.g., `i18n-nav.ts`, `i18n-budget.ts`, `i18n-content-expansion.ts`) and merge in the main export.
- `header.tsx`: Extract `ShareButton` into its own file.

### H2. Ngu Hanh compatibility descriptions are hardcoded Vietnamese only

In `src/data/auspicious/ngu-hanh.ts`, the `getCompatibility()` function returns Vietnamese descriptions regardless of language:

```typescript
// Lines 56-88 in ngu-hanh.ts
description: "Cung hang -- hoa hop tu nhien",  // Always Vietnamese
description: "Tuong Sinh -- bo tro lan nhau",
description: "Tuong Khac -- can can nhac",
description: "Trung tinh",
```

When `lang === "en"`, users see Vietnamese text inside the compatibility panel. The `CoupleCompatibility` component renders `compat.description` directly without translation.

**Fix:** Either pass `lang` to `getCompatibility()` and return localized descriptions, or add these strings to `i18n-translations.ts` and wrap with `t()`.

### H3. Auspicious reasons array is Vietnamese-only

In `src/data/auspicious/index.ts`, the `getDateInfo()` function pushes Vietnamese reasons:

```typescript
reasons.push("Ngay Tam Nuong -- kieng cuoi hoi");
reasons.push("Ngay Nguyet Ky -- khong nen khoi su");
reasons.push(`Ngay Hoang Dao (${getCelestialName(...)})`);
reasons.push("Ngay Hac Dao");
```

These appear in `DateDetailModal` without translation. English users see Vietnamese reason text.

**Fix:** Accept a `lang` parameter in `getDateInfo()` and use `t()` or conditional strings. Thread `lang` through `getMonthData()` -> `getDateInfo()`.

---

## Medium Priority

### M1. Default region inconsistency

`StepPanel` defaults `region` to `"north"` (line 74), while `DEFAULT_STATE` in `backgrounds.ts` defaults to `"south"` and the store migration also defaults to `"south"`. This mismatch means if props are ever undefined, northern items would show unexpectedly.

```typescript
// step-panel.tsx line 74
region = "north",  // Should be "south" to match DEFAULT_STATE
```

**Fix:** Change the default to `"south"` in `StepPanel` to match `DEFAULT_STATE`.

### M2. CeremonySection defaults region to "north" too

```typescript
// ceremony-section.tsx line 31
region = "north",  // Should be "south"
```

Same issue as M1.

### M3. Missing `aria-label` on CollapsibleDetail toggle

`CollapsibleDetail` button lacks `aria-label` or `aria-expanded`. Screen readers cannot communicate the toggle state.

```typescript
// collapsible-detail.tsx line 17
<button onClick={() => setOpen(!open)} ...>
```

**Fix:** Add `aria-expanded={open}` and `aria-label={title}` to the button element.

### M4. DateDetailModal lacks keyboard trap / Escape close

The modal uses `onClick={onClose}` on the backdrop but doesn't handle `Escape` keypress. Users navigating via keyboard cannot close the modal.

**Fix:** Add `onKeyDown` handler for Escape:
```typescript
useEffect(() => {
  if (!dateInfo) return;
  const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, [dateInfo, onClose]);
```

### M5. Lunar calendar date-detail modal: leap month label mixed languages

In `date-detail-modal.tsx` line 32-33:
```typescript
const lunarLabel = lunar.leap
  ? `${lunar.day}/${lunar.month}* (nhuan) AL ${lunar.year}`   // Vietnamese "nhuan"
  : `${lunar.day}/${lunar.month} AL ${lunar.year}`;            // Vietnamese "AL"
```

Both labels are Vietnamese regardless of `lang`. English users see "AL" (Am Lich) instead of "Lunar" or similar.

**Fix:** Conditionally format based on `lang`:
```typescript
const lunarSuffix = lang === "en" ? "Lunar" : "AL";
const leapNote = lang === "en" ? "(leap)" : "(nhuan)";
```

### M6. EtiquetteRule regional notes -- empty string shows blue box

In `etiquette.ts`, rules without regional notes use `default: ""`. The `EtiquetteCard` component checks `if (regionalNote)` -- empty string is falsy so this technically works. However, if someone changes default to a whitespace string it would render an empty blue note box.

**Fix:** Use `regionalNote && regionalNote.trim()` for defensive rendering, or better yet, omit `regionalNotes` entirely when no regional notes apply instead of using `default: ""`.

### M7. Bundle size warning (745 KB)

The build outputs a 745 KB chunk (exceeds Vite's 500 KB threshold). The new content data (items, roles, auspicious) adds to this. Consider:
- Lazy-loading the calendar module via `React.lazy()` since it's a secondary tab
- Code-splitting traditional items data per phase via dynamic imports

---

## Low Priority

### L1. Inconsistent collapsed/expanded arrow characters

- `CollapsibleDetail` uses `\u25BC` (solid triangle)
- `ItemRow` uses `\u25B2` / `\u25BC`
- Both work fine but using a shared component or constant would be more consistent.

### L2. `getCheckKey` in items-checklist could be a shared utility

The key format `${phaseId}_${itemId}` in `items-checklist.tsx` is isolated. If future features need the same key format, duplicating the logic creates a DRY violation risk. Low priority since only one consumer exists.

### L3. Celestial names array in hoang-dao.ts is Vietnamese-only

`CELESTIAL_NAMES` are used in `getDateInfo()` reasons. Same as H3 -- low priority since it's part of the reasons string already flagged.

---

## Edge Cases Found by Scout

### E1. Lunar conversion for extreme dates
The `@dqcai/vn-lunar` library may fail for dates far in the past or future. The `AuspiciousCalendar` wraps `getMonthData()` in try-catch (line 64-68) -- good defensive coding. However, there's no upper/lower year bound in the month navigation (`prevMonth`/`nextMonth`). A user clicking prev month repeatedly could navigate to year 1900 and potentially crash the lunar library.

**Recommendation:** Add year bounds (e.g., 2020-2040) to navigation.

### E2. Birth year edge case in compatibility
`CoupleCompatibility` returns `null` when either birth year is null (correct). But `getElement()` uses `(birthYear + 6) % 10` which produces correct results for any positive year. No issues found.

### E3. Migration chain completeness
v12->v13 migration adds `region` and `itemsChecked` with defaults. The migration is non-destructive and correctly uses nullish coalescing (`??`). v13 key is used in the store. No risk of data loss.

### E4. State.itemsChecked never cleaned up
When user switches regions, checked items persist even if the item is no longer required/shown for the new region. This is likely intentional (preserve user progress across region switches), but worth noting as a product decision.

### E5. parseSavedDates in calendar assumes date format
`parseSavedDates` splits on `-` and assumes `YYYY-MM-DD` format. If `info.date` is empty string, the parts check `parts.length === 3` catches it. If date is somehow `null`, the outer `if (d)` guard handles it. Defensive coding is adequate.

---

## Positive Observations

1. **DRY `RegionalContent<T>` pattern** -- elegant generic that avoids regional data duplication. The `resolveRegional()` function is clean and handles fallback correctly via nullish coalescing.

2. **Consistent VI/EN data file pairs** -- every data file has a matching `.en.ts` counterpart with identical IDs and structure. This makes i18n maintenance straightforward.

3. **Proper separation of concerns** -- auspicious logic is in `src/data/auspicious/`, UI in `src/components/calendar/`, types in dedicated files. No logic in components.

4. **Backward-compatible type extensions** -- `Ceremony` type extended with optional fields (`significance?`, `tips?`, etc.) that won't break existing data.

5. **Migration chain is robust** -- v12->v13 migration handles corrupt JSON via try-catch, uses nullish coalescing for defaults, and the recursive migration pattern works correctly.

6. **Calendar UX** -- saved dates (wedding/betrothal/engagement) highlighted with stars, lunar dates shown inline, auspicious level indicated with color coding. Good information density.

7. **Zero new lint errors** -- all 14 lint errors are pre-existing. The expansion code is clean.

8. **TypeScript strict mode passes** -- no type errors across all new files.

9. **File sizes mostly compliant** -- most new files are well under 200 lines with single responsibilities.

---

## Recommended Actions (Prioritized)

1. **[H2+H3] Localize auspicious reasons + Ngu Hanh descriptions** -- English users see Vietnamese text in calendar detail modal and compatibility panel. Add `lang` parameter to `getDateInfo()`, `getMonthData()`, and `getCompatibility()`.

2. **[H1] Split oversized files** -- Extract legacy migrations, ShareButton component, and split i18n translations to stay within 200-line limit.

3. **[M1+M2] Fix default region** -- Change `region = "north"` to `region = "south"` in `step-panel.tsx` and `ceremony-section.tsx` to match `DEFAULT_STATE`.

4. **[M4] Add Escape handler to DateDetailModal** -- Accessibility improvement.

5. **[M3] Add aria-expanded to CollapsibleDetail** -- Accessibility improvement.

6. **[M5] Localize lunar label in date-detail-modal** -- "AL" should be "Lunar" in English.

7. **[M7] Consider code-splitting** -- Lazy-load calendar tab to reduce initial bundle size.

---

## Metrics

| Metric | Value |
|--------|-------|
| TypeScript compilation | PASS (0 errors) |
| Build | PASS (2.21s) |
| New lint errors | 0 |
| Pre-existing lint errors | 14 |
| Files over 200 lines | 4 (use-wedding-store: 226, migrate-state: 235, i18n-translations: 249, header: 208) |
| New i18n keys | ~40 keys |
| Bilingual data file pairs | 6 pairs (engagement, betrothal, wedding, procession items + roles + etiquette) |
| Calendar logic files | 6 files, all under 90 lines |
| Bundle size | 745 KB (over Vite's 500 KB threshold) |

---

## Unresolved Questions

1. **Intentional: itemsChecked persistence across region switch** -- Is it desired that a user checking items for "south" keeps those checks when switching to "north"? The items displayed change per region, but the checked state uses item IDs that are the same across regions.

2. **Year bounds for calendar navigation** -- Should we restrict calendar browsing to a reasonable range (e.g., 2024-2030) to prevent potential lunar library errors?

3. **Celestial official names localization** -- Should `CELESTIAL_NAMES` ("Thanh Long", "Minh Duong", etc.) be translated to English, or kept as Vietnamese cultural terms with English explanations?
