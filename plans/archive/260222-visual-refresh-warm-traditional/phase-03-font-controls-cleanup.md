# Phase 3: Font & Controls Cleanup

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-theme-foundation.md)
- Parallel with: [Phase 2](./phase-02-card-color-migration.md)

## Overview
- **Priority**: P1
- **Status**: completed
- **Description**: Consolidate arbitrary font sizes into 6 tiers. Unify interactive controls. Can run parallel with Phase 2.

## Key Insights
- 10+ arbitrary font sizes used: text-[0.55rem] through text-[1rem]
- Gentle consolidation: merge close sizes, keep 6 tiers
- Custom checkbox in CheckableRow has good UX but hardcoded green
- Raw buttons in AI panel (amber send) and budget (blue presets)
- Active state toggles hardcoded red in guest/photo panels

## Requirements

### Font Scale (6 tiers)
| Token | Size | Replaces |
|-------|------|----------|
| `text-2xs` | 0.625rem | text-[0.55rem], text-[0.58rem], text-[0.6rem], text-[0.65rem] |
| `text-xs` | 0.75rem | text-[0.68rem], text-[0.7rem], text-[0.72rem], text-[0.75rem], text-[0.78rem] |
| `text-sm` | 0.875rem | text-[0.8rem], text-[0.82rem] |
| `text-base` | 1rem | text-[1rem] |
| `text-lg` | 1.125rem | — |
| `text-xl` | 1.25rem | — |

### Controls
- CheckableRow checkbox: checked `bg-green-500` → `bg-primary`, border `border-gray-400` → `border-[var(--theme-border)]`
- Checklist hover: `hover:bg-red-50` already handled in Phase 2

## Related Code Files

### Font replacements (by file):
1. `src/components/wedding/step-panel.tsx` — 5× text-[0.68rem] → text-xs
2. `src/components/wedding/ceremony-section.tsx` — 2× text-[0.6rem] → text-2xs
3. `src/components/wedding/ceremony-steps.tsx` — text-[0.65rem], text-[0.6rem] → text-2xs
4. `src/components/wedding/stats-grid.tsx` — text-[0.65rem] → text-2xs
5. `src/components/wedding/people-grid.tsx` — text-[0.6rem] → text-2xs
6. `src/components/wedding/party-time-toggle.tsx` — text-[0.68rem] → text-xs
7. `src/components/notes/notes-panel.tsx` — text-[0.65rem] → text-2xs
8. `src/components/vendors/vendor-panel.tsx` — text-[0.7rem] → text-xs
9. `src/components/ai/ai-panel.tsx` — text-[0.7rem] → text-xs
10. `src/components/budget/budget-panel.tsx` — text-[0.75rem], text-[0.78rem], text-[0.82rem], text-[0.72rem], text-[1rem] → text-xs/text-sm/text-base
11. `src/components/budget/budget-category-row.tsx` — text-[0.8rem], text-[0.78rem], text-[0.68rem], text-[0.7rem] → text-sm/text-xs
12. `src/components/cards/background-grid.tsx` — text-[0.6rem], text-[0.75rem] → text-2xs/text-xs
13. `src/components/cards/invitation-grid.tsx` — text-[0.55rem], text-[0.65rem], text-[0.7rem], text-[0.72rem], text-[0.58rem] → text-2xs/text-xs
14. `src/components/cards/photo-board.tsx` — text-[0.7rem], text-[0.6rem], text-[0.65rem] → text-xs/text-2xs
15. `src/components/guests/guest-table.tsx` — text-[0.6rem] → text-2xs
16. `src/components/guests/seating-chart.tsx` — text-[0.65rem], text-[0.75rem] → text-2xs/text-xs
17. `src/components/ideas/ideas-panel.tsx` — text-[0.65rem] → text-2xs
18. `src/components/layout/header.tsx` — text-[0.65rem] → text-2xs
19. `src/components/layout/scrollable-tab-bar.tsx` — text-[0.6rem] → text-2xs
20. `src/components/print/event-timeline.tsx` — text-[0.7rem] → text-xs

### Controls:
21. `src/components/wedding/ceremony-steps.tsx` — CheckableRow checkbox colors

## Implementation Steps

### Step 1: Font replacement in wedding components
Use `replace_all` where possible:
- `text-[0.68rem]` → `text-xs` (step-panel: 5 instances, party-time-toggle: 1, budget-category-row: 1)
- `text-[0.6rem]` → `text-2xs` (ceremony-section: 2, people-grid: 1, photo-board: 1, guest-table: 1, cards: 2, tab-bar: 1)
- `text-[0.65rem]` → `text-2xs` (ceremony-steps: 2, stats-grid: 1, notes-panel: 1, seating-chart: 1, ideas: 2, header: 1, photo-board: 1, invitation-grid: 1)
- `text-[0.7rem]` → `text-xs` (vendor-panel: 1, ai-panel: 1, photo-board: 1, budget-category-row: 1, event-timeline: 1, invitation-grid: 1)
- `text-[0.75rem]` → `text-xs` (budget-panel: 1, background-grid: 1, seating-chart: 1)
- `text-[0.78rem]` → `text-xs` (budget-panel: 1, budget-category-row: 1)
- `text-[0.72rem]` → `text-xs` (budget-panel: 1, invitation-grid: 1)
- `text-[0.82rem]` → `text-sm` (budget-panel: 1)
- `text-[0.8rem]` → `text-sm` (budget-category-row: 1)
- `text-[0.55rem]` → `text-2xs` (invitation-grid: 1)
- `text-[0.58rem]` → `text-2xs` (invitation-grid: 1)
- `text-[1rem]` → `text-base` (budget-panel: 1 — but check context, may be intentional)

### Step 2: CheckableRow checkbox theming
In `ceremony-steps.tsx`:
- Checked state: `bg-green-500 border-green-500 text-white` → `bg-primary border-primary text-primary-foreground`
- Unchecked border: `border-gray-400` → `border-[var(--theme-border)]`
- Checked row: `bg-green-50 text-green-800` → `bg-[var(--theme-surface-muted)] text-primary`

## Todo List
- [x] Replace text-[0.55rem]/text-[0.58rem]/text-[0.6rem]/text-[0.65rem] → text-2xs
- [x] Replace text-[0.68rem]/text-[0.7rem]/text-[0.72rem]/text-[0.75rem]/text-[0.78rem] → text-xs
- [x] Replace text-[0.8rem]/text-[0.82rem] → text-sm
- [x] Replace text-[1rem] → text-base (where appropriate)
- [x] Update CheckableRow checkbox colors to theme-aware
- [x] Update CheckableRow checked row bg to theme-surface-muted
- [x] Verify build

## Success Criteria
- Zero arbitrary font sizes text-[0.*rem] in non-print components
- CheckableRow adapts to theme (no hardcoded green)
- Visual hierarchy feels consistent (no "fuzzy" near-same sizes)
- Build passes

## Risk Assessment
- Low: Font size changes are cosmetic, no logic impact
- Medium: Some sizes may look slightly different after consolidation — visually check budget panel especially
- Low: Checkbox color change is straightforward

## Next Steps
→ Phase 5 (Build Verify) after this completes
