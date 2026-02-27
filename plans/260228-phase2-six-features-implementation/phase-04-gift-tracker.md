---
phase: "04"
title: "Gift/Cash Tracker (Phong Bi Manager)"
status: complete
priority: P2
effort: 1-2 days
completed: 2026-02-28
---

# Phase 04: Gift/Cash Tracker (Phong Bi Manager)

## Context Links
- [plan.md](./plan.md)
- [phase-01-foundation.md](./phase-01-foundation.md)
- [brainstorm-summary.md](../260227-phase2-features-brainstorm/brainstorm-summary.md)

## Parallelization Info
- **Group:** Parallel (02-07)
- **Dependencies:** Phase 01 (GiftEntry type, store methods, EXTRA_TABS, panel-router)
- **Can run with:** Phases 02, 03, 05, 06, 07
- **No file conflicts** — only creates files in `src/components/gifts/` and `src/pages/`

## Overview
Vietnamese wedding "phong bi" (cash envelope) and gift tracker. Track cash gifts per guest, summary by side (bride/groom), thank-you note status, and CSV export. Culturally relevant: cash gifts at Vietnamese weddings are standard practice.

## Key Insights
- Uses `GiftEntry[]` and gift store methods from Phase 01
- Links to existing `Guest` list via optional `guestId`
- Guest name autocomplete from existing guest list
- Summary stats: total cash, by side, by table group
- Thank-you tracking: checkbox per gift
- CSV export with formula injection prevention (existing pattern in code-standards)
- Accessible via planning page sub-tab "Phong Bi" (added by Phase 01)

## Requirements

### Functional
- CRUD for gift entries: add, edit, delete
- Fields: guest name, type (cash/gift), amount, description, side (groom/bride/other), table group, thank-you status
- Optional linking to Guest list (guestId)
- Guest name autocomplete from existing guests
- Summary panel: total cash, count by type, subtotal by side
- Filter by: side, type, thank-you status
- CSV export of all gift data
- Search by guest name

### Non-Functional
- Responsive on mobile
- Persist to localStorage via WeddingState
- All files < 200 lines
- CSV export follows existing security pattern (formula injection prevention)

## Architecture

```
PanelRouter (stepCount + 6)
  └── GiftPage (src/pages/gift-page.tsx)
        ├── gift-summary-bar.tsx     — totals & breakdown
        ├── gift-entry-list.tsx      — filtered/searchable list
        ├── gift-entry-row.tsx       — single entry display
        ├── gift-entry-form.tsx      — add/edit modal
        └── gift-csv-export.tsx      — export utility
```

## Related Code Files (Full Paths)

**Reads (does NOT edit):**
- `D:\Projects\wedding-planner\src\types\wedding.ts` — `GiftEntry`, `Guest`, `WeddingState`
- `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` — `addGift()`, `updateGift()`, `removeGift()`
- `D:\Projects\wedding-planner\src\lib\i18n.ts` — `t()`
- `D:\Projects\wedding-planner\src\lib\format.ts` — `formatMoney()`

