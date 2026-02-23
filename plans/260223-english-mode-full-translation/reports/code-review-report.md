# Code Review Report: English Mode Localization

**Date:** 2026-02-23
**Scope:** Full English mode i18n implementation (6 phases)
**Files:** ~17 new `.en.ts` data files + ~30 modified files + 1 new barrel (`resolve-data.ts`) + 1 new translations file (`i18n-translations.ts`)
**Build:** TypeScript compiles clean (`npx tsc --noEmit` passes with 0 errors)

---

## Overall Assessment

Solid implementation of dual-language data architecture. The foundation layer (resolve-data.ts, format.ts, i18n.ts, i18n-translations.ts) is well-designed and consistent. Component wiring covers the main planning, budget, guest, AI, print, cards, notes, vendor, and onboarding flows. However, the astrology sub-tabs and several smaller components were NOT wired for English, leaving significant gaps where Vietnamese strings appear in English mode.

---

## Critical Issues

### CRIT-1: Astrology personal tab uses hardcoded Vietnamese data imports

**File:** `src/components/astrology/tab-personal.tsx` (lines 4-6, 33-35)

The personal astrology tab imports directly from Vietnamese data modules instead of using the lang-aware resolver:

```typescript
// CURRENT (always returns Vietnamese)
import { getZodiacProfile } from "@/data/astrology-zodiac-profiles";
import { getElementProfile } from "@/data/astrology-element-profiles";
import { getYearlyForecast } from "@/data/astrology-yearly-forecast";
// ...
const profile = getZodiacProfile(zodiac.chiIndex);
const elementProfile = getElementProfile(soundElement.element);
const forecast = getYearlyForecast(zodiac.chiIndex);
```

**Impact:** All zodiac personality profiles, element profiles, and yearly forecasts display in Vietnamese regardless of language setting. These are the exact data files that Phase 3 created English translations for but which never get used.

**Fix:** Import from `resolve-data.ts` instead:

```typescript
import { getZodiacProfiles, getElementProfiles, getYearlyForecasts } from "@/data/resolve-data";
// ...
const profile = getZodiacProfiles(lang)[zodiac.chiIndex];
const elementProfile = getElementProfiles(lang).find(p => p.key === soundElement.element);
const forecast = getYearlyForecasts(lang)[zodiac.chiIndex];
```

Requires threading `lang` through the `TabPersonal` interface and from `AstrologyPage` tabProps.

### CRIT-2: AI reading card sends no `lang` parameter to API

**File:** `src/components/astrology/ai-reading-card.tsx` (line 26)

The `AiReadingCard` component calls `/api/astrology-reading` without `lang`:

```typescript
body: JSON.stringify({ birthDate, birthHour, gender, currentYear }),
```

The API now supports `lang` (Phase 6 added it), but the component never sends it. Result: AI astrology readings are always in Vietnamese even when English mode is active.

**Fix:** Accept `lang` as prop and include it in the request body:

```typescript
body: JSON.stringify({ birthDate, birthHour, gender, currentYear, lang }),
```

---

## High Priority

### HIGH-1: Astrology sub-tab components lack lang support entirely

**Files affected (6 components, none receive `lang`):**
- `src/components/astrology/tab-compatibility.tsx`
- `src/components/astrology/tab-five-elements.tsx`
- `src/components/astrology/tab-wedding-year.tsx`
- `src/components/astrology/tab-compatible-ages.tsx`
- `src/components/astrology/tab-feng-shui.tsx`
- `src/components/astrology/zodiac-share-card.tsx`

These components contain extensive hardcoded Vietnamese UI strings:
- Fallback labels: `"Co dau"`, `"Chu re"` (~30 occurrences)
- Section headers: `"Quan he dia chi"`, `"Nhom Tam Hop"`, `"Vong Tuong Sinh"`, etc.
- Descriptions: `"Binh Hoa"`, `"Tuong Sinh"`, `"Tuong Khac"`, Kim Lau explanations, Tam Tai explanations
- Table headers: `"Hanh"`, `"Sinh"`, `"Khac"`, `"Nam"`, `"Can Chi"`, `"Con giap"`, etc.
- Warning messages: `"gap Tam Tai nam..."`, `"pham Thai Tue..."`, `"pham Kim Lau..."`, etc.

