---
phase: 1
title: "Data Model Migration (v11 -> v12)"
status: completed
priority: P1
effort: 2h
---

# Phase 1: Data Model Migration (v11 -> v12)

## Context Links

- [plan.md](./plan.md) | [wedding.ts](../../src/types/wedding.ts) | [migrate-state.ts](../../src/lib/migrate-state.ts)
- [use-wedding-store.ts](../../src/hooks/use-wedding-store.ts) | [backgrounds.ts](../../src/data/backgrounds.ts)

## Overview

Replace `brideBirthYear`/`groomBirthYear` string fields in CoupleInfo with structured birth data: full date, birth hour, and gender. Migrate existing v11 localStorage to v12 preserving backward compatibility.

## Key Insights

- Current `brideBirthYear`/`groomBirthYear` are strings storing 4-digit years
- Migration chain is v7->v8->v9->v10->v11; we add v11->v12
- `updateInfo(field, value)` in store uses generic string value — need to support `string | number | null` for `birthHour`
- All 5 existing tabs receive `brideYear`/`groomYear` as numbers derived from `parseInt(info.brideBirthYear)`

## Requirements

### Functional
1. CoupleInfo must include: `brideBirthDate`, `brideBirthHour`, `brideGender`, `groomBirthDate`, `groomBirthHour`, `groomGender`
2. Keep `brideBirthYear`/`groomBirthYear` as derived values (not stored) OR keep in state for backward compat during transition
3. v11 users must seamlessly migrate to v12 without data loss

### Non-functional
- Migration must be idempotent (safe to call multiple times)
- Zero breaking changes for existing users

## Architecture

```
v11 state:
  info.brideBirthYear: "2000"  (string)
  info.groomBirthYear: "1999"  (string)

v12 state:
  info.brideBirthDate: "2000-01-01" | ""  (YYYY-MM-DD string)
  info.brideBirthHour: null | 0-23        (number | null)
  info.brideGender: "female" | "male"     (string)
  info.groomBirthDate: "1999-01-01" | ""
  info.groomBirthHour: null | 0-23
  info.groomGender: "male" | "female"
  // brideBirthYear/groomBirthYear REMOVED from storage
```

Migration logic: if v11 has `brideBirthYear: "2000"`, convert to `brideBirthDate: "2000-01-01"` (Jan 1 placeholder since only year was known). Set `brideBirthHour: null`, `brideGender: "female"`, `groomGender: "male"`.

## Related Code Files

### Modify
- `src/types/wedding.ts` — Update CoupleInfo interface
- `src/lib/migrate-state.ts` — Add V12_KEY, v11->v12 migration
- `src/hooks/use-wedding-store.ts` — Change STORAGE_KEY to `wp_v12`, update `updateInfo` signature
- `src/data/backgrounds.ts` — Update DEFAULT_STATE.info with new fields

### Create
- None

### Delete
- None

## Implementation Steps

### Step 1: Update CoupleInfo interface

In `src/types/wedding.ts`, replace lines in CoupleInfo:

```typescript
export interface CoupleInfo {
  bride: string;
  groom: string;
  brideFamilyName: string;
  groomFamilyName: string;
  date: string;
  engagementDate: string;
  betrothalDate: string;
  // NEW: replaces brideBirthYear/groomBirthYear
  brideBirthDate: string;       // "YYYY-MM-DD" or ""
  brideBirthHour: number | null; // 0-23 or null (unknown)
  brideGender: string;           // "female" | "male"
  groomBirthDate: string;
  groomBirthHour: number | null;
  groomGender: string;
}
```

### Step 2: Update DEFAULT_STATE in backgrounds.ts

In `src/data/backgrounds.ts`, update `DEFAULT_STATE.info`:

```typescript
info: {
  bride: "",
  groom: "",
  brideFamilyName: "",
  groomFamilyName: "",
  date: "",
  engagementDate: "",
  betrothalDate: "",
  brideBirthDate: "",
  brideBirthHour: null,
  brideGender: "female",
  groomBirthDate: "",
  groomBirthHour: null,
  groomGender: "male",
},
```

### Step 3: Add v11->v12 migration in migrate-state.ts

