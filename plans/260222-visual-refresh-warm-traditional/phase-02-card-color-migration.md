# Phase 2: Card & Color Migration

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-theme-foundation.md)

## Overview
- **Priority**: P1
- **Status**: completed
- **Description**: Unify card patterns + migrate hardcoded colors to theme vars. Can run parallel with Phase 3.

## Key Insights
- 3 card patterns exist: raw `bg-white` divs, shadcn `<Card>`, manual `bg-card` divs
- Target: one pattern using `bg-[var(--theme-surface)]` + `border-[var(--theme-border)]`
- ~30 instances of hardcoded `text-red-*` / `bg-red-*` (non-semantic) to migrate
- 3 instances of `#c0392b` in budget components
- Semantic reds (error/danger/astrology) stay as-is
- Print panel handled separately in Phase 4

## Requirements
- All card wrappers use consistent pattern with theme surface vars
- All non-semantic red references use `text-primary` or `bg-primary`
- Notes callout ("Lưu ý quan trọng") uses theme note vars
- "BẮT BUỘC" badge uses `bg-primary text-primary-foreground`
- Semantic reds preserved (budget warnings, astrology, delete buttons)

## Related Code Files

### Cards to unify (replace bg-white with theme-surface):
1. `src/components/wedding/step-panel.tsx` — line 81
2. `src/components/wedding/ceremony-section.tsx` — line 27
3. `src/components/wedding/ceremony-steps.tsx` — line 108
4. `src/components/wedding/people-grid.tsx` — line 9
5. `src/components/wedding/gifts-table.tsx` — line 20

### shadcn Card to drop (replace with themed div):
6. `src/components/budget/budget-panel.tsx` — uses Card/CardHeader/CardContent
7. `src/components/guests/guest-panel.tsx` — uses Card/CardHeader/CardContent
8. `src/components/vendors/vendor-panel.tsx` — uses Card/CardHeader/CardContent
9. `src/components/notes/notes-panel.tsx` — uses Card/CardHeader/CardContent
10. `src/components/wedding/stats-grid.tsx` — uses Card/CardContent

### Color migration:
11. `src/components/wedding/ceremony-steps.tsx` — headings, time/step cols, hover
12. `src/components/layout/scrollable-tab-bar.tsx` — box variant active state
13. `src/components/layout/header.tsx` — bg-white → bg-[var(--theme-surface)]

## Implementation Steps

### Step 1: Wedding component cards (5 files)

**step-panel.tsx**:
- Line 81: `bg-white rounded-xl p-3 shadow-sm` → `bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]`
- Notes section: `bg-blue-50 border border-blue-200` → `bg-[var(--theme-note-bg)] border border-[var(--theme-note-border)]`
- Notes heading: `text-blue-800` → `text-[var(--theme-note-text)]`
- Notes body: `text-blue-700` → `text-[var(--theme-note-text)]`

**ceremony-section.tsx**:
- Line 27: `bg-white rounded-xl p-3 shadow-sm` → `bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]`
- Line 31: `bg-red-600 text-white` badge → `bg-primary text-primary-foreground`

**ceremony-steps.tsx**:
- Line 108: `bg-white rounded-xl p-3 shadow-sm` → `bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]`
- Lines 112, 138, 179: `text-red-800` headings → `text-primary`
- Lines 158, 192: `text-red-700` time/step columns → `text-primary`
- Line 46: `hover:bg-red-50` → `hover:bg-[var(--theme-surface-muted)]`

**people-grid.tsx**:
- Line 9: `bg-white rounded-xl p-3 shadow-sm` → `bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]`
- Line 10: `text-red-800` heading → `text-primary`

**gifts-table.tsx**:
- Line 20: `bg-white rounded-xl p-3 shadow-sm` → `bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]`
- Line 21: `text-red-800` heading → `text-primary`
- Lines 23, 38: `text-red-700` amounts → `text-primary`

### Step 2: Drop shadcn Card (5 files)

Replace `<Card><CardHeader>...<CardContent>...</Card>` with themed div.

**stats-grid.tsx**:
- Replace `<Card>/<CardContent>` with `<div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]">`
- `text-red-700` stat value → `text-primary`
- Remove Card/CardContent imports

**budget-panel.tsx**:
- Replace Card wrapper with themed div (p-4 for larger panel)
- Replace CardHeader/CardContent with plain divs
- `text-[#c0392b]` (3 places) → `text-[var(--theme-primary)]`
- Keep semantic `text-red-500` (over-budget) and `text-green-600` (under-budget)
- Remove Card/CardHeader/CardContent imports

**guest-panel.tsx**:
- Replace Card wrapper with themed div (p-4)
- `bg-red-700 text-white` active toggles (lines 144, 154) → `bg-primary text-primary-foreground`
- Remove Card imports

**vendor-panel.tsx**:
- Replace Card wrapper with themed div (p-4)
- `bg-gray-50` form bg → `bg-[var(--theme-surface-muted)]`
- `border-gray-200` item border → `border-[var(--theme-border)]`
- Keep `text-red-500` delete button (semantic)
- Remove Card imports

**notes-panel.tsx**:
- Replace Card wrapper with themed div (p-4)
- `focus:ring-red-200` → `focus:ring-[var(--theme-primary)]/20`
- Remove Card imports

### Step 3: Layout components (2 files)

**header.tsx**:
- Line 71: `bg-white/95` → `bg-[var(--theme-surface)]/95`
- Lines 84, 109: `from-white/95` → `from-[var(--theme-surface)]/95`

**scrollable-tab-bar.tsx**:
- Line 59 box active: `bg-red-700 text-white border-red-700` → `bg-primary text-primary-foreground border-primary`
- Line 62 box inactive: `bg-white border-amber-200 hover:border-red-300` → `bg-[var(--theme-surface)] border-[var(--theme-border)] hover:border-primary/50`

### Step 4: Other components

**cards/photo-board.tsx**:
- Active filter: `bg-red-700 text-white` → `bg-primary text-primary-foreground`
- Delete hover: `bg-red-500` → `bg-destructive` (keep semantic red via shadcn token)

**ai/ai-panel.tsx**:
- Send button: `bg-amber-500 hover:bg-amber-400` → keep amber (it's a distinct action, not theme-primary)

## Todo List
- [x] Migrate 5 wedding component cards to theme-surface
- [x] Drop shadcn Card from stats-grid, budget, guest, vendor, notes panels
- [x] Migrate non-semantic reds in ceremony-steps, people-grid, gifts-table
- [x] Migrate "BẮT BUỘC" badge colors
- [x] Migrate notes callout to theme-note vars
- [x] Update header bg-white to theme-surface
- [x] Update scrollable-tab-bar box variant
- [x] Migrate photo-board active filter + budget #c0392b refs
- [x] Verify build

## Success Criteria
- No `bg-white` in non-print card wrappers
- No non-semantic `text-red-*` / `bg-red-*` in migrated components
- All Card/CardHeader/CardContent imports removed from migrated files
- Switching theme changes card backgrounds, borders, headings, badges
- Semantic reds (error/delete/astrology) unchanged

## Risk Assessment
- Medium: Dropping shadcn Card may lose some padding/spacing — verify visually
- Low: Color migration is straightforward find-replace
- Low: header transparency with CSS var — test `bg-[var(--theme-surface)]/95` works

## Next Steps
→ Phase 4 (Print Panel) after this completes
→ Phase 5 (Build Verify) after all phases
