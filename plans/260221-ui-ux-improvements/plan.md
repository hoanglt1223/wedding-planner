---
title: "UI/UX Improvements — 10 Issues"
description: "Parallel-optimized plan fixing header, nav, empty states, background consistency, card overflow, Tu Vi, footer"
status: pending
priority: P1
effort: 8h
branch: master
tags: [ui-ux, navigation, layout, polish]
created: 2026-02-21
---

# UI/UX Improvements Plan

## Execution Strategy

Phase 1 runs first (layout foundation). Phases 2-5 run in parallel after Phase 1 completes.

```
Phase 1 ─── Header + Navbar Redesign (BLOCKING)
  |
  ├── Phase 2 ─── Sub-tab Navigation
  ├── Phase 3 ─── Empty States
  ├── Phase 4 ─── Page Background Consistency
  └── Phase 5 ─── Card Overflow + Tu Vi + Footer
```

## File Ownership Matrix

No file appears in more than one phase. Conflict-free parallel execution guaranteed.

| Phase | Exclusive Files |
|-------|----------------|
| 1 | `header.tsx`, `topbar.tsx`, `App.tsx`, `reminders.tsx` |
| 2 | `scrollable-tab-bar.tsx`, `tab-navigation.tsx` |
| 3 | `guest-panel.tsx`, `budget-panel.tsx`, `notes-panel.tsx`, `vendor-panel.tsx` |
| 4 | `ai-panel.tsx`, `ideas-panel.tsx`, `cards-panel.tsx`, `rsvp-section.tsx`, `photo-board.tsx` |
| 5 | `background-grid.tsx`, `invitation-grid.tsx`, `astrology-page.tsx`, `footer.tsx`, `theme-picker.tsx` |

## Phase Summary

| # | Name | Issues | Effort | Status |
|---|------|--------|--------|--------|
| 1 | [Header + Navbar Redesign](phase-01-header-navbar-redesign.md) | #1,#2,#4,#7 | 2.5h | pending |
| 2 | [Sub-tab Navigation](phase-02-subtab-navigation.md) | #3 | 1h | pending |
| 3 | [Empty States](phase-03-empty-states.md) | #5 | 1.5h | pending |
| 4 | [Page Background Consistency](phase-04-page-background-consistency.md) | #6 | 1.5h | pending |
| 5 | [Card Overflow + Tu Vi + Footer](phase-05-card-overflow-tuvi-footer.md) | #8,#9,#10 | 1.5h | pending |

## Key Dependencies

- Phase 1 changes `App.tsx` layout (removes Header component gap, adjusts Topbar position) — all other phases depend on stable layout shell
- Phases 2-5 touch only leaf components inside the page content area, no layout interaction
- No shared utility files across phases

## Research References

- [UI/UX Audit](reports/260221-ui-ux-audit-brainstorm.md)
- [SaaS Nav Patterns](research/researcher-01-saas-nav-patterns.md)
- [Scout File Inventory](scout/scout-codebase-report.md)