Add `V12_KEY = "wp_v12"` constant. Update `migrateState()`:

1. Check `V12_KEY` first — if exists, return early (already migrated)
2. Read `V11_KEY` data
3. Transform `info.brideBirthYear` -> `info.brideBirthDate`: if year string is valid 4-digit, set `"YYYY-01-01"`; otherwise `""`
4. Set `info.brideBirthHour: null`
5. Set `info.brideGender: "female"`, `info.groomGender: "male"` (matching current hardcoded behavior)
6. Same for groom fields
7. Remove old `brideBirthYear`/`groomBirthYear` from info object
8. Write to `V12_KEY`

Key migration code pattern (following existing style):

```typescript
const V12_KEY = "wp_v12";

// Inside migrateState(), at the top:
if (localStorage.getItem(V12_KEY)) return;

// v11->v12 migration
const v11Raw = localStorage.getItem(V11_KEY);
if (v11Raw) {
  try {
    const v11Data = JSON.parse(v11Raw);
    const info = v11Data.info || {};
    const brideBY = info.brideBirthYear || "";
    const groomBY = info.groomBirthYear || "";
    const v12Info = {
      ...info,
      brideBirthDate: brideBY.length === 4 ? `${brideBY}-01-01` : "",
      brideBirthHour: null,
      brideGender: "female",
      groomBirthDate: groomBY.length === 4 ? `${groomBY}-01-01` : "",
      groomBirthHour: null,
      groomGender: "male",
    };
    delete v12Info.brideBirthYear;
    delete v12Info.groomBirthYear;
    const v12Data = { ...v11Data, info: v12Info };
    localStorage.setItem(V12_KEY, JSON.stringify(v12Data));
  } catch { /* corrupt data */ }
  return;
}
```

### Step 4: Update use-wedding-store.ts

1. Change `STORAGE_KEY` from `"wp_v11"` to `"wp_v12"`
2. Update `updateInfo` callback to handle `string | number | null`:

```typescript
const updateInfo = useCallback(
  (field: string, value: string | number | null) => {
    setState((prev) => ({
      ...prev,
      info: { ...prev.info, [field]: value },
    }));
  },
  [setState],
);
```

### Step 5: Add helper to extract birth year from date

Add a utility function (can go in `src/lib/astrology.ts` or the astrology page):

```typescript
/** Extract birth year from "YYYY-MM-DD" date string, returns 0 if invalid */
export function getBirthYear(birthDate: string): number {
  if (!birthDate || birthDate.length < 4) return 0;
  return parseInt(birthDate.slice(0, 4)) || 0;
}
```

## Todo List

- [x] Update CoupleInfo interface in `src/types/wedding.ts`
- [x] Update DEFAULT_STATE in `src/data/backgrounds.ts`
- [x] Add V12_KEY and v11->v12 migration in `src/lib/migrate-state.ts`
- [x] Update STORAGE_KEY to `wp_v12` in `src/hooks/use-wedding-store.ts`
- [x] Update `updateInfo` signature to accept `string | number | null`
- [x] Add `getBirthYear()` helper in `src/lib/astrology.ts`
- [x] Run `npm run build` to verify no type errors
- [ ] Test migration: set wp_v11 in localStorage, reload, verify wp_v12 created correctly

## Success Criteria

- `npm run build` passes with zero type errors
- Existing v11 users get seamless migration with birth date derived from year
- New users start with empty birth date fields
- All existing astrology calculations still work via `getBirthYear()` extraction

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration corrupts existing data | High | Always read-only from v11, write new v12; keep v11 intact |
| Type errors cascade through 5 tab components | Medium | Phase 7 updates tabs; temporarily they can still work with derived year |
| `updateInfo` signature change breaks callers | Medium | Use union type `string \| number \| null`; existing string callers still work |

## Security Considerations

- No sensitive data involved; birth dates stored in localStorage only
- No server-side changes in this phase

## Next Steps

- Phase 2 (Birth Input Form) consumes the new fields
- Phase 7 (Existing Tabs Update) adapts all 5 tabs to use `getBirthYear(info.brideBirthDate)`
