---
phase: 7
title: "Existing Tabs Update"
status: pending
priority: P1
effort: 3h
---

# Phase 7: Existing Tabs Update

## Context Links

- [plan.md](./plan.md) | [phase-01](./phase-01-data-model-migration.md)
- [astrology-page.tsx](../../src/pages/astrology-page.tsx)
- [tab-compatibility.tsx](../../src/components/astrology/tab-compatibility.tsx)
- [tab-five-elements.tsx](../../src/components/astrology/tab-five-elements.tsx)
- [tab-wedding-year.tsx](../../src/components/astrology/tab-wedding-year.tsx)
- [tab-compatible-ages.tsx](../../src/components/astrology/tab-compatible-ages.tsx)
- [tab-feng-shui.tsx](../../src/components/astrology/tab-feng-shui.tsx)
- [zodiac-share-card.tsx](../../src/components/astrology/zodiac-share-card.tsx)

## Overview

Update all 5 existing astrology tabs + share card to work with the new v12 data model. Primary changes: derive birth year from `brideBirthDate` instead of `brideBirthYear`, and use actual gender from state instead of hardcoded "female"/"male" in feng shui tab.

## Key Insights

- All 5 tabs receive `brideYear`/`groomYear` as numbers via `tabProps` from `astrology-page.tsx`
- The year derivation happens in `astrology-page.tsx` (line 26-27): `const brideYear = parseInt(info.brideBirthYear) || 0`
- After Phase 1 migration, `info.brideBirthYear` no longer exists; replaced by `info.brideBirthDate`
- Tab components themselves DON'T need to change IF `astrology-page.tsx` passes correctly derived years
- Main change is in `astrology-page.tsx` tabProps construction + feng shui gender fix
- `zodiac-share-card.tsx` receives data via props, so it works if props are correct

## Requirements

### Functional
1. `astrology-page.tsx` derives years from new `brideBirthDate`/`groomBirthDate` fields
2. `tab-feng-shui.tsx` uses `info.brideGender`/`info.groomGender` instead of hardcoded `"female"`/`"male"`
3. All existing tabs continue to function identically with derived year values
4. Share card continues to work with correct data

### Non-functional
- Zero visual regression in existing tabs
- Backward compat: if birthDate is empty, year defaults to 0 (same as before)

## Architecture

### Change Scope (Minimal)

```
astrology-page.tsx:
  BEFORE: const brideYear = parseInt(info.brideBirthYear) || 0;
  AFTER:  const brideYear = getBirthYear(info.brideBirthDate);

tab-feng-shui.tsx:
  BEFORE: getCungMenh(brideYear, "female")
  AFTER:  getCungMenh(brideYear, brideGender as "male" | "female")

astrology-page.tsx:
  BEFORE: tabProps = { brideYear, groomYear, weddingYear, brideName, groomName }
  AFTER:  tabProps = { brideYear, groomYear, weddingYear, brideName, groomName, brideGender, groomGender }
```

## Related Code Files

### Modify
- `src/pages/astrology-page.tsx` — Year derivation + pass gender in tabProps
- `src/components/astrology/tab-feng-shui.tsx` — Accept + use gender props
- `src/components/astrology/tab-compatibility.tsx` — (optional) Accept gender if needed for future; minimal change
- `src/components/astrology/tab-five-elements.tsx` — No change needed (uses year only)
- `src/components/astrology/tab-wedding-year.tsx` — No change needed (uses year only)
- `src/components/astrology/tab-compatible-ages.tsx` — No change needed (uses year only)
- `src/components/astrology/zodiac-share-card.tsx` — No change needed (uses year via props)

### Create
- None

### Delete
- None

## Implementation Steps

### Step 1: Update astrology-page.tsx year derivation

Replace lines 26-27:

```typescript
// BEFORE
const brideYear = parseInt(info.brideBirthYear) || 0;
const groomYear = parseInt(info.groomBirthYear) || 0;

// AFTER
import { getBirthYear } from "@/lib/astrology";
const brideYear = getBirthYear(info.brideBirthDate);
const groomYear = getBirthYear(info.groomBirthDate);
```

`getBirthYear()` was added in Phase 1 Step 5. It extracts year from "YYYY-MM-DD" format, returns 0 if invalid.

### Step 2: Update astrology-page.tsx tabProps

Add gender to the common tab props object:

```typescript
const tabProps = {
  brideYear, groomYear, weddingYear,
  brideName: info.bride, groomName: info.groom,
  brideGender: info.brideGender || "female",
  groomGender: info.groomGender || "male",
};
```

### Step 3: Update hasData check

