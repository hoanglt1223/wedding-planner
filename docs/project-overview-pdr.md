# Wedding Planner - Product Development Requirements

## Project Overview

Wedding Planner is a full-stack web application for managing wedding events, guest lists, timelines, budgets, and vendor coordination. Built with modern technologies for scalability, performance, and developer productivity.

## Current Status

Phase 2: Core Planning Features Complete. All six features operational (Countdown, Timeline, Gifts, Photos, Tasks, Website) with full Vietnamese/English support and Vercel Blob integration.

## Core Objectives

1. Provide intuitive wedding planning interface for couples
2. Enable real-time collaboration and data synchronization
3. Support vendor and guest management workflows
4. Track budgets, timelines, and event logistics
5. Generate reports and export capabilities

## Tech Stack (Confirmed)

| Layer | Technology |
|-------|-----------|
| Frontend | Vite 7.3.1 + React 19.2.4 + TypeScript 5.9.3 |
| Styling | Tailwind CSS v4.2.0 (CSS-first) + shadcn/ui 3.8.5 |
| Backend | Vercel Serverless Functions |
| Database | Neon PostgreSQL + Drizzle ORM 0.45.1 |
| Cache | Upstash Redis 1.36.2 |
| Deployment | Vercel |

## Functional Requirements

### Completed Features

**Phase 1: Wedding Content & Internationalization**

**Vietnamese Wedding Content**
- 8-phase ceremony structure with 40+ ceremony steps
- Regional variations (North/Central/South Vietnam)
- Detailed step guides with cultural significance, tips, common mistakes
- 33 traditional items checklist (per-phase, regional quantity variants)
- 7 family role cards with per-phase responsibilities
- 5 etiquette rules with regional notes
- Auspicious date picker (lunar calendar + Hoàng Đạo/Hắc Đạo, Tam Nương, Nguyệt Kỵ, Ngũ Hành)

**Astrology Features**
- Birth data input (date, hour, gender) for both bride and groom
- 12 zodiac profiles with personality traits and compatibility
- 5 element profiles (Wood, Fire, Earth, Metal, Water)
- Yearly forecasts for 2026
- AI-powered astrological readings (ZhipuAI glm-5, server-side)
- Redis caching (300-day TTL) and rate limiting (5 req/IP/day)

**Internationalization**
- English and Vietnamese full translation coverage
- Language-aware data loading (26 .en.ts files)
- Format utilities per language (currency, numbers)
- Language toggle in Settings

**RSVP System**
- Guest-facing RSVP landing pages at #/rsvp/:token
- Planner RSVP dashboard with link generation, QR codes, CSV export
- Atomic one-time response guard
- Rate limiting and security features

**Theming**
- 4 pre-configured themes (Traditional Red, Blush Pink, Navy Blue, Sage Green)
- Dynamic CSS variable application

---

**Phase 2: Core Planning Features**

**Countdown + Smart Reminders**
- Countdown widget on planning page
- Milestone-based reminders (90d, 60d, 30d, 14d, 7d, 1d)

**Wedding Timeline**
- CRUD for timeline entries with time, activity, notes, category
- Category filtering (ceremony, reception, meals, activities)
- Template generation from wedding steps

**Gift/Cash Tracker (Phong Bì)**
- Guest-linked gift/cash tracking
- Side filtering by bride/groom attribution
- CSV export with formula injection prevention

**Guest Photo Wall**
- Vercel Blob storage for guest uploads
- Token-based guest upload links (#/photos/:token)
- Moderation dashboard with approval workflow

**Collaborative Task Board**
- Family task delegation with token-based links (#/tasks/:token)
- Status tracking (assigned, in-progress, completed)
- Assignee progress visibility

**Wedding Website**
- Public #/w/:slug page
- Section toggles (timeline, gallery, venue, RSVP)
- Couple info, theme, RSVP CTA

### Planned Features (Phase 3+)

- Budget tracking and expense logging
- Vendor database and communication
- Real-time collaborative editing
- Notification system (email/SMS)
- Advanced data export (PDF with designs)
- Mobile-responsive design refinements
- User profiles and multi-couple accounts

## Non-Functional Requirements (TBD)

- Sub-second page load times
- 99.9% uptime SLA
- Support 10K+ concurrent users
- GDPR compliance
- End-to-end encryption for sensitive data
- Automated backups

## Success Metrics (TBD)

- User adoption and retention rates
- Feature completion velocity
- Production incident SLA compliance
- User satisfaction scores
- Performance benchmarks

## Dependencies

- All node modules installed (see package.json)
- Environment variables configured (.env.local)
- Neon PostgreSQL account
- Upstash Redis account
- Vercel project linked

## Database Tables

**Core Tables:**
1. `user_sessions` — Wedding state + extracted columns for queries
2. `analytics_events` — User engagement tracking
3. `admin_sessions` — Admin panel authentication (24h expiry)
4. `rsvp_invitations` — RSVP guest invitations and responses
5. `wedding_photos` — Guest photos stored in Vercel Blob
6. `wedding_tasks` — Family tasks with assignee tracking

**Total:** 6 tables, fully optimized for query performance with strategic indexes.

## API Endpoints (23 total)

**Public Endpoints:** health, rsvp, photos, tasks, website
**Admin Endpoints:** auth (3), data (4)
**Sync Endpoints:** sync, track
**AI Endpoints:** ai/chat
**Utility Endpoints:** share, admin health monitoring

All endpoints implement rate limiting, input validation, and error handling.

## Next Phase

Phase 3 will focus on budget tracking, vendor management, and real-time collaboration features.
