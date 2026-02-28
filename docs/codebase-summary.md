# Codebase Summary

## Project: Wedding Planner

Production-ready React + Vercel serverless full-stack scaffold. All tech stack components integrated and configured.

## Core Files

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | Dependencies + build scripts | Active |
| `vite.config.ts` | Frontend build + React + Tailwind plugin | Active |
| `tsconfig.*.json` | TypeScript strict mode + path aliases | Active |
| `tailwind.config.js` | Tailwind v4 configuration | Auto-generated |
| `.env.example` | Required environment variables | Template |

## Frontend

| Directory | Purpose | Status |
|-----------|---------|--------|
| `src/main.tsx` | React entry point | Active |
| `src/App.tsx` | Root component; applies theme CSS vars | Active |
| `src/data/themes.ts` | Theme definitions (AppTheme interface + 4 themes) | Active |
| `src/data/regions.ts` | Region type system (North/Central/South + `RegionalContent<T>` helper) | Active |
| `src/components/ui/` | shadcn/ui components | 6 components ready |
| `src/components/layout/` | Layout wrappers | 10 components (header, footer, root, region-selector, theme-picker, topbar, scrollable-tab-bar, bottom-nav, menu-drawer, reminders) |
| `src/components/wedding/` | Wedding-specific UI | 13 components (ceremony, steps, checklist, family-roles, collapsible-detail, etc.) |
| `src/components/calendar/` | Auspicious date picker | 4 components (calendar, day-cell, detail-modal, couple-compatibility) |
| `src/components/rsvp/` | RSVP guest landing page | 5 components (hero, event-details, couple-story, form, thank-you) |
| `src/components/guests/` | Guest management dashboard | 8 components (stats-bar, settings-form, generate-links, qr-modal, response-table, export-actions, dashboard, seating-chart) |
| `src/components/timeline/` | Timeline CRUD interface | 4 components (entry-form, entry-list, entry-card, header) |
| `src/components/gifts/` | Gift/cash tracker UI | 5 components (entry-form, entry-list, entry-row, summary-bar, csv-export) |
| `src/components/photo-wall/` | Guest photo upload & gallery | 6 components (upload-form, upload-link, qr-generator, gallery-dashboard, masonry-grid, photo-card) |
| `src/components/tasks/` | Collaborative task board | 7 components (form, board-dashboard, card, list-view, assignee-view, assignee-links, progress-bar) |
| `src/components/website/` | Wedding website builder | 6 components (hero, gallery, rsvp-cta, settings-panel, slug-input, section-toggles) |
| `src/components/cards/` | Card-based UI components | 6 components (photo-board, background-grid, cards-panel, couple-info-form, invitation-grid, rsvp-section) |
| `src/components/print/` | Print-optimized components | event-timeline, print-panel |
| `src/components/home/` | Home page dashboard | 4 components (progress-ring, quick-actions, daily-tip, recent-activity) |
| `src/components/budget/` | Expense tracker UI | 7 components (expense-tracker, budget-overview, budget-summary, category-breakdown, expense-form, expense-list, budget-category-row) |
| `src/components/onboarding/` | Onboarding wizard | 6 components (welcome, names, date-region, confirm, preview, wizard) |
| `src/components/progress/` | Achievement system | 2 components (badge-display, section-progress) |
| `src/components/pwa/` | PWA install UI | 2 components (install-prompt, ios-install-prompt) |
| `src/pages/` | Route-based pages | 9 pages (home, planning, tools, gift, photo-upload, task-landing, timeline, wedding-website, rsvp-landing, guests, astrology, landing, shared-preview, admin, page-router) |
| `src/hooks/` | Custom React hooks | use-wedding-store, use-local-storage, use-user-id, use-sync, use-tracking, use-online-status |
| `src/lib/utils.ts` | Tailwind merge utility | Active |
| `src/lib/i18n.ts` | Translation function: `t(key, lang)` | Active |
| `src/lib/format.ts` | Locale utilities & formatting with lang parameter | Active |
| `src/lib/rsvp-api.ts` | RSVP API wrapper functions | Active |
| `src/lib/progress-calculator.ts` | Badge/achievement system calculation | Active |
| `src/lib/countdown.ts` | Countdown timer utility | Active |
| `src/types/` | TypeScript definitions | wedding.ts with WeddingState, Region, RegionalContent, Phase 2 & Phase 3 types |
| `src/data/nav-sections.ts` | Navigation menu structure & routing config | Active |
| `src/data/badges.ts` / `badges.en.ts` | Achievement badge definitions (vi/en) | Active |
| `src/data/expense-categories.ts` / `expense-categories.en.ts` | Budget expense categories (vi/en) | Active |
| `src/index.css` | Global styles + custom utilities (text-2xs) + print styles | Active |
| `public/` | Static assets | Empty |

