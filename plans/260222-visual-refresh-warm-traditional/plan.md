---
title: "Visual Refresh: Warm & Traditional"
description: "Full visual polish — theme wiring, card unification, font cleanup, shadcn integration, controls"
status: completed
priority: P1
effort: 3h
branch: master
tags: [ui, ux, visual-refresh, theme, polish]
created: 2026-02-22
---

# Visual Refresh: Warm & Traditional

## Summary
Full visual refresh across 5 pillars: theme system overhaul, card pattern unification, font scale consolidation, shadcn --primary integration, interactive controls unification. Target aesthetic: warm & traditional (Vietnamese wedding invitation feel).

## Brainstorm Report
- [Brainstorm Report](./reports/brainstorm-report.md)

## Phases

| # | Phase | Status | Effort | Files |
|---|-------|--------|--------|-------|
| 1 | [Theme Foundation](./phase-01-theme-foundation.md) | done | 30m | 3 |
| 2 | [Card & Color Migration](./phase-02-card-color-migration.md) | done | 60m | 13 |
| 3 | [Font & Controls Cleanup](./phase-03-font-controls-cleanup.md) | done | 45m | 20 |
| 4 | [Print Panel Adaptation](./phase-04-print-panel.md) | done | 15m | 2 |
| 5 | [Build Verify & QA](./phase-05-build-verify.md) | done | 10m | 0 |

## Key Dependencies
- Phase 1 must complete first (defines CSS vars all others consume)
- Phases 2 & 3 can run in parallel after Phase 1
- Phase 4 depends on Phase 2 (same patterns, but print-specific)
- Phase 5 runs last

## Architecture
```
themes.ts (data) → App.tsx (CSS vars) → index.css (utilities)
                                          ↓
                              All components consume vars
```

## Risks
- Print panel may need `bg-white` retained for print compatibility
- HSL conversion is one-time math, low risk
- Touching 15+ files = visual regression risk, needs side-by-side check
