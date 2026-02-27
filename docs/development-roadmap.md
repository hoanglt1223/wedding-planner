# Development Roadmap

## Project Timeline

### Phase 1: Bootstrap (COMPLETE)

**Status:** Complete (Feb 21, 2026)

**Deliverables:**
- Vite + React 19 + TypeScript scaffold
- Tailwind CSS v4 + shadcn/ui integration
- Vercel serverless function setup
- Neon PostgreSQL + Drizzle ORM configured
- Upstash Redis integration
- Health check endpoint (`/api/health`)
- ESLint + TypeScript strict mode
- Environment configuration template

**Metrics:** All dependencies installed, project builds and runs locally.

---

### Phase 1.5: Astrology Expansion (COMPLETE)

**Status:** Complete (Feb 23, 2026)

**Deliverables:**
- Data model migration (v11 → v12) with full birth date/hour/gender fields
- Birth input form with date picker and Vietnamese Earthly Branch hour selector
- 12 zodiac profiles, 5 element profiles, 12 yearly forecasts for 2026
- New "Cá Nhân" (Personal) tab with personality, forecast, lucky attributes, element deep-dive
- AI reading API endpoint with OpenAI gpt-4o-mini integration
- Redis caching (300-day TTL) and rate limiting (5 req/IP/day)
- AI reading frontend with loading, error handling, cached indicator
- All 5 astrology tabs updated for v12 data model

**Metrics:** All 7 phases completed, API tested, Redis caching operational, rate limiting active.

**New Dependencies:** openai, @upstash/ratelimit

---

### Phase 1.6: English Localization (COMPLETE)

**Status:** Complete (Feb 23, 2026)

**Deliverables:**
- i18n system: `t(key, lang)` function + 200+ translation keys
- Data resolver pattern with 7 lang-aware getter functions
- 17 English data files (.en.ts) covering all data sets
- Locale utilities: `getLocale(lang)`, `getCurrencySymbol(lang)`, format functions with lang parameter
- All components updated to accept `lang?: string` prop
- API endpoints accept `lang` parameter for English responses
- Language toggle in Settings, stored in `WeddingState.lang`

**Metrics:** Full English translation coverage, all data sets localized, zero runtime performance impact.

**New Dependencies:** None

---

### Phase 1.7: Vietnamese Wedding Content Expansion (COMPLETE)

**Status:** Complete (Feb 23, 2026)

**Deliverables:**
- Region system: North/Central/South Vietnam with `RegionalContent<T>` DRY pattern
- Region selector in header + state management in `WeddingState.region`
- Detailed step guides on all 8 ceremony phases (collapsible sections)
  - Cultural significance, tips, common mistakes, regional notes
- Traditional items checklist: 33 items across 4 phases (Engagement, Betrothal, Procession, Wedding)
  - Interactive checklist with regional quantity variants
  - Persisted in store via `itemsChecked` map
- Family roles & etiquette: 7 role cards + 5 etiquette rules
  - Per-phase responsibility mapping
  - Regional etiquette notes
- Auspicious date picker: Full lunar calendar
  - Hoàng Đạo/Hắc Đạo (lucky/unlucky days)
  - Tam Nương, Nguyệt Kỵ, Ngũ Hành compatibility
  - Couple compatibility scoring (1-10)
- Data migration: wp_v12 → wp_v13 with region + itemsChecked fields
- 9 new data files + 4 component files + 4 calendar components

**Metrics:** 13 wedding-specific components, 9 data files, 60-day lunar calendar operational, regional data working.

**New Dependencies:** @dqcai/vn-lunar ^1.0.1

---

### Phase 1.8: User Data Tracking & Admin Panel (COMPLETE)

**Status:** Complete (Feb 23, 2026)

**Deliverables:**
- Anonymous user tracking with UUID + localStorage persistence (wp_user_id)
- Smart sync: debounced (5s), visibility-based, heartbeat (5min), sendBeacon on unload
- Event tracking: batched with 30s flush, tracks page views, onboarding, checklist, guests, budget, theme/lang/region, AI readings, shares
- Database schema: user_sessions, analytics_events, admin_sessions tables with optimized columns for queries
- Admin panel password-based auth with httpOnly cookie (24h expiry)
- Admin shell with lazy loading at #/admin with sidebar navigation
- Admin dashboard: stat cards (total users, active today/week/month, top regions/languages)
- Admin users page: paginated table (50/page) with search/sort, detail modal with full wedding_data JSON
- Admin analytics page: event aggregation, daily active users, feature usage breakdown (date range filter)
- Admin system page: DB/Redis status, env checks, session count, last sync time
- Rate limiting: 30 req/min for sync, 10 req/min for tracking, payload guards (50KB sync, 50 events per batch)
- Consolidated API: auth.ts + data.ts for Vercel Hobby plan limits

**Metrics:** 4 implementation phases complete, 5 new API endpoints, 3 new DB tables, 5 admin pages, full analytics coverage.

**New Dependencies:** None

---

### Phase 1.9: RSVP System (COMPLETE)

**Status:** Complete (Feb 27, 2026)

