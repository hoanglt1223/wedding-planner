# RSVP System — Brainstorm Report

**Date:** 2026-02-27
**Status:** Approved → Ready for implementation planning

## Problem Statement

Current "RSVP" feature is just a copyable invitation text. No guest response tracking, no digital response form, no persistent links. Guests cannot confirm attendance digitally.

## Requirements (User-Selected)

- **Persistence:** PostgreSQL (permanent, queryable)
- **Guest identity:** Unique link per guest (pre-filled name, one-click confirm)
- **Response fields:** Attendance + Plus-ones + Dietary + Message
- **Guest page:** Full landing page (hero, event details, couple story, form)
- **Customization:** Planner edits welcome message, venue, address, couple story
- **Dashboard:** New tab in Guest panel with stats, response table, QR codes
- **Link distribution:** Bulk generate + copy list + QR codes per guest
- **Edit policy:** One-time response only (no edits after submit)
- **Routing:** Hash-based SPA (`#/rsvp/:token`), Vercel compatible

## Architecture

### Database — `rsvp_invitations` table

| Column | Type | Purpose |
|--------|------|---------|
| id | serial PK | Auto ID |
| user_id | text | Planner's anonymous UUID |
| guest_name | text | Guest name from list |
| token | text unique indexed | 12-char nanoid URL token |
| status | text | pending/accepted/declined |
| plus_ones | integer | Additional guests (default 0) |
| dietary | text | Restrictions/allergies |
| message | text | Congratulatory message |
| responded_at | timestamp | When responded (null=pending) |
| created_at | timestamp | When link generated |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| POST /api/rsvp | POST | Bulk-create invitation tokens |
| GET /api/rsvp?token=X | GET | Fetch invitation for guest page |
| POST /api/rsvp/respond | POST | Submit response (one-time) |
| GET /api/rsvp/list?userId=X | GET | Fetch all invitations for dashboard |

### New Route

`#/rsvp/:token` → `RsvpLandingPage`

### Guest-Facing Page Sections

1. Hero — couple names, date, welcome message, themed bg
2. Event details — venue, address, time, map link
3. Couple story — optional custom text
4. RSVP form — pre-filled name, attend radio, plus-ones, dietary, message
5. Already responded — thank you + response summary
6. Footer — attribution + CTA

### Planner State Changes

New `rsvpSettings` in WeddingState:
- welcomeMessage, venue, venueAddress, venueMapLink, coupleStory

Guest model: add `rsvpToken?: string` for local linking

### New Guest Panel Tab: "RSVP"

- Settings form (welcome msg, venue, etc.)
- Generate links button (bulk)
- Response dashboard table
- Stats bar (accepted/declined/pending)
- QR code per guest (client-side `qrcode` lib)
- CSV export + copy-all-links

### Tech Stack

- Token: 12-char nanoid (URL-safe)
- QR: `qrcode` npm package (client-side canvas)
- One-time guard: `responded_at IS NOT NULL`
- Theme: planner's themeId passed via API
- i18n: bilingual vi/en

## Excluded (YAGNI)

- No email/SMS sending
- No deadline enforcement
- No guest authentication
- No real-time updates
- No image uploads
- No map embed (just link)

## Dependencies

- `nanoid` — token generation
- `qrcode` — QR code rendering

## Risk Assessment

- **Redis not needed** — all RSVP data in PostgreSQL, avoids TTL complexity
- **Neon free tier** — should handle thousands of rows easily
- **No auth on guest page** — token is the auth; 12-char nanoid is unguessable
- **One-time submit** — prevents spam, simplifies logic
- **Migration** — new WeddingState fields need wp_v13 → wp_v14 migration
