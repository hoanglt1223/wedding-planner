---
title: "Migrate hash routing to TanStack Router"
description: "Replace hand-rolled hash-based routing with TanStack Router for type-safe, deep-linkable URLs"
status: pending
priority: P1
effort: 6h
branch: feature/lunar
tags: [routing, tanstack-router, migration, spa]
created: 2026-03-22
---

# TanStack Router Migration Plan

## Context
- Brainstorm report: `plans/reports/brainstorm-260322-2222-routing-migration.md`
- Current: hash routing in `src/main.tsx` (8 routes) + `state.page` switching in `src/pages/page-router.tsx` (11 pages)
- ~33 hash refs across 14 files, `state.page` used in 5 files
- Vercel SPA rewrite already configured (`/:path*` -> `/index.html`)

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Install + route tree scaffold](phase-01-install-and-route-tree.md) | pending | 1.5h |
| 2 | [App layout route + child routes](phase-02-app-layout-and-children.md) | pending | 2h |
| 3 | [Update hash refs + navigation](phase-03-update-navigation-refs.md) | pending | 1.5h |
| 4 | [Remove state.page + backward compat](phase-04-cleanup-and-compat.md) | pending | 1h |

## Key Decisions
- Code-based route tree (not file-based) -- less tooling, simpler for this project size
- `lazyRouteComponent()` for heavy pages (admin, tasks, website, wedding-website, photo-upload, task-landing)
- Navigation components (`LeftSidebar`, `BottomNav`, `QuickActions`) switch from `onPageChange(id)` callback to TanStack `<Link>` / `useNavigate()`
- `state.page` removed from `WeddingState`; URL is source of truth for active page
- Hash-to-pathname redirect script in `main.tsx` for bookmark backward compat

## Dependencies
- `@tanstack/react-router` (latest, ~v1.x)
- `@tanstack/react-router-devtools` (dev only)
- No file-based plugin needed (code-based routing)