The `AstrologyPage` passes `lang` via `tabProps` but these components ignore it since they do not include `lang` in their Props interfaces.

**Impact:** In English mode, the entire astrology feature (6 tabs) displays Vietnamese strings for all labels, headers, and descriptions.

**Effort:** Medium-high. Requires adding `lang?: string` to all 6 component interfaces and translating ~50 unique Vietnamese strings.

### HIGH-2: `astrology.ts` core lib returns hardcoded Vietnamese labels

**File:** `src/lib/astrology.ts` (lines 28-30, 93-96)

```typescript
export const ELEMENT_LABEL: Record<string, string> = {
  metal: "Kim", wood: "Moc", water: "Thuy", fire: "Hoa", earth: "Tho",
};
// ...
getElementRelation() returns { label: "Binh Hoa" | "Tuong Sinh" | "Tuong Khac", desc: "...Vietnamese..." }
```

**Impact:** These labels are used throughout all astrology tabs. Even if sub-tabs get `lang`, the element labels and relation descriptions would still be Vietnamese.

**Fix option A (minimal):** Add lang-aware variants:

```typescript
export function getElementLabel(key: string, lang: string): string {
  if (lang === "en") return { metal: "Metal", wood: "Wood", water: "Water", fire: "Fire", earth: "Earth" }[key] ?? key;
  return ELEMENT_LABEL[key] ?? key;
}
```

**Fix option B (recommended):** Move Vietnamese labels out of lib into data files and use resolve-data pattern.

### HIGH-3: `astrology-feng-shui.ts` has hardcoded Vietnamese data

**File:** `src/lib/astrology-feng-shui.ts`

Contains Vietnamese color names (`"Trang"`, `"Bac"`, `"Do"`, etc.), direction names (`"Bac"`, `"Dong"`, `"Tay Nam"`, etc.), season names, and palace group names in Vietnamese. No English variants exist.

### HIGH-4: `ai-reading-card.tsx` has 10+ hardcoded Vietnamese UI strings

**File:** `src/components/astrology/ai-reading-card.tsx`

Hardcoded strings include:
- `"Phan Tich Chi Tiet (AI)"` (heading)
- `"Nhap day du ngay sinh..."` (instructions)
- `"Dang phan tich tu vi..."` (loading)
- `"Xep Chi Tiet"` (button)
- `"Loi ket noi..."`, `"Tinh nang AI..."`, `"Khong the tao phan tich..."` (errors)
- `"Ket qua tu bo nho dem"` (cache notice)
- `"Xep lai"` (retry button)
- `"Thu lai"` (retry link)

### HIGH-5: `guest-table.tsx` has hardcoded Vietnamese column headers

**File:** `src/components/guests/guest-table.tsx` (lines 25-29, 42)

```typescript
<TableHead>Ten</TableHead>
<TableHead>SDT</TableHead>
<TableHead>Ben</TableHead>
<TableHead>Nhom</TableHead>
// ...
{g.side === "trai" ? "Trai" : "Gai"}
```

Does not receive `lang` prop. The parent `GuestPanel` already has `lang` but does not pass it to `GuestTable`.

### HIGH-6: Landing page has no English support

**Files:**
- `src/pages/landing-page.tsx`
- `src/components/landing/landing-hero.tsx`
- `src/components/landing/landing-features.tsx`
- `src/components/landing/landing-footer.tsx`

All text is hardcoded Vietnamese with no `lang` prop. The landing page is the entry point for new users. However, since the landing page does not receive `state` (pre-onboarding), the lang toggle is in the footer which only appears post-onboarding. This may be acceptable if the landing page is not expected to translate (since users have not selected language yet).

**Decision needed:** Is landing page translation in scope?

### HIGH-7: `shared-progress.tsx` imports Vietnamese WEDDING_STEPS directly

**File:** `src/components/shared/shared-progress.tsx` (line 1, 13)

```typescript
import { WEDDING_STEPS } from "@/data/wedding-steps";
// ...
const steps = WEDDING_STEPS.map(...)
```

Uses Vietnamese step data for shared preview progress. No `lang` prop. When an English-mode user shares their plan, the shared preview shows Vietnamese step titles.

---

## Medium Priority

### MED-1: EXTRA_TABS keys need i18n-aware translation in tab-navigation