**Deliverables:**
- Database schema: `rsvp_invitations` table with 10 columns (id, userId, guestName, token, status, plusOnes, dietary, message, respondedAt, createdAt)
- User session state migration: wp_v13 → wp_v14 with `rsvpSettings` field
- Guest interface extended with optional `rsvpToken` field
- Three API endpoints:
  - POST /api/rsvp — Bulk token generation for guests (12-char nanoid tokens)
  - GET /api/rsvp?token=X — Fetch invitation data + planner settings (theme, lang, event details)
  - POST /api/rsvp/respond — Submit RSVP response (one-time guard via responded_at)
  - GET /api/rsvp/list?userId=X — Dashboard list endpoint
- Guest-facing RSVP landing page at #/rsvp/:token with:
  - Hero section (couple names, date, welcome message)
  - Event details (venue, address, map link)
  - Couple story section (optional)
  - RSVP form (attendance radio, plus-ones counter, dietary, message)
  - Thank-you screen with response summary
  - Themed color application per planner's selection
- Planner RSVP dashboard with:
  - Settings form (welcome message, venue, address, map link, couple story)
  - Bulk link generation button with token assignment
  - Stats bar (accepted/declined/pending counts)
  - Response table with status badges, plus-ones, dietary, message
  - QR code generation per guest (client-side, scannable)
  - Copy link button (individual and all-links export)
  - CSV export with guest responses and links
- Security features:
  - Rate limiting: POST /api/rsvp (10 req/min per userId), POST /api/rsvp/respond (20 req/min per IP)
  - One-time response guard: atomic check on responded_at field
  - XSS protection in form inputs (max lengths enforced)
  - CSV formula injection prevention
  - Token-based auth: no login required for guests
- Internationalization: Full Vietnamese/English support (~35 translation keys)
- Mobile-responsive design: Tested at 375px viewport

**Metrics:** 5 implementation phases completed, 3 API endpoints deployed, guest landing page operational, planner dashboard integrated into Guest panel, full i18n coverage.

**Dependencies Added:**
- `nanoid` — 12-char URL-safe token generation
- `qrcode` — Client-side QR code rendering

---

### Phase 2: Core Planning Features (COMPLETE)

**Status:** Complete (Feb 28, 2026)

**Deliverables:**
- **Countdown + Smart Reminders** — Widget on planning page with milestone-based reminders (90d/60d/30d/14d/7d/1d)
- **Wedding Timeline** — CRUD for timeline entries with category filters and template generation from wedding steps
- **Gift/Cash Tracker** — Phong bì manager with guest linking, side filtering (bride/groom), CSV export with formula injection prevention
- **Guest Photo Wall** — Vercel Blob storage with guest upload via QR/token (#/photos/:token) and moderation dashboard
- **Collaborative Task Board** — Family task delegation with token-based links (#/tasks/:token) and assignee progress tracking
- **Wedding Website** — Public #/w/:slug page assembling couple info, theme, timeline, gallery, venue, RSVP CTA

**Architecture Updates:**
- State migration: wp_v14 → wp_v15 with new fields (countdown, remindersSent, timeline, gifts, website)
- 2 new database tables: wedding_photos, wedding_tasks
- 3 new hash routes: #/w/:slug, #/photos/:token, #/tasks/:token
- 5 new pages: timeline-page, gift-page, photo-upload-page, task-landing-page, wedding-website-page
- 25+ new components across timeline, gifts, photos, tasks, website directories
- 3 new API endpoints: /api/photos, /api/tasks, /api/website
- 70+ new i18n keys for full bilingual support
- Vercel Blob integration for image storage

**Dependencies Added:**
- `@vercel/blob` — Blob storage API

**Environment Variables:**
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob access token

**Metrics:** All 7 phases completed, 6 features operational, public website generation working, family collaboration enabled.

---

### Phase 3: Advanced Features (PLANNED)

**Estimated Duration:** 6-8 weeks

**Priority Features:**
- Budget tracking and expense logging
- Vendor database and communication
- Real-time collaborative editing
- Notification system (email/SMS)
- Data export (PDF, advanced CSV)

---

### Phase 4: Polish & Launch (PLANNED)

**Estimated Duration:** 2-3 weeks

**Focus:**
- Performance optimization
- Mobile responsiveness testing
- Security audit
- Documentation completion
- Beta testing

---

## Milestones

| Milestone | Target Date | Status |
|-----------|------------|--------|
| Bootstrap Complete | Feb 21, 2026 | Done |
| Astrology Expansion | Feb 23, 2026 | Done |
| English Localization | Feb 23, 2026 | Done |
| Vietnamese Wedding Content Expansion | Feb 23, 2026 | Done |
| User Data Tracking & Admin Panel | Feb 23, 2026 | Done |
| RSVP System | Feb 27, 2026 | Done |
| Core Planning Features | Feb 28, 2026 | Done |
| Advanced Features | TBD | Planned |
| Beta Launch | TBD | Planned |
| General Availability | TBD | Planned |

## Future Considerations

- PWA capabilities (offline support)
- AI-powered planning suggestions
- Vendor partnership integrations
- Mobile native app (React Native)
- Analytics and insights dashboard
