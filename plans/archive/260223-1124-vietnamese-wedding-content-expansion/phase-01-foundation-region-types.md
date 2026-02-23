# Phase 01: Foundation — Region System + Type Extensions

## Context Links
- Parent: [plan.md](plan.md)
- Brainstorm: [brainstorm-report.md](brainstorm-report.md)
- Code standards: [docs/code-standards.md](../../docs/code-standards.md)

## Overview
- **Priority:** P0 (blocks all other phases)
- **Status:** completed
- **Est:** 3h
- **Description:** Add region selector infrastructure, extend TypeScript types, bump store version with migration

## Key Insights
- Current store is `wp_v12` — bump to `wp_v13` with region field defaulting to `"south"`
- `resolve-data.ts` currently takes only `lang` — must extend pattern to `(lang, region)` without breaking existing callers
- Existing `WeddingStep` already has `meaning` and `notes[]` — extend `Ceremony` type with optional enrichment fields
- Region selector should live in header alongside existing language toggle

## Requirements

### Functional
- Region selector (North/Central/South) persisted in Zustand
- Extended types for enriched ceremony data (backward-compatible)
- Data resolution pattern supporting `(lang, region)` tuple
- Store migration from v12 → v13

### Non-Functional
- Zero regression on existing features
- All new type fields optional (backward-compatible)
- Max 200 lines per file

## Architecture

### Region Type System
```typescript
// src/data/regions.ts
export type Region = "north" | "central" | "south";

export interface RegionalContent<T = string> {
  default: T;
  north?: T;
  central?: T;
  south?: T;
}

export function resolveRegional<T>(content: RegionalContent<T>, region: Region): T {
  return content[region] ?? content.default;
}

export const REGIONS: { id: Region; label: string; labelEn: string; emoji: string }[] = [
  { id: "north", label: "Miền Bắc", labelEn: "Northern", emoji: "🏔️" },
  { id: "central", label: "Miền Trung", labelEn: "Central", emoji: "🌊" },
  { id: "south", label: "Miền Nam", labelEn: "Southern", emoji: "🌴" },
];
```

### Extended Types (add to `wedding.ts`)
```typescript
// New optional fields on Ceremony
export interface Ceremony {
  // ... existing fields
  significance?: string;              // Cultural "why we do this"
  tips?: string[];                    // Practical how-to tips
  commonMistakes?: string[];          // Things to avoid
  regionalNotes?: RegionalContent<string[]>;  // Region-specific notes
}

// New types for features 2-4
export interface TraditionalItem {
  id: string;
  name: string;
  quantity: RegionalContent<string>;
  purpose: string;
  whereToFind?: string;
  icon: string;
  phaseId: string;       // Links to WeddingStep.id
  required: RegionalContent<boolean>;
}

export interface FamilyRole {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  avatar: string;
  responsibilities: Record<string, string[]>; // phaseId → duties[]
}
```

### Store Extension
```typescript
// Add to WeddingState
region: Region;                              // default: "south"
itemsChecked: Record<string, boolean>;       // "${phaseId}_${itemId}" → checked
```

## Related Code Files

### Modify
- `src/types/wedding.ts` — Add Region, TraditionalItem, FamilyRole types; extend Ceremony, WeddingState
- `src/hooks/use-wedding-store.ts` — Add region/itemsChecked state + setRegion/toggleItemCheck actions; bump to wp_v13
- `src/data/resolve-data.ts` — Add region-aware getter pattern (keep existing signatures for backward compat)
- `src/lib/migrate-state.ts` — Add wp_v12 → wp_v13 migration (add region: "south", itemsChecked: {})
- `src/lib/i18n-translations.ts` — Add ~15 new keys for region selector UI
- `src/data/backgrounds.ts` — Update DEFAULT_STATE with new fields

### Create
- `src/data/regions.ts` — Region constants, RegionalContent type, resolveRegional helper
- `src/components/layout/region-selector.tsx` — Dropdown/pill toggle for N/C/S

### Read (reference only)
- `src/components/layout/header.tsx` — Where to integrate region selector

## Implementation Steps

1. Create `src/data/regions.ts` with Region type, REGIONS array, RegionalContent generic, resolveRegional helper
2. Extend `src/types/wedding.ts`:
   - Import `RegionalContent` from regions
   - Add optional fields to `Ceremony`: `significance?`, `tips?`, `commonMistakes?`, `regionalNotes?`
   - Add `TraditionalItem`, `FamilyRole` interfaces
   - Add `region: string` and `itemsChecked: Record<string, boolean>` to `WeddingState`
3. Update `src/data/backgrounds.ts` DEFAULT_STATE — add `region: "south"`, `itemsChecked: {}`
4. Update `src/lib/migrate-state.ts` — add v12→v13 migration
5. Update `src/hooks/use-wedding-store.ts`:
   - Change STORAGE_KEY to `"wp_v13"`
   - Add `setRegion` and `toggleItemCheck` callbacks
   - Export them in return object
6. Create `src/components/layout/region-selector.tsx` — pill-style toggle (N/C/S) using theme vars
7. Integrate region selector into `src/components/layout/header.tsx` (next to lang toggle)
8. Add i18n keys: "Miền Bắc", "Miền Trung", "Miền Nam", "Vùng miền", etc.
9. Run `npm run build` to verify no type errors

## Todo List
- [ ] Create `src/data/regions.ts`
- [ ] Extend types in `src/types/wedding.ts`
- [ ] Update DEFAULT_STATE in `src/data/backgrounds.ts`
- [ ] Add v12→v13 migration in `src/lib/migrate-state.ts`
- [ ] Update store: key, new actions in `use-wedding-store.ts`
- [ ] Create `region-selector.tsx` component
- [ ] Integrate into header
- [ ] Add i18n keys
- [ ] Build check passes

## Success Criteria
- [ ] Region selector visible in header, persists across sessions
- [ ] Store migrates cleanly from v12 → v13 (no data loss)
- [ ] All existing features work unchanged
- [ ] TypeScript build passes with zero errors
- [ ] New types are importable from `@/types/wedding`

## Risk Assessment
- **Store migration breakage**: Low risk — migration only adds fields with defaults
- **Existing callers of resolve-data**: Medium — must keep existing `(lang)` signatures working

## Security Considerations
- Region preference is non-sensitive, stored in localStorage only
- No API calls involved in this phase

## Next Steps
- After Phase 1, phases 2-5 can proceed in parallel
- Each phase imports Region types and uses resolveRegional helper
