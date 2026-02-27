---
title: "Phase 2: Six Feature Implementation"
description: "Countdown, Timeline, Website, Gifts, Photo Wall, Task Board"
status: complete
priority: P1
effort: ~15-20 days total
branch: master
tags: [phase-2, features, parallel]
created: 2026-02-28
completed: 2026-02-28
---

# Phase 2: Six Feature Implementation

## Dependency Graph

```
Phase 01 ─ Foundation (SEQUENTIAL FIRST)
  │
  ├──> Phase 02 ─ Countdown + Reminders      ─┐
  ├──> Phase 03 ─ Wedding Day Timeline        ─┤
  ├──> Phase 04 ─ Gift/Cash Tracker           ─┤  ALL PARALLEL
  ├──> Phase 05 ─ Guest Photo Wall            ─┤
  ├──> Phase 06 ─ Collaborative Task Board    ─┤
  └──> Phase 07 ─ Wedding Website             ─┘
```

## File Ownership Matrix

| Phase | Owns (creates/edits) |
|-------|---------------------|
| 01 Foundation | `src/types/wedding.ts`, `src/data/backgrounds.ts`, `src/lib/migrate-state.ts`, `src/db/schema.ts`, `src/hooks/use-wedding-store.ts`, `src/main.tsx`, `src/lib/i18n-translations.ts`, `src/data/page-definitions.ts`, `src/pages/page-router.tsx`, `src/components/wedding/panel-router.tsx`, `package.json` |
| 02 Countdown | `src/components/countdown/*`, `src/data/reminder-definitions.ts` |
| 03 Timeline | `src/components/timeline/*`, `src/data/timeline-templates.ts`, `src/pages/timeline-page.tsx` |
| 04 Gifts | `src/components/gifts/*`, `src/pages/gift-page.tsx` |
| 05 Photos | `src/components/photo-wall/*`, `src/pages/photo-upload-page.tsx`, `api/photos.ts`, `api/photos/*.ts` |
| 06 Tasks | `src/components/tasks/*`, `src/pages/task-landing-page.tsx`, `api/tasks.ts`, `api/tasks/*.ts` |
| 07 Website | `src/components/website/*`, `src/pages/wedding-website-page.tsx`, `api/website.ts` |

## Phase Summary

| # | Feature | Effort | Status |
|---|---------|--------|--------|
| 01 | Foundation (types, store, routes, migration, DB, i18n) | 1-2d | complete |
| 02 | Countdown + Smart Reminders | 1-2d | complete |
| 03 | Wedding Day Timeline | 2-3d | complete |
| 04 | Gift/Cash Tracker (Phong Bi) | 1-2d | complete |
| 05 | Guest Photo Wall | 3-4d | complete |
| 06 | Collaborative Task Board | 3-4d | complete |
| 07 | Wedding Website | 2-3d | complete |

## Execution Strategy

1. Complete Phase 01 first -- touches all shared files, defines contracts
2. Run Phases 02-07 in parallel -- each phase exclusively owns its files
3. No phase 02-07 may edit files owned by Phase 01
4. State migration: wp_v14 -> wp_v15 (single migration in Phase 01)
5. DB migration: 2 new tables (wedding_photos, wedding_tasks) in Phase 01
6. New deps: `@vercel/blob` for photo storage

## Key Architecture Decisions

- Hash routes for all new pages (`#/w/:slug`, `#/photos/:token`, `#/tasks/:token`)
- Token-based auth for task board + photo wall (reuse RSVP nanoid pattern)
- Toast-based reminders v1 (no PWA push notifications)
- Countdown, timeline, gifts integrated as new tabs in planning page
- Photo wall + task board have both couple dashboard + guest landing pages
