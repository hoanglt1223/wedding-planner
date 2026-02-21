---
title: "Convert wedding-planner.html to React + TypeScript + shadcn/ui"
description: "Parallel-optimized plan to convert 304-line Vietnamese wedding planner SPA into React component architecture"
status: completed
priority: P1
effort: 12h
branch: master
tags: [frontend, react, conversion, shadcn-ui, vietnamese]
created: 2026-02-21
---

# Convert wedding-planner.html to React + shadcn/ui

## Dependency Graph

```
Group A (parallel, no deps):
  Phase 01: Types + Data Constants
  Phase 02: Hooks + Utilities
  Phase 03: Install shadcn components

Group B (parallel, depends on ALL of Group A):
  Phase 04: Wedding Step Components
  Phase 05: Budget + Guest Components
  Phase 06: Cards + AI + Print + Ideas Components

Group C (sequential, depends on ALL of Group B):
  Phase 07: App Integration + Layout + API + CSS

Group D (sequential, depends on Phase 07):
  Phase 08: Polish + Print Styles + Responsive
```

## Execution Strategy

- **Group A**: 3 agents in parallel (~1.5h each)
- **Group B**: 3 agents in parallel (~2.5h each) -- start after Group A completes
- **Group C**: 1 agent sequential (~2h) -- wires everything together
- **Group D**: 1 agent sequential (~1h) -- print CSS, mobile tweaks, compile check

## File Ownership Matrix

| Phase | Owns (exclusive) |
|-------|-----------------|
| 01 | `src/types/wedding.ts`, `src/data/*` (8 step files + 4 data files) |
| 02 | `src/hooks/use-local-storage.ts`, `src/hooks/use-wedding-store.ts`, `src/lib/format.ts`, `src/lib/csv.ts`, `src/lib/markdown.ts` |
| 03 | `src/components/ui/tabs.tsx`, `ui/table.tsx`, `ui/progress.tsx`, `ui/scroll-area.tsx`, `ui/slider.tsx`, `ui/textarea.tsx` |
| 04 | `src/components/wedding/*` (7 files) |
| 05 | `src/components/budget/*` (2 files), `src/components/guests/*` (2 files) |
| 06 | `src/components/cards/*` (4 files), `src/components/ai/*` (2 files), `src/components/print/*`, `src/components/ideas/*` |
| 07 | `src/App.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `api/ai/chat.ts` |
| 08 | `src/index.css` (additions only), `src/components/layout/root-layout.tsx` |

## Phase Summary

| # | Phase | Status | Effort | Depends On |
|---|-------|--------|--------|------------|
| 01 | [Types + Data Constants](./phase-01-types-and-data.md) | completed | 1.5h | -- |
| 02 | [Hooks + Utilities](./phase-02-hooks-and-utils.md) | completed | 1.5h | -- |
| 03 | [Install shadcn Components](./phase-03-install-shadcn.md) | completed | 0.5h | -- |
| 04 | [Wedding Step Components](./phase-04-wedding-steps.md) | completed | 2.5h | 01,02,03 |
| 05 | [Budget + Guest Components](./phase-05-budget-guests.md) | completed | 2.5h | 01,02,03 |
| 06 | [Cards + AI + Print + Ideas](./phase-06-cards-ai-print-ideas.md) | completed | 2.5h | 01,02,03 |
| 07 | [App Integration + Layout + API](./phase-07-app-integration.md) | completed | 2h | 04,05,06 |
| 08 | [Polish + Print + Responsive](./phase-08-polish-responsive.md) | completed | 1h | 07 |
