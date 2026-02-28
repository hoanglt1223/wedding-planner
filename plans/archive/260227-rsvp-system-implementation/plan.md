---
title: "RSVP System"
description: "Guest-facing RSVP landing page with unique links, QR codes, and planner dashboard"
status: complete
priority: P1
effort: "8-10h"
branch: master
tags: [rsvp, guests, database, api, frontend]
created: 2026-02-27
completed: 2026-02-27
---

# RSVP System — Implementation Plan

## Summary

Add digital RSVP: per-guest unique links, themed landing page, one-time response form, planner dashboard with stats/QR/export. All data in PostgreSQL (no Redis). State version bump wp_v13 to wp_v14.

## New Dependencies

- `nanoid` — 12-char URL-safe token generation
- `qrcode` — client-side QR code canvas rendering

## Phases

| # | Phase | File | Status | Effort |
|---|-------|------|--------|--------|
| 1 | Database Schema + Migration | [phase-01](./phase-01-database-schema-migration.md) | complete | 1.5h |
| 2 | API Endpoints (4 routes) | [phase-02](./phase-02-api-endpoints.md) | complete | 2h |
| 3 | Guest RSVP Landing Page | [phase-03](./phase-03-guest-rsvp-landing-page.md) | complete | 2.5h |
| 4 | Planner RSVP Dashboard | [phase-04](./phase-04-planner-rsvp-dashboard.md) | complete | 2.5h |
| 5 | Integration Testing | [phase-05](./phase-05-integration-testing.md) | complete | 1h |

## Dependency Graph

```
Phase 1 (DB + State) ──┬──> Phase 2 (API)
                        │       │
                        │       ├──> Phase 3 (Guest Page)
                        │       └──> Phase 4 (Dashboard)
                        │                │
                        └────────────────┴──> Phase 5 (Testing)
```

## Key Decisions

- **PostgreSQL only** — no Redis involvement; permanent data, queryable
- **Token = auth** — 12-char nanoid is unguessable; no login needed for guests
- **One-time submit** — `responded_at IS NOT NULL` guard; no edits after submit
- **Theme passthrough** — planner's `themeId` stored in API response, applied on guest page
- **i18n** — bilingual vi/en; guest page language from planner's `lang` setting
- **No email/SMS** — links distributed manually via copy/QR

## Excluded (YAGNI)

No deadline enforcement, no guest auth, no real-time updates, no image uploads, no map embed (link only), no email/SMS sending.

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Neon free tier row limits | Thousands of RSVP rows well within limits |
| Token collision | 12-char nanoid = 10^21 combinations; negligible risk |
| Orphaned tokens | Tokens tied to userId; no cleanup needed |
| Large QR batch render | Canvas rendering is client-side; lazy-load per guest |

## Reports

- [Brainstorm Report](./reports/brainstorm-report.md)
