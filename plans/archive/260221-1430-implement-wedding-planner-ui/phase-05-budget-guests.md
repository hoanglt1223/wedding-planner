# Phase 05: Budget + Guest Components

## Context Links
- Source: `docs/wedding-planner.html` lines 182-194 (`rCost`, `rGuest`)
- Source: lines 289-294 (guest CRUD, CSV functions)
- Types: `src/types/wedding.ts` (Phase 01)
- Hooks: `src/hooks/use-wedding-store.ts` (Phase 02)
- Lib: `src/lib/format.ts`, `src/lib/csv.ts` (Phase 02)
- shadcn: Table, ScrollArea, Input, Button, Slider (Phase 03)

## Overview
- **Priority**: P1
- **Status**: complete
- **Group**: B (parallel with phases 04, 06; depends on Group A)
- **Effort**: 2.5h

## Key Insights

### Budget Panel
- Total budget input (formatted on blur)
- Quick presets: 100tr, 150tr, 200tr, 300tr, 500tr, 1ty
- 13 categories, each with: label, percentage input, calculated amount, color progress bar
- Total percentage summary at bottom (green if <=100%, red if >100%)
- Category percentages default from `BUDGET_CATEGORIES[].p`, overridden by `state.bo[key]`

### Guest Panel
- Add guest form: name (required), phone, side (trai/gai select), group/table
- Summary: count by side, estimated tables (guests/10)
- CSV: download sample, import from file, export current
- Guest table: scrollable, with search filter, delete button per row
- "Xoa tat ca" button with confirm

## Files Owned (EXCLUSIVE)

### Create
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/budget/budget-panel.tsx` | Budget management: total input, presets, category list, summary | ~120 |
| `src/components/budget/budget-category-row.tsx` | Single category: label, pct input, amount, color bar | ~55 |
| `src/components/guests/guest-panel.tsx` | Guest management: form, CSV buttons, summary, table container | ~130 |
| `src/components/guests/guest-table.tsx` | Scrollable guest table with search and delete | ~80 |

## Implementation Steps

### 1. Create `src/components/budget/budget-category-row.tsx`

Props: `{ category, percentage, amount, onChange }`.

Renders:
- Row with label, percentage number input (width 50px), "%" text, formatted amount
- Below: thin progress bar with category color

```typescript
interface BudgetCategoryRowProps {
  category: BudgetCategory;
  percentage: number;
  amount: number;
  onChange: (key: string, value: number) => void;
}
```

Use native `<input type="number">` styled with Tailwind (not shadcn Input, to match compact design). Progress bar is a simple div with `style={{ width, background: category.cl }}`.

### 2. Create `src/components/budget/budget-panel.tsx`

Props from store: `{ budget, categoryOverrides, onSetBudget, onSetCategoryPercent }`.

Structure:
1. `Card` wrapper with "💰 Ngan Sach" header
2. Budget input (center aligned, bold, red, formatted)
   - `onInput`: strip non-digits, parse, update
   - `onFocus`: select all
3. Quick presets row (100/150/200/300/500tr, 1ty) as clickable text
4. Map `BUDGET_CATEGORIES` -> `BudgetCategoryRow` for each
5. Summary footer: total %, total amount, remaining amount (green/red)

Budget input formatting:
```typescript
const handleBudgetInput = (e: React.FormEvent<HTMLInputElement>) => {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, "");
  const value = parseInt(raw) || 0;
  onSetBudget(value);
};
```

### 3. Create `src/components/guests/guest-table.tsx`

Props: `{ guests, onDelete }`.

- Uses shadcn `ScrollArea` for vertical scroll (max-height 350px)
- shadcn `Table` with columns: #, Ten, SDT, Ben, Nhom, X (delete)
- Each row has a red X span that calls `onDelete(index)`
- Search is handled by parent (guest-panel.tsx filters the array)

### 4. Create `src/components/guests/guest-panel.tsx`

Props from store: `{ guests, onAddGuest, onRemoveGuest, onClearGuests, onImportGuests }`.

Structure:
1. `Card` wrapper with "Khach Moi (count)" header
2. Summary banner: side counts, table estimate
3. Add guest form: 4 inputs + add button in a flex row
   - Name input (flex-2, required)
   - Phone input (flex-1)
   - Side select (flex-1): "Trai" / "Gai"
   - Group input (flex-1)
   - "+" Button
4. CSV action buttons row: "CSV mau", "Import" (file input label), "Export", "Xoa tat ca" (if guests exist)
5. Search input (if guests exist)
6. `GuestTable` (if guests exist)

CSV import handler:
```typescript
const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await readFileAsText(file);
  const newGuests = parseCsvToGuests(text);
  onImportGuests(newGuests);
  e.target.value = ""; // reset input
};
```

Guest search: local `useState<string>("")` for search query, filter `guests` before passing to table.

## Todo List

- [x] Create `src/components/budget/budget-category-row.tsx`
- [x] Create `src/components/budget/budget-panel.tsx`
- [x] Create `src/components/guests/guest-table.tsx`
- [x] Create `src/components/guests/guest-panel.tsx`
- [x] Run `npm run build` to verify all components compile

## Success Criteria
- Budget panel: input formats as vi-VN, presets work, percentages update amounts live
- Budget summary: shows correct total %, correct remaining (negative shows red)
- Guest panel: add/delete/clear/search all functional
- CSV sample download triggers file download
- CSV import parses and adds guests
- CSV export downloads current guest list
- Vietnamese text matches HTML source
- No file exceeds 200 lines

## Risk Assessment
- Budget input formatting may cause cursor jump; use controlled input with `formatMoney` on blur only
- Guest panel is the most complex at ~130 lines; keep form logic minimal
- CSV import should handle edge cases (empty lines, missing columns)

## Security Considerations
- CSV import: only string parsing, no code execution
- Guest data stays in localStorage, no server transmission
