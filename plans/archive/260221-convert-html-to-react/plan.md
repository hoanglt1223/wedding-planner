# Convert wedding-planner.html to React App

## Status: IN PROGRESS

## Overview
Convert the 305-line HTML prototype into a proper React + TypeScript + shadcn/ui application.
All features from the HTML prototype must be replicated with proper component architecture.

## Dependency Graph
```
Phase 1 (Foundation) → Phase 2a, 2b, 2c, 2d (PARALLEL)
```

## Phases

| Phase | Description | Status | Depends On |
|-------|-------------|--------|------------|
| 1 | Foundation: types, data, hooks, utils | pending | - |
| 2a | App shell: header, stats, tabs, App.tsx | pending | 1 |
| 2b | Wedding step components (7 steps) | pending | 1 |
| 2c | Budget + Guest List pages | pending | 1 |
| 2d | BG/Thiep + AI + Print + Ideas pages | pending | 1 |

## File Ownership Matrix

### Phase 1 (Foundation)
- `src/types/wedding.ts` - all TypeScript interfaces
- `src/data/wedding-steps.ts` - wedding ceremony data constants
- `src/data/budget-categories.ts` - budget category definitions
- `src/data/ai-prompts.ts` - AI prompt templates
- `src/hooks/use-wedding-store.ts` - localStorage-backed state
- `src/lib/format.ts` - number/currency formatting

### Phase 2a (App Shell)
- `src/App.tsx` - MODIFY: tab switching, state wiring
- `src/components/layout/header.tsx` - MODIFY: progress bar, couple names
- `src/components/layout/footer.tsx` - MODIFY if needed
- `src/components/layout/stats-grid.tsx` - CREATE: 4-stat overview
- `src/components/layout/tab-nav.tsx` - CREATE: scrollable tabs

### Phase 2b (Wedding Steps)
- `src/components/wedding/step-panel.tsx` - full step panel container
- `src/components/wedding/ceremony-card.tsx` - ceremony with sub-tabs
- `src/components/wedding/checklist.tsx` - interactive checklist items
- `src/components/wedding/timeline-steps.tsx` - ceremony procedure
- `src/components/wedding/people-grid.tsx` - who's present grid
- `src/components/wedding/offerings-table.tsx` - lễ vật table
- `src/components/wedding/tips-list.tsx` - tips/notes list

### Phase 2c (Budget + Guests)
- `src/pages/budget-page.tsx` - budget management with category bars
- `src/pages/guest-list-page.tsx` - guest CRUD, search, CSV import/export

### Phase 2d (BG/Thiep + AI + Print + Ideas)
- `src/pages/backgrounds-page.tsx` - background & invitation card templates
- `src/pages/ai-assistant-page.tsx` - AI chat with ZhipuAI
- `src/pages/print-page.tsx` - print handbook
- `src/pages/ideas-page.tsx` - future feature ideas
