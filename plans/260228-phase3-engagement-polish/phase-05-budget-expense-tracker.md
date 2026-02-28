# Phase 05: Budget & Expense Tracker

## Parallelization Info

- **Group:** C (runs in parallel with Phase 04 and 06)
- **Depends on:** Phase 03 (app structure, Planning page accessible)
- **Blocks:** Phase 07 (Polish)
- **No file conflicts with Phase 04 or 06**

## Context Links

- [Brainstorm: Phase 3B](../260228-phase3-engagement-polish-brainstorm/brainstorm-summary.md)
- [Current wedding.ts types](../../src/types/wedding.ts) -- WeddingState has `budget`, `budgetOverrides`, `expenses` fields
- [Current use-wedding-store.ts](../../src/hooks/use-wedding-store.ts) -- setBudget, setCategoryPercent, setExpense methods exist
- [Current migrate-state.ts](../../src/lib/migrate-state.ts) -- v14->v15 migration pattern
- [Gift CSV export pattern](../../src/components/gifts/gift-csv-export.tsx) -- reusable export logic
- [Budget categories](../../src/data/budget-categories.ts) -- existing category definitions
- [Format utilities](../../src/lib/format.ts) -- formatMoney(n, lang)

## Overview

- **Priority:** HIGH (#1 engagement driver in wedding planners)
- **Status:** complete
- **Effort:** 5h
- **Description:** Full expense tracking: add `ExpenseEntry` type to state, migrate v15->v16, build expense log CRUD, budget overview, category breakdown, summary cards, CSV export. Slots into Planning section as a sub-tab accessible via existing `PanelRouter`.

## Key Insights

- Existing state already has `budget` (total), `budgetOverrides` (per-category %), `expenses` (per-category spent) -- but no individual expense entries
- New `ExpenseEntry[]` type gives line-item tracking (amount, vendor, date, category, paid status)
- State migration v15 -> v16: add `expenseLog`, `expenseIdCounter` fields
- Budget categories already defined in `src/data/budget-categories.ts` -- reuse
- Vietnamese presets: ceremony gifts, photography, catering, venue, ao dai, etc.
- CSV export pattern already exists in gift-csv-export.tsx -- follow same approach
- No charts in v1 (YAGNI); progress bars and numbers only
- VND formatting via existing `formatMoney(n, lang)` in `src/lib/format.ts`

## Requirements

### Functional
- ExpenseEntry CRUD: add, edit, delete expense entries
- Budget overview: total budget vs total spent, remaining amount
- Category breakdown: per-category budget allocation vs spent
- Expense log: sortable list with filters
- Quick-add FAB (floating action button) for fast entry on mobile
- Summary cards: total paid, total unpaid, overbudget warnings
- CSV export of expense log
- Vietnamese expense category presets

### Non-Functional
- State migration v15 -> v16 (ONLY migration in Phase 3)
- All amounts in VND with proper formatting
- Component files < 200 lines each
- Bilingual labels (vi/en)
- Mobile-first UI; form as bottom sheet or inline

## Architecture

```
WeddingState (v16)
  + expenseLog: ExpenseEntry[]
  + expenseIdCounter: number

ExpenseEntry {
  id: number
  category: string        // maps to budget category key
  description: string
  amount: number           // VND
  vendorName?: string
  date: string             // YYYY-MM-DD
  paid: boolean
}

Budget Tab (inside PanelRouter)
  -> BudgetOverview (total/spent/remaining bar)
  -> BudgetSummary (paid/unpaid/overbudget cards)
  -> CategoryBreakdown (per-category progress bars)
  -> ExpenseList (sortable, filterable list)
  -> ExpenseForm (add/edit modal or inline form)
  -> CSV export button
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `src/types/wedding.ts` | Add `ExpenseEntry` interface, add `expenseLog` + `expenseIdCounter` to `WeddingState` |
| `src/lib/migrate-state.ts` | Add v15->v16 migration (add expenseLog, expenseIdCounter) |
| `src/hooks/use-wedding-store.ts` | Add expense CRUD methods, update STORAGE_KEY to `wp_v16` |

### Files to CREATE
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/budget/expense-tracker.tsx` | Main budget page container | ~120 |
| `src/components/budget/expense-form.tsx` | Add/edit expense entry form | ~150 |
| `src/components/budget/expense-list.tsx` | Sortable expense entry list | ~150 |
| `src/components/budget/budget-overview.tsx` | Total budget vs spent bar | ~80 |
| `src/components/budget/category-breakdown.tsx` | Per-category allocation bars | ~120 |
| `src/components/budget/budget-summary.tsx` | Summary stat cards | ~80 |
| `src/data/expense-categories.ts` | Vietnamese expense category presets | ~60 |
| `src/data/expense-categories.en.ts` | English expense categories | ~60 |

## File Ownership (EXCLUSIVE)

This phase owns:
- `src/types/wedding.ts` (MODIFY -- add ExpenseEntry + 2 fields to WeddingState ONLY)
- `src/lib/migrate-state.ts` (MODIFY -- add v15->v16 migration ONLY)
- `src/hooks/use-wedding-store.ts` (MODIFY -- add expense methods + update STORAGE_KEY)
- `src/components/budget/*` (NEW -- all budget components)
- `src/data/expense-categories.ts` (NEW)
- `src/data/expense-categories.en.ts` (NEW)

No other phase may touch these files.

## Implementation Steps

### Step 1: Add ExpenseEntry type to wedding.ts

Add after existing Phase 2 types section:

```typescript
// --- Phase 3 types ---

export interface ExpenseEntry {
  id: number;
  category: string;       // budget category key
  description: string;
  amount: number;          // VND amount
  vendorName?: string;
  date: string;            // YYYY-MM-DD
  paid: boolean;
}
```

Add to WeddingState interface:
```typescript
// Phase 3 additions
expenseLog: ExpenseEntry[];
expenseIdCounter: number;
```

### Step 2: Update migrate-state.ts

Add v15->v16 migration at the top of `migrateState()`:

```typescript
const V16_KEY = "wp_v16";

export function migrateState(): void {
  if (localStorage.getItem(V16_KEY)) return;

  // v15->v16 migration: add expense tracking fields
  const v15Raw = localStorage.getItem(V15_KEY);
  if (v15Raw) {
    try {
      const v15 = JSON.parse(v15Raw);
      const v16 = {
        ...v15,
        expenseLog: v15.expenseLog ?? [],
        expenseIdCounter: v15.expenseIdCounter ?? 0,
      };
      localStorage.setItem(V16_KEY, JSON.stringify(v16));
    } catch { /* corrupt */ }
    return;
  }

  // ... existing migrations below unchanged
}
```

Update existing early return to check V16 first.

### Step 3: Update use-wedding-store.ts

Change `STORAGE_KEY` from `"wp_v15"` to `"wp_v16"`.

Add expense CRUD methods:

```typescript
const addExpense = useCallback((entry: Omit<ExpenseEntry, "id">) => {
  setState((prev) => ({
    ...prev,
    expenseIdCounter: prev.expenseIdCounter + 1,
    expenseLog: [...(prev.expenseLog || []), { ...entry, id: prev.expenseIdCounter + 1 }],
  }));
}, [setState]);

const updateExpense = useCallback((id: number, updates: Partial<ExpenseEntry>) => {
  setState((prev) => ({
    ...prev,
    expenseLog: (prev.expenseLog || []).map((e) => e.id === id ? { ...e, ...updates } : e),
  }));
}, [setState]);

const removeExpense = useCallback((id: number) => {
  setState((prev) => ({
    ...prev,
    expenseLog: (prev.expenseLog || []).filter((e) => e.id !== id),
  }));
}, [setState]);
```

Add to return object.

### Step 4: Create expense-categories.ts

`src/data/expense-categories.ts` (~60 lines):

```typescript
export interface ExpenseCategory {
  key: string;
  label: string;
  icon: string;
  defaultPercentage: number; // of total budget
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { key: "venue", label: "Nhà hàng / Địa điểm", icon: "🏛️", defaultPercentage: 30 },
  { key: "catering", label: "Tiệc / Đồ ăn", icon: "🍽️", defaultPercentage: 15 },
  { key: "photography", label: "Chụp ảnh / Quay phim", icon: "📸", defaultPercentage: 10 },
  { key: "attire", label: "Áo dài / Trang phục", icon: "👗", defaultPercentage: 8 },
  { key: "decoration", label: "Trang trí / Hoa", icon: "💐", defaultPercentage: 8 },
  { key: "ceremony-gifts", label: "Lễ vật / Sính lễ", icon: "🎁", defaultPercentage: 7 },
  { key: "invitations", label: "Thiệp mời", icon: "💌", defaultPercentage: 3 },
  { key: "entertainment", label: "Âm nhạc / MC", icon: "🎵", defaultPercentage: 5 },
  { key: "transport", label: "Xe hoa / Di chuyển", icon: "🚗", defaultPercentage: 4 },
  { key: "gifts", label: "Quà tặng khách", icon: "🎀", defaultPercentage: 3 },
  { key: "other", label: "Khác", icon: "📋", defaultPercentage: 7 },
];
```

### Step 5: Create expense-categories.en.ts

Same structure, English labels.

### Step 6: Create budget-overview.tsx

`src/components/budget/budget-overview.tsx` (~80 lines):

- Total budget bar: green portion = spent, gray = remaining
- Numbers: "150,000,000 / 200,000,000 VND"
- Percentage: "75% used"
- Overbudget warning if spent > budget
- Uses `formatMoney(amount, lang)` from `src/lib/format.ts`

### Step 7: Create budget-summary.tsx

`src/components/budget/budget-summary.tsx` (~80 lines):

3 stat cards:
- Total Paid: sum of paid expenses, green
- Total Unpaid: sum of unpaid expenses, amber
- Overbudget: max(0, totalSpent - budget), red (or hidden if within budget)

### Step 8: Create category-breakdown.tsx

`src/components/budget/category-breakdown.tsx` (~120 lines):

List of categories, each with:
- Icon + name
- Progress bar: spent / allocated
- Numbers: spent / allocated
- Allocated = budget * category percentage (from budgetOverrides or defaults)

### Step 9: Create expense-form.tsx

`src/components/budget/expense-form.tsx` (~150 lines):

Form fields:
- Category: dropdown select (from EXPENSE_CATEGORIES)
- Description: text input
- Amount: number input (VND)
- Vendor name: text input (optional)
- Date: date input (default today)
- Paid: toggle/checkbox

Mode: "add" or "edit" (controlled by parent)
Submit handler: calls `store.addExpense()` or `store.updateExpense()`
Validation: amount > 0, description non-empty

### Step 10: Create expense-list.tsx

`src/components/budget/expense-list.tsx` (~150 lines):

- Sortable by: date (default), amount, category
- Filter by: category, paid status
- Each row: date, category icon, description, amount, paid badge, edit/delete buttons
- Swipe-to-delete on mobile (optional, CSS-based)
- Empty state: "No expenses yet"

### Step 11: Create expense-tracker.tsx (container)

`src/components/budget/expense-tracker.tsx` (~120 lines):

Main container that composes all budget components:
```typescript
interface ExpenseTrackerProps {
  state: WeddingState;
  store: WeddingStore;
}

export function ExpenseTracker({ state, store }: ExpenseTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // ... compose BudgetOverview, BudgetSummary, CategoryBreakdown, ExpenseList, ExpenseForm
}
```

Quick-add FAB: fixed bottom-right button (above bottom nav), opens form.
CSV export button in header area.

### Step 12: Wire into PanelRouter

The expense tracker needs to be accessible from Planning section. The existing `PanelRouter` already handles tab routing within Planning. Add ExpenseTracker as a new tab.

**Note:** `src/components/wedding/panel-router.tsx` and `src/components/wedding/tab-navigation.tsx` are NOT owned by any other phase. Phase 05 can safely modify them to add the budget tab.

Update `tab-navigation.tsx` to include "Budget" tab label.
Update `panel-router.tsx` to render `<ExpenseTracker>` at the budget tab index.

### Step 13: CSV export

Add CSV export button in expense-tracker.tsx:
- Format: Date, Category, Description, Vendor, Amount, Paid
- Use same formula-injection prevention as gift-csv-export.tsx
- Filename: `wedding-expenses-YYYY-MM-DD.csv`

### Step 14: Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Todo List

- [ ] Add `ExpenseEntry` type to wedding.ts
- [ ] Add `expenseLog` + `expenseIdCounter` to WeddingState
- [ ] Add v15->v16 migration to migrate-state.ts
- [ ] Update STORAGE_KEY to `wp_v16` in use-wedding-store.ts
- [ ] Add expense CRUD methods to store
- [ ] Create `expense-categories.ts` (vi)
- [ ] Create `expense-categories.en.ts` (en)
- [ ] Create `budget-overview.tsx`
- [ ] Create `budget-summary.tsx`
- [ ] Create `category-breakdown.tsx`
- [ ] Create `expense-form.tsx`
- [ ] Create `expense-list.tsx`
- [ ] Create `expense-tracker.tsx` (container)
- [ ] Wire into PanelRouter as budget tab
- [ ] Add CSV export
- [ ] Verify tsc + lint + build

## Success Criteria

- State migration v15->v16 works: existing users keep data, new fields added
- Can add, edit, delete expense entries
- Budget overview shows correct totals
- Category breakdown shows per-category spent vs allocated
- Summary cards show paid/unpaid/overbudget
- CSV export downloads valid file
- All amounts formatted in VND
- All labels bilingual
- All files < 200 lines

## Conflict Prevention

- **wedding.ts**: ONLY add `ExpenseEntry` interface + 2 fields to WeddingState. Do not modify existing types.
- **migrate-state.ts**: ONLY add V16 constant and v15->v16 migration block. Do not modify existing migrations.
- **use-wedding-store.ts**: ONLY change STORAGE_KEY and add 3 expense methods. Do not modify existing methods.
- **panel-router.tsx / tab-navigation.tsx**: Add budget tab entry. Do not reorganize existing tabs.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| State migration breaks existing data | HIGH | V16 migration is additive only (new fields with defaults). Test with V15 data. |
| STORAGE_KEY change causes data loss | HIGH | Migration runs before store init (line 10 of use-wedding-store.ts). V15->V16 copies all data. |
| Expense form complex on mobile | Med | Keep form simple: 6 fields max. Use bottom sheet pattern. |
| Category allocation doesn't match actual spending | Low | Show "suggested" allocation; let users override via budgetOverrides |

## Security Considerations

- All data in localStorage; no server interaction
- CSV export: prevent formula injection (prefix `=`, `+`, `@`, `-` with `'`)
- Number input validation: prevent NaN, negative amounts
- No file uploads or external data

## Next Steps

- Phase 07 ensures budget components use theme variables consistently
- Future: receipt photo attachment (requires Vercel Blob, deferred)
- Future: expense charts (v2, deferred per YAGNI)