## Backend

| File | Purpose | Status |
|------|---------|--------|
| `api/health.ts` | Deployment health check | Active |
| `api/rsvp.ts` | Bulk create & fetch RSVP invitations | Active |
| `api/rsvp/respond.ts` | One-time atomic RSVP response submission | Active |
| `api/rsvp/list.ts` | Dashboard: fetch all responses (rate-limited) | Active |
| `api/photos.ts` | Guest photo upload via Vercel Blob | Active |
| `api/tasks.ts` | Collaborative task CRUD + progress tracking | Active |
| `api/website.ts` | Wedding website data endpoint | Active |
| `src/db/index.ts` | Database factory function | Active |
| `src/db/schema.ts` | Drizzle table definitions (6 tables + wedding_photos, wedding_tasks) | Active |
| `src/lib/redis.ts` | Redis factory function | Active |

## Configuration Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config |
| `drizzle.config.ts` | Drizzle ORM migrations |
| `eslint.config.js` | Linting rules |
| `components.json` | shadcn/ui config |

## Dependencies (Key)

**Frontend:** React 19.2.4, Vite 7.3.1, TypeScript 5.9.3, Tailwind CSS 4.2.0, shadcn/ui 3.8.5, @dqcai/vn-lunar 1.0.1, nanoid 5.x, qrcode 1.5.x

**Backend:** Drizzle ORM 0.45.1, Neon serverless, Upstash Redis 1.36.2, ZhipuAI SDK

**Tooling:** ESLint, Drizzle Kit, TypeScript compiler, @upstash/ratelimit, @types/qrcode

## Environment Setup

Required env vars (see `.env.example`):
- `DATABASE_URL` - Neon PostgreSQL connection
- `UPSTASH_REDIS_REST_URL` - Redis endpoint
- `UPSTASH_REDIS_REST_TOKEN` - Redis auth

## Build Pipeline

```
Source → TypeScript Check → Vite Bundle → Vercel Deploy
```

Scripts:
- `npm run dev` - Local development
- `npm run build` - Production bundle
- `npm run lint` - Code linting
- `npm run db:*` - Database migrations

## Theme System

App-wide theming via CSS variables. Four themes available (Traditional Red, Blush Pink, Navy Blue, Sage Green).

**Data Layer:** `src/data/themes.ts`
- `AppTheme` interface defines 11 color tokens per theme (primary, surface, border, notes, etc.)
- `THEMES` array holds 4 pre-configured theme objects
- Each theme includes HSL values for shadcn --primary override

**Application Layer:** `src/App.tsx`
- Applies theme tokens to root element style as CSS vars (`--theme-surface`, `--theme-border`, etc.)
- All components consume vars via inline styles or Tailwind arbitrary values

**Styling Layer:** `src/index.css`
- Declares CSS vars in @theme inline block
- text-2xs utility added (0.625rem font size)

## Internationalization (i18n)

English and Vietnamese language support with centralized translation system.

