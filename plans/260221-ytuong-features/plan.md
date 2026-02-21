# Y Tuong Features Implementation Plan

## Overview
Implement 4 features from the Ideas page as client-side only enhancements.

## Phases (Parallel Execution)

| Phase | Feature | Status | Files |
|-------|---------|--------|-------|
| 1 | Countdown Timer | pending | header.tsx, App.tsx, countdown.ts |
| 2 | Real Expense Tracker | pending | wedding.ts, backgrounds.ts, use-wedding-store.ts, budget-panel.tsx, budget-category-row.tsx |
| 3 | Data Export/Import + Ideas Redesign | pending | export.ts, ideas-panel.tsx, ideas.ts, page-router.tsx |

## Dependency Graph
- Phase 1, 2, 3: **ALL PARALLEL** (no file conflicts)
- Phase 2 touches state types but Phase 1 only reads existing state fields

## Execution Strategy
- Launch 3 fullstack-developer agents simultaneously
- Each owns a distinct set of files (no overlap)
