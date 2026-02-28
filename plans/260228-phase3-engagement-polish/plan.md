---
title: "Phase 3: Engagement + Polish"
description: "Navigation redesign, PWA shell, budget tracker, onboarding revamp, and progress gamification"
status: complete
priority: P1
effort: 28h
branch: master
tags: [navigation, pwa, budget, onboarding, ux, phase-3]
created: 2026-02-28
completed: 2026-02-28
---

# Phase 3: Engagement + Polish

## Goals

1. Mobile-first bottom nav (5 sections) replacing horizontal tab scroll
2. Production PWA with offline shell and install prompt
3. Budget & expense tracker (highest-engagement feature)
4. Onboarding revamp + milestone badge system

## Constraints

- Zero new API endpoints (8/12 Vercel Hobby limit)
- Pure frontend work; all data in localStorage
- State migration: v15 -> v16 (Phase 05 only)
- Max 200 lines/file, kebab-case naming, bilingual vi/en

## Dependency Graph

```
Phase 01 (PWA)  ──────────────────────────────────────┐
Phase 02 (Nav Architecture) ──┐                        │
                               ├─ Phase 03 (Sections) ─┤
                                      ├─ Phase 04 (Home Dashboard) ─┐
                                      ├─ Phase 05 (Budget)          ├─ Phase 07 (Polish)
                                      └─ Phase 06 (Onboarding)     ─┘
```

**Execution:** 01+02 parallel -> 03 -> 04+05+06 parallel -> 07

## Phase Summary

| # | Phase | Effort | Parallel Group | Status |
|---|-------|--------|---------------|--------|
| 01 | [PWA Infrastructure](phase-01-pwa-infrastructure.md) | 3h | A | complete |
| 02 | [Navigation Architecture](phase-02-navigation-architecture.md) | 4h | A | complete |
| 03 | [Section Page Containers](phase-03-section-page-containers.md) | 5h | B (sequential) | complete |
| 04 | [Home Dashboard](phase-04-home-dashboard.md) | 4h | C | complete |
| 05 | [Budget & Expense Tracker](phase-05-budget-expense-tracker.md) | 5h | C | complete |
| 06 | [Onboarding + Progress](phase-06-onboarding-progress.md) | 4h | C | complete |
| 07 | [Polish + Integration](phase-07-polish-integration.md) | 3h | D (sequential) | complete |

## File Ownership Matrix

| File | Owner Phase | Action |
|------|-------------|--------|
| `vite.config.ts` | 01 | MODIFY (PWA plugin) |
| `src/main.tsx` | 01 | MODIFY (remove old SW) |
| `src/hooks/use-online-status.ts` | 01 | NEW |
| `src/components/pwa/*` | 01 | MODIFY/NEW |
| `src/components/layout/bottom-nav.tsx` | 02 | NEW |
| `src/components/layout/menu-drawer.tsx` | 02 | NEW |
| `src/components/layout/header.tsx` | 02 | MODIFY |
| `src/data/page-definitions.ts` | 02 | MODIFY |
| `src/data/nav-sections.ts` | 02 | NEW |
| `src/pages/home-page.tsx` | 03 | NEW |
| `src/pages/guests-page.tsx` | 03 | NEW |
| `src/pages/tools-page.tsx` | 03 | NEW |
| `src/pages/page-router.tsx` | 03 | MODIFY |
| `src/pages/planning-page.tsx` | 03 | MODIFY |
| `src/App.tsx` | 03 | MODIFY |
| `src/components/layout/footer.tsx` | 03 | MODIFY |
| `src/components/home/*` | 04 | NEW |
| `src/data/daily-tips*.ts` | 04 | NEW |
| `src/types/wedding.ts` | 05 | MODIFY |
| `src/lib/migrate-state.ts` | 05 | MODIFY |
| `src/components/budget/*` | 05 | NEW |
| `src/data/expense-categories*.ts` | 05 | NEW |
| `src/hooks/use-wedding-store.ts` | 05 | MODIFY |
| `src/components/onboarding/*` | 06 | MODIFY |
| `src/components/progress/*` | 06 | NEW |
| `src/data/badges*.ts` | 06 | NEW |
| `src/lib/progress-calculator.ts` | 06 | NEW |
| `src/index.css` | 07 | MODIFY |