**File:** `src/data/backgrounds.ts` (lines 66-71), consumed by `tab-navigation.tsx`

The EXTRA_TABS are Vietnamese strings used as keys for `t()` lookup in `tab-navigation.tsx`:

```typescript
export const EXTRA_TABS = ["Chi Phi", "Khach Moi", "Ghi Chu", "Vendor"] as const;
```

In `tab-navigation.tsx`:
```typescript
...EXTRA_TABS.map((label) => ({ label: t(label, lang) })),
```

This works because matching translations exist in `i18n-translations.ts`. However, the pattern is fragile -- if anyone changes the Vietnamese string in backgrounds.ts, the translation lookup silently breaks (falls through to returning the Vietnamese key). Consider using stable keys instead of Vietnamese display strings as lookup keys.

### MED-2: Translation key pattern uses Vietnamese display strings

**File:** `src/lib/i18n-translations.ts`

The translation dictionary uses Vietnamese strings as keys:

```typescript
"Ke Hoach Dam Cuoi": { vi: "Ke Hoach Dam Cuoi", en: "Wedding Planner" },
```

This works but is fragile and makes typos hard to catch (no TypeScript safety). A key mismatch silently falls through to returning the Vietnamese key. Consider:
- Using stable English dot-notation keys (`"onboarding.title"`)
- Or auto-generating a type-safe key union from the translations object

### MED-3: `cards-panel.tsx` event names used as both display and lookup keys

**File:** `src/components/cards/cards-panel.tsx` (lines 55-57)

```typescript
const events = [
  { n: "Dam Ngo", d: info.engagementDate },
  { n: "Dam Hoi", d: info.betrothalDate },
  { n: "Tiec Cuoi", d: info.date },
];
```

The `ev.n` values are Vietnamese strings that double as translation keys passed to `t(ev.n, lang)`. This works now but couples the data model to the Vietnamese display strings.

Also, `getInviteMsg()` checks against `"Tiec Cuoi"` and `"Dam Hoi"` (the original Vietnamese strings), which is correct since the events array stores Vietnamese keys. Just worth noting the implicit coupling.

### MED-4: Inconsistent inline translations vs t() function usage

Some components use `t("key", lang)` consistently. Others use inline ternaries:

```typescript
// t() pattern (preferred)
{t("Ghi Chu Chung", lang)}

// Inline ternary (scattered, harder to maintain)
{lang === "en" ? "Add your first guest" : "Them khach moi dau tien"}
```

About ~30 strings use inline ternaries instead of `t()`. These are harder to maintain and impossible to validate for completeness. Move them to `i18n-translations.ts` and use `t()`.

### MED-5: `lang` prop typed as `string` everywhere instead of `"vi" | "en"`

All components accept `lang` as `string` (or `string | undefined`). The `WeddingState` type also uses `lang: string`. This misses compile-time safety:

```typescript
// Current — allows "fr", "xx", or any arbitrary string
lang?: string

// Better
type Lang = "vi" | "en";
lang?: Lang
```

### MED-6: `format.ts` functions default to `"vi"` as string literal

**File:** `src/lib/format.ts` (lines 12, 17)

```typescript
export function formatMoney(n: number, lang = "vi"): string {
export function formatShort(n: number, lang = "vi"): string {
```

If called without `lang`, defaults to `"vi"`. Safe behavior since all callers now pass `lang`, but the default could mask bugs where lang threading is forgotten in future code.

---

## Low Priority

### LOW-1: `getCurrencySymbol("en")` returns `" VND"` with leading space

**File:** `src/lib/format.ts` (line 8)

```typescript
return lang === "en" ? " VND" : "d";
```

The leading space is intentional (space before "VND" suffix) but it creates an inconsistency: Vietnamese uses no space before "d" while English has a space before "VND". This is visually correct but callers must be aware the spacing is baked into the return value.

### LOW-2: `FORECAST_YEAR_EN` exported but unused

**File:** `src/data/astrology-yearly-forecast.en.ts` (line 7)

```typescript
export const FORECAST_YEAR_EN = 2026;
```

Exported but not imported anywhere. The Vietnamese counterpart `FORECAST_YEAR` from `astrology-yearly-forecast.ts` is also never used. Both are dead exports.

### LOW-3: Helper functions in EN data files are unused