**CREATES (exclusive):**
- `D:\Projects\wedding-planner\src\pages\gift-page.tsx`
- `D:\Projects\wedding-planner\src\components\gifts\gift-summary-bar.tsx`
- `D:\Projects\wedding-planner\src\components\gifts\gift-entry-list.tsx`
- `D:\Projects\wedding-planner\src\components\gifts\gift-entry-row.tsx`
- `D:\Projects\wedding-planner\src\components\gifts\gift-entry-form.tsx`
- `D:\Projects\wedding-planner\src\components\gifts\gift-csv-export.tsx`

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/pages/gift-page.tsx` | CREATE — default export, used by PanelRouter |
| `src/components/gifts/gift-summary-bar.tsx` | CREATE |
| `src/components/gifts/gift-entry-list.tsx` | CREATE |
| `src/components/gifts/gift-entry-row.tsx` | CREATE |
| `src/components/gifts/gift-entry-form.tsx` | CREATE |
| `src/components/gifts/gift-csv-export.tsx` | CREATE |

## Implementation Steps

### 1. Create `src/pages/gift-page.tsx`

Default export container:
```typescript
export default function GiftPage({ state, store }: { state: WeddingState; store: WeddingStore }) {
  // State: search query, filter (side, type, thankYou), editing entry
  // Renders: GiftSummaryBar + GiftEntryList + GiftEntryForm (modal)
  // "Add Gift" button in header
  // Max ~100 lines
}
```

### 2. Create `src/components/gifts/gift-summary-bar.tsx`

Summary statistics:
- Total cash received (formatted with `formatMoney()`)
- Cash count + Gift count
- Breakdown by side: groom total / bride total / other total
- Thank-you progress: X/Y thanked
- Props: `{ gifts: GiftEntry[], lang: string }`
- Max ~80 lines

### 3. Create `src/components/gifts/gift-entry-list.tsx`

Filtered list:
- Props: `{ gifts, guests, search, filter, onEdit, onDelete, onToggleThankYou, lang }`
- Filter tabs: All / Cash / Gift / Not Thanked
- Search by guest name
- Maps to `GiftEntryRow`
- Empty state when no gifts
- Max ~80 lines

### 4. Create `src/components/gifts/gift-entry-row.tsx`

Single row:
- Guest name, type badge (cash/gift), amount, side badge, table group
- Thank-you checkbox (inline toggle)
- Edit/Delete buttons
- Color coding: cash=green, gift=blue
- Max ~60 lines

### 5. Create `src/components/gifts/gift-entry-form.tsx`

Add/Edit modal:
- Fields: guest name (autocomplete from guests list), type (radio: cash/gift), amount (number input), description, side (select), table group, thank-you checkbox
- Guest autocomplete: filter existing `guests[]` by name prefix
- Validation: guest name required, amount required for cash
- Save calls `addGift()` or `updateGift()`
- Max ~120 lines

### 6. Create `src/components/gifts/gift-csv-export.tsx`

CSV export button:
- Generates CSV from `GiftEntry[]`
- Columns: Guest Name, Type, Amount, Description, Side, Table, Thank You Sent
- Formula injection prevention: prefix cells starting with =,+,-,@ with single quote
- Downloads as `phong-bi-{date}.csv`
- Props: `{ gifts: GiftEntry[], lang: string }`
- Max ~60 lines

## Todo List

- [x] Create `src/pages/gift-page.tsx` (default export)
- [x] Create `src/components/gifts/gift-summary-bar.tsx`
- [x] Create `src/components/gifts/gift-entry-list.tsx`
- [x] Create `src/components/gifts/gift-entry-row.tsx`
- [x] Create `src/components/gifts/gift-entry-form.tsx` with guest autocomplete
- [x] Create `src/components/gifts/gift-csv-export.tsx` with injection prevention
- [x] Test: add/edit/delete gift entries
- [x] Test: summary calculations correct
- [x] Test: filter by side/type/thankYou works
- [x] Test: CSV export downloads with correct data
- [x] Test: guest autocomplete shows matching names
- [x] Build check passes

## Success Criteria

- Gift tab appears in planning page after timeline tab
- Can add cash and gift entries with all fields
- Summary bar shows accurate totals by type and side
- Thank-you checkbox toggles inline
- Filtering by side, type, thank-you status works
- CSV exports correctly with formula injection prevention
- Guest name autocomplete works
- Data persists across page reloads
- All files < 200 lines

## Conflict Prevention

- Only creates files in `src/components/gifts/` and `src/pages/`
- PanelRouter integration already done in Phase 01
- No shared file edits

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Large gift list performance | Low | Virtual scrolling not needed for <500 items |
| Currency formatting edge cases | Low | Use existing formatMoney() |
| CSV encoding issues (Vietnamese chars) | Low | Use UTF-8 BOM prefix |

## Security Considerations
- CSV export: formula injection prevention (prefix dangerous chars)
- No API calls; pure client-side
- No user-generated HTML rendered
- Amount validation: non-negative numbers only