```typescript
// BEFORE (line 29)
const hasData = brideYear > 1900 && groomYear > 1900;

// AFTER (same logic, works with derived year)
const hasData = brideYear > 1900 && groomYear > 1900;
// No change needed — getBirthYear returns 0 for empty/invalid dates
```

### Step 4: Update tab-feng-shui.tsx to accept gender props

Update the interface:

```typescript
interface TabFengShuiProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
  brideGender: string;  // NEW
  groomGender: string;  // NEW
}
```

Update `getCungMenh` calls (line 20-21):

```typescript
// BEFORE
const bridePalace = getCungMenh(brideYear, "female");
const groomPalace = getCungMenh(groomYear, "male");

// AFTER
const bridePalace = getCungMenh(brideYear, brideGender as "male" | "female");
const groomPalace = getCungMenh(groomYear, groomGender as "male" | "female");
```

Update `PalaceCard` usage (line 35-36):

```typescript
// BEFORE
<PalaceCard label={brideName || "Cô dâu"} year={brideYear} gender="female" />
<PalaceCard label={groomName || "Chú rể"} year={groomYear} gender="male" />

// AFTER
<PalaceCard label={brideName || "Cô dâu"} year={brideYear} gender={brideGender as "male" | "female"} />
<PalaceCard label={groomName || "Chú rể"} year={groomYear} gender={groomGender as "male" | "female"} />
```

### Step 5: Update remaining tab interfaces (minimal)

For `tab-compatibility.tsx`, `tab-five-elements.tsx`, `tab-wedding-year.tsx`, `tab-compatible-ages.tsx`:

These tabs don't use gender, but their props interface should accept it from the spread `{...tabProps}`. Two approaches:

**Option A (Recommended):** Define a shared `TabCommonProps` type:

Create or add to types file:
```typescript
// In astrology-page.tsx or a shared types location:
interface TabCommonProps {
  brideYear: number;
  groomYear: number;
  weddingYear: number;
  brideName: string;
  groomName: string;
  brideGender: string;
  groomGender: string;
}
```

Each tab can either:
- Accept `TabCommonProps` and ignore unused fields
- Keep their own narrow interface and destructure only what they need

**Option B (Simpler):** Keep individual tab interfaces as-is. When spreading `{...tabProps}`, React allows extra props on function components without error. TypeScript will warn about extra props in JSX though.

**Recommended:** Option A — update each tab's props interface to extend or match `TabCommonProps`. This avoids TypeScript errors from the spread.

### Step 6: Verify share card still works

`ZodiacShareButton` receives `brideYear`, `groomYear`, `brideName`, `groomName`, `score`, `relationType` — all still derived correctly from the updated year computation. No changes needed.

### Step 7: Run full regression test

1. Enter birth dates in the new form
2. Navigate through all 6 tabs
3. Verify data displays correctly in each tab
4. Test feng shui tab: verify Cung Menh changes if gender is toggled
5. Test share card export
6. Test with only year known (migrated data with "YYYY-01-01" format)

## Todo List

- [ ] Import `getBirthYear` in `astrology-page.tsx`
- [ ] Replace `parseInt(info.brideBirthYear)` with `getBirthYear(info.brideBirthDate)`
- [ ] Add `brideGender`/`groomGender` to tabProps
- [ ] Update `TabFengShuiProps` interface to accept gender
- [ ] Replace hardcoded "female"/"male" in `tab-feng-shui.tsx` with props
- [ ] Update tab interfaces to accept `brideGender`/`groomGender` (or use shared type)
- [ ] Verify all 5 existing tabs render correctly with new data
- [ ] Verify share card works
- [ ] Test with empty birth date (should show empty state)
- [ ] Test with year-only migrated data (should work as before)
- [ ] Run `npm run build`
- [ ] Run `npm run lint`

## Success Criteria

- All 5 existing tabs display identical data as before migration
- Feng shui tab uses actual gender from state (not hardcoded)
- No TypeScript errors from prop spreading
- Share card generates correct image
- Empty/invalid birth dates handled gracefully (year = 0, hasData = false)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Prop type mismatch after adding gender to tabProps | Medium | Use shared TabCommonProps type; TypeScript catches errors at build |
| Feng shui calculation changes with gender swap | Low | Intentional — same-sex couples get correct Cung Menh now |
| Spread operator passes unwanted props to DOM | Low | Function components ignore extra props; no DOM element spread |

## Security Considerations

- No server-side changes
- Gender field is not sensitive in this context (used for Cung Menh calculation only)

## Next Steps

- After this phase, all 7 phases are complete
- Full end-to-end testing: migration -> form -> personal tab -> AI reading -> existing tabs
- Deploy to Vercel and test production