**Files:**
- `astrology-zodiac-profiles.en.ts`: `getZodiacProfileEn()` exported but not used (resolve-data.ts does the switching)
- `astrology-element-profiles.en.ts`: `getElementProfileEn()` exported but not used
- `astrology-yearly-forecast.en.ts`: `getYearlyForecastEn()` exported but not used

These convenience functions are redundant since `resolve-data.ts` handles language switching. They do not cause harm but add dead code.

---

## Positive Observations

1. **Clean architecture:** The `resolve-data.ts` barrel pattern is simple and effective -- easy to understand, no complex lazy loading.
2. **Consistent data structure:** All EN data files correctly import and implement the same TypeScript interfaces as their Vietnamese counterparts. Types match perfectly.
3. **Thorough translation file:** `i18n-translations.ts` covers ~200 keys across all major feature areas with well-written English translations.
4. **Budget formatting done right:** `format.ts` properly handles locale-specific number formatting (comma vs period separators) and currency symbols.
5. **API layer handled well:** Both `api/ai/chat.ts` and `api/astrology-reading.ts` correctly receive `lang`, switch system prompts, and include lang in cache keys (preventing stale cross-language cached responses).
6. **No runtime errors detected:** TypeScript compiles clean. The `t()` function safely falls back to the Vietnamese key when a translation is missing, preventing crashes.
7. **Sample data per language:** Onboarding wizard provides English-friendly sample names ("Emily Nguyen", "David Tran") for English mode.
8. **Cultural annotation preserved:** EN data files preserve Vietnamese terms in parentheses for cultural context (e.g., "Betrothal Ceremony (Le Dam Hoi)").

---

## Metrics

| Metric | Value |
|--------|-------|
| Files reviewed | ~55 |
| New files | 18 (17 .en.ts + i18n-translations.ts) |
| Modified files | 30 |
| Translation keys | ~200 |
| Type safety | 100% (tsc passes clean) |
| Linting issues | 0 critical |
| Components with lang wiring | 25/33 (~76%) |
| Components missing lang | ~8 (astrology tabs, guest-table, ai-reading-card, shared-progress, landing) |
| Hardcoded Vietnamese strings remaining | ~100+ (mostly in astrology sub-tabs and lib files) |

---

## Recommended Actions (Priority Order)

1. **[CRIT]** Wire `lang` into `tab-personal.tsx` and switch from direct Vietnamese data imports to `resolve-data.ts` getters so EN zodiac/element/forecast data is actually used.
2. **[CRIT]** Pass `lang` to `AiReadingCard` so AI astrology readings respect language setting.
3. **[HIGH]** Add `lang` prop to all 6 astrology sub-tab components and translate their UI strings.
4. **[HIGH]** Create lang-aware variants for `ELEMENT_LABEL` and `getElementRelation()` in `astrology.ts`.
5. **[HIGH]** Wire `lang` into `guest-table.tsx` for column headers and "Trai"/"Gai" labels.
6. **[HIGH]** Wire `lang` into `ai-reading-card.tsx` for all UI strings (headings, buttons, errors).
7. **[HIGH]** Wire `lang` into `shared-progress.tsx` to use lang-aware wedding steps.
8. **[MED]** Move inline ternary translations to `i18n-translations.ts` and use `t()` consistently.
9. **[MED]** Consider narrowing `lang` type from `string` to `"vi" | "en"` across the codebase.
10. **[LOW]** Remove unused helper functions from EN data files.
11. **[DECISION]** Determine whether landing page translation is in scope.

---

## Unresolved Questions

1. Should the landing page be translated? It is shown before users select a language, so Vietnamese-only may be intentional. However, direct URL users (Viet Kieu sharing links) would see Vietnamese first.
2. Should `astrology.ts` core Vietnamese terminology (Can Chi names like "Ty", "Suu", "Dan") be translated? These are proper nouns in the Vietnamese astrology system and may be intentionally kept in Vietnamese even in English mode.
3. Is there a mechanism for users to set language before seeing the landing page (e.g., URL param `?lang=en`)? If so, the landing page needs translation support.
4. Should the `ELEMENT_LABEL` map in `astrology.ts` be localized to English ("Metal", "Wood", etc.) or should the Vietnamese terms be kept as cultural terminology with English explanations alongside?