**Core Files:**
- `src/lib/i18n.ts` — `t(key, lang)` function + `getLangLabel(lang)` for UI display
- `src/lib/i18n-translations.ts` — ~200 translation key-value pairs (vi/en)
- `src/data/resolve-data.ts` — 7 lang-aware data getter functions

**Data Translation Files (26 .en.ts files):**
- `wedding-steps*.en.ts` (7 files) — Wedding ceremony steps
- `budget-categories.en.ts` — Budget categories
- `ideas.en.ts` — Planning ideas
- `ai-prompts.en.ts` — AI chat prompts
- `astrology-zodiac-profiles.en.ts` — Zodiac personality profiles
- `astrology-element-profiles.en.ts` — Element profiles (Wood, Fire, Earth, Metal, Water)
- `astrology-yearly-forecast.en.ts` — 2026 yearly forecasts
- `family-roles/roles.en.ts` — Family role responsibilities per phase
- `family-roles/etiquette.en.ts` — 5 etiquette rules with regional notes
- `traditional-items/items-*.en.ts` (4 files) — 33 traditional items across 4 phases with regional quantities

**Format Utilities:**
- `src/lib/format.ts` — `getLocale(lang)`, `getCurrencySymbol(lang)`, `formatMoney(n, lang)`, `formatShort(n, lang)`

**Component Pattern:**
- All components accept optional `lang?: string` prop (default: "vi")
- Language stored in `WeddingState.lang`, toggled via Settings UI

## RSVP System

**Purpose:** Manage wedding guest RSVPs with token-based guest landing pages and admin dashboard.

**Guest Page Route:** `#/rsvp/:token`

**Components:**
- Guest page: `rsvp-hero`, `rsvp-event-details`, `rsvp-couple-story`, `rsvp-form`, `rsvp-thank-you`
- Admin dashboard: `rsvp-stats-bar`, `rsvp-settings-form`, `rsvp-generate-links`, `rsvp-qr-modal`, `rsvp-response-table`, `rsvp-export-actions`

**Database Table:** `rsvp_invitations` (10 cols: id, user_id, guest_name, token, status, plus_ones, dietary, message, responded_at, created_at)

**API Endpoints:**
- `POST/GET /api/rsvp` — Bulk create + fetch by token
- `POST /api/rsvp/respond` — One-time atomic response submission
- `GET /api/rsvp/list` — Dashboard listing (rate-limited)

**State:** `WeddingState.rsvpSettings: RsvpSettings`, `Guest.rsvpToken?: string`, localStorage v14

## Phase 2 Features (Countdown, Timeline, Gifts, Photos, Tasks, Website)

**Purpose:** Six core features for planning, tracking, collaboration, and public sharing.

### Countdown + Smart Reminders
- Countdown widget on planning page showing days until wedding
- Milestone-based reminders at 90d/60d/30d/14d/7d/1d before wedding
- State: `WeddingState.remindersSent: Record<string, boolean>`

### Wedding Day Timeline
- CRUD for `TimelineEntry[]` with time, activity, notes, category
- Filter by category (ceremony, reception, meals, activities)
- Template generation from wedding steps
- Component: `timeline-page.tsx` + timeline subcomponents

### Gift/Cash Tracker (Phong Bì)
- Manage gifts/cash received with guest linking
- Side filtering by bride/groom attribution
- CSV export with formula injection prevention
- Component: `gift-page.tsx` + gift subcomponents
- Export uses `@index` prefix escaping

