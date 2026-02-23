---
title: "User Data Tracking & Admin Panel"
description: "Anonymous user sync, event tracking, and custom admin dashboard with shadcn/ui"
status: done
priority: P1
effort: 16h
branch: master
tags: [tracking, analytics, admin, database]
created: 2026-02-23
completed: 2026-02-23
---

# User Data Tracking & Admin Panel

## Goal
Track anonymous user activity, sync wedding planning state to DB, and provide an admin dashboard for monitoring usage, user data, and system health.

## Architecture
- Anonymous UUID per user (localStorage) synced to Neon PostgreSQL
- Hybrid storage: full JSON blob + extracted columns for query performance
- Custom event tracking (own DB, no third-party analytics)
- Custom admin panel at `#/admin` with shadcn/ui, lazy-loaded
- Admin auth: env var password + httpOnly session cookie
- All endpoints on Vercel serverless

## Phases

| # | Phase | Effort | Status |
|---|-------|--------|--------|
| 1 | [DB Schema & Sync](./phase-01-db-schema-and-sync.md) | 4h | done |
| 2 | [Event Tracking](./phase-02-event-tracking.md) | 3h | done |
| 3 | [Admin Auth & Layout](./phase-03-admin-auth-and-layout.md) | 4h | done |
| 4 | [Admin Dashboard & CRUD](./phase-04-admin-dashboard-and-crud.md) | 5h | done |

## Dependencies
- Phase 2 depends on Phase 1 (user_sessions table + useUserId hook)
- Phase 3 depends on Phase 1 (admin_sessions table)
- Phase 4 depends on Phases 1-3 (all tables + admin auth + admin shell)

## New Environment Variables
- `ADMIN_PASSWORD` -- admin login password

## Key Decisions
- Hash-based admin routing (`#/admin`) -- consistent with existing `#/app`, `#/shared/` pattern in main.tsx
- sendBeacon on page unload for reliable sync
- Debounced sync (5s) to avoid excessive writes
- No Zustand/Redux -- uses existing useLocalStorage pattern
- Rate-limited sync endpoint (30 req/min per user)

## Risk Summary
- sendBeacon may be blocked by some browsers -- mitigated by visibility/heartbeat fallbacks
- Admin password in env var is basic -- acceptable for MVP, upgrade to OAuth later if needed
- Large wedding_data JSON blobs -- mitigated by 50KB size guard on sync endpoint
