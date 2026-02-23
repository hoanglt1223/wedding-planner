# Phase 4: Print Panel Adaptation

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 2](./phase-02-card-color-migration.md)

## Overview
- **Priority**: P2
- **Status**: completed
- **Description**: Apply theme colors to print panel while keeping `bg-white` for print compatibility

## Key Insights
- Print panel uses `bg-white` intentionally — print media needs solid white backgrounds
- BUT heading colors and badge colors should still be theme-aware
- Font sizes in print can also be consolidated
- Print styles defined in index.css `@media print` block

## Related Code Files
- `src/components/print/print-panel.tsx` — heading colors, badge colors, font sizes
- `src/components/print/event-timeline.tsx` — dot color, font sizes

## Implementation Steps

### Step 1: print-panel.tsx color migration
- Keep all `bg-white` (needed for print)
- Line 36: `text-red-700` couple name → `text-primary`
- Line 79: `bg-red-100 text-red-700` badge → `bg-primary/10 text-primary`
- Lines 129, 156: `text-red-700` time/step cols → `text-primary`

### Step 2: print-panel.tsx font consolidation
- All `text-[0.65rem]` → `text-2xs`
- All `text-[0.6rem]` → `text-2xs`

### Step 3: event-timeline.tsx
- Line 20: `bg-red-500` wedding dot → `bg-primary`
- Line 47: `text-[0.7rem]` → `text-xs`

## Todo List
- [x] Migrate print heading colors to text-primary
- [x] Migrate badge to theme-aware
- [x] Consolidate print font sizes
- [x] Update event-timeline dot and font
- [x] Verify print still looks correct (bg-white preserved)

## Success Criteria
- Print panel heading/badge colors respond to theme
- bg-white preserved for print compatibility
- Font sizes use text-2xs/text-xs scale
- Build passes

## Risk Assessment
- Low: keeping bg-white for print, only colors change
- Low: `text-primary` uses CSS var which resolves to the theme color — works in print context
