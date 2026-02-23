# Wedding Planner - Product Development Requirements

## Project Overview

Wedding Planner is a full-stack web application for managing wedding events, guest lists, timelines, budgets, and vendor coordination. Built with modern technologies for scalability, performance, and developer productivity.

## Current Status

Phase 1: Bootstrap Complete. Project scaffold initialized with production-ready tech stack and deployment pipeline configured.

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
- AI-powered astrological readings (OpenAI gpt-4o-mini)
- Redis caching (300-day TTL) and rate limiting (5 req/IP/day)

**Internationalization**
- English and Vietnamese full translation coverage
- Language-aware data loading (26 .en.ts files)
- Format utilities per language (currency, numbers)
- Language toggle in Settings

**Theming**
- 4 pre-configured themes (Traditional Red, Blush Pink, Navy Blue, Sage Green)
- Dynamic CSS variable application

### In Development (TBD)

- User authentication and multi-user accounts
- Guest management (RSVP tracking, dietary requirements)
- Timeline and task management
- Budget tracking and expense logging
- Vendor database and communication
- Real-time notifications
- Data export (PDF, CSV)
- Mobile-responsive design improvements

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

## Next Phase

Define feature roadmap, create user stories, and begin database schema design for Phase 2 (Core Features).
