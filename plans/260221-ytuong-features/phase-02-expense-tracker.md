# Phase 2: Real Expense Tracker

## Overview
Extend the budget system to track actual spending per category vs planned budget.

## Files to Modify
- `src/types/wedding.ts` - Add `exp` field to WeddingState
- `src/data/backgrounds.ts` - Add `exp: {}` to DEFAULT_STATE
- `src/hooks/use-wedding-store.ts` - Add `setExpense` callback
- `src/components/budget/budget-panel.tsx` - Add expense summary section
- `src/components/budget/budget-category-row.tsx` - Add expense input per row

## Implementation Steps

### 1. Modify `src/types/wedding.ts`
Add to WeddingState interface:
```ts
exp: Record<string, number>;  // actual expenses by category key
```

### 2. Modify `src/data/backgrounds.ts`
Add to DEFAULT_STATE:
```ts
exp: {},
```

### 3. Modify `src/hooks/use-wedding-store.ts`
Add callback:
```ts
const setExpense = useCallback((key: string, amount: number) => {
  setState((prev) => ({
    ...prev,
    exp: { ...prev.exp, [key]: amount },
  }));
}, [setState]);
```
Return `setExpense` in the hook return object.

### 4. Modify `src/components/budget/budget-category-row.tsx`
- Add props: `expense: number`, `onExpenseChange: (key: string, amount: number) => void`
- Add inline expense input after the percentage section
- Show planned vs actual: green if under, red if over
- Format: compact input with "đã chi" label

### 5. Modify `src/components/budget/budget-panel.tsx`
- Accept new props: `expenses: Record<string, number>`, `onSetExpense: (key: string, amount: number) => void`
- Pass expense data to BudgetCategoryRow
- Add summary section at bottom: total planned vs total actual
- Show overspend warning if actual > planned

### 6. Update `src/components/wedding/panel-router.tsx`
- Pass `expenses` and `onSetExpense` props to BudgetPanel
- Read from `state.exp` and use `store.setExpense`

## Success Criteria
- Each budget category has an expense input field
- Actual vs planned comparison shown per category
- Total actual spending summary at bottom
- Over-budget warnings in red
- Data persists in localStorage