### Guest Photo Wall
- Vercel Blob storage for guest photos
- Guest upload via QR code / token link (#/photos/:token)
- Moderation dashboard with approval workflow
- Component: `photo-upload-page.tsx` + photo-wall subcomponents
- Database table: `wedding_photos` (8 cols: id, userId, guestName, photoUrl, status, uploadedAt, approvedAt, createdAt)

### Collaborative Task Board
- Family task delegation with token-based links (#/tasks/:token)
- Assignee progress tracking (assigned, in-progress, completed)
- Task board with filtering by status/assignee
- Component: `task-landing-page.tsx` + task subcomponents
- Database table: `wedding_tasks` (11 cols: id, userId, title, description, assignee, assigneeToken, status, dueDate, priority, createdAt, updatedAt)

### Wedding Website
- Public #/w/:slug page with couple info, theme, timeline, gallery, venue, RSVP CTA
- Website settings panel to toggle sections (gallery, timeline, venue, rsvp)
- Slug management (publish/unpublish)
- Component: `wedding-website-page.tsx` + website subcomponents
- Stored in `WeddingState.website: WebsiteSettings`

**State Migration:** wp_v15 → wp_v16 with new fields:
- `countdown: boolean` (enable/disable)
- `remindersSent: Record<string, boolean>` (milestone tracking)
- `timeline: TimelineEntry[]` (timeline events)
- `gifts: GiftEntry[]` (gift tracker)
- `website: WebsiteSettings` (site config)
- `expenseLog: ExpenseEntry[]` (budget expense tracking)
- `expenseIdCounter: number` (expense ID counter)

**Dependencies Added:** `@vercel/blob` for Blob storage operations, `vite-plugin-pwa` for PWA support

**Environment Variables:** `BLOB_READ_WRITE_TOKEN` for Vercel Blob access

## Phase 3 Features (Home Dashboard, Budget Tracker, Onboarding, PWA)

**Purpose:** Enhanced engagement, expense tracking, PWA capability, and streamlined onboarding.

### Home Dashboard
- Central landing page with progress ring, quick actions, daily tips, recent activity
- Components: `progress-ring.tsx`, `quick-actions.tsx`, `daily-tip.tsx`, `recent-activity.tsx`
- Displays wedding countdown, completion progress, next actions

### Budget Expense Tracker
- Per-category expense logging with date, vendor name, payment status
- Category breakdown chart and monthly summaries
- CSV export capability
- Components: `expense-tracker.tsx`, `budget-overview.tsx`, `expense-form.tsx`, `expense-list.tsx`, `category-breakdown.tsx`

### 5-Step Onboarding Wizard
- Welcome, couple names, wedding date + region, preview, confirmation
- Modal-based flow with step progression
- Components: `onboarding-wizard.tsx`, `onboarding-welcome.tsx`, `onboarding-names.tsx`, `onboarding-date-region.tsx`, `onboarding-confirm.tsx`, `onboarding-preview.tsx`
- State: `WeddingState.onboardingComplete` (boolean)

### Achievement Badge System
- Unlock badges based on planning progress across ceremony phases
- Badge display on home dashboard
- Calculated from `WeddingState` checklist completion
- Components: `badge-display.tsx`, `section-progress.tsx`
- Data: `badges.ts` / `badges.en.ts` with badge definitions and criteria

### PWA Support
- Service worker for offline capability
- Install prompts (Android + iOS)
- Components: `install-prompt.tsx`, `ios-install-prompt.tsx`
- Build plugin: `vite-plugin-pwa` for manifest generation

### Navigation Redesign
- Bottom nav (mobile) + header tabs (desktop) layout
- Menu drawer for secondary pages (cards, handbook, ideas, website)
- Components: `bottom-nav.tsx`, `menu-drawer.tsx`, `footer.tsx`
- Data: `nav-sections.ts` defines navigation structure and page routing

### Page Structure
- **Home Page** (`home-page.tsx`) - Dashboard with progress, quick actions, tips
- **Planning Page** (`planning-page.tsx`) - Wedding steps and checklists
- **Tools Page** (`tools-page.tsx`) - Budget, timeline, guests, tasks

### New i18n Keys (80+)
- Home dashboard labels, quick action titles, daily tip format
- Budget expense categories, form labels, export headers
- Onboarding step text, confirmation messages, button labels
- Badge unlock messages and criteria descriptions
- PWA install prompts for Android/iOS
- Navigation menu labels and page titles

**State Extensions:** wp_v16 adds expense tracking and refined navigation data
