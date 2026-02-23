# Project Changelog

All notable changes are documented here.

## [0.3.0] - 2026-02-23

### Added

- **Vietnamese Wedding Content Expansion — Cultural & Regional Features**
  - Region system: North/Central/South Vietnam with `RegionalContent<T>` DRY pattern
  - `src/data/regions.ts` — Region type definitions
  - `src/components/layout/region-selector.tsx` — Region selector in header
  - Region state in `WeddingState.region`, persisted in store (wp_v13)

  - **Detailed Step Guides:** All 8 ceremony phases with collapsible sections
    - Cultural significance, practical tips, common mistakes, regional notes
    - `src/components/wedding/collapsible-detail.tsx` — Reusable detail expanders
    - Updated all wedding-steps files with new fields

  - **Traditional Items Checklist:** 33 items across 4 phases (Engagement, Betrothal, Procession, Wedding)
    - `src/data/traditional-items/` — 9 files (items-*.ts, items-*.en.ts, index.ts)
    - `src/components/wedding/items-checklist.tsx` — Interactive checklist UI
    - Regional quantity variants (e.g., "1 pair" in North vs "2 pairs" in South)
    - Persisted in store via `itemsChecked` map
    - `toggleItemCheck()` action in useWeddingStore hook

  - **Family Roles & Etiquette:** 7 role cards + 5 etiquette rules
    - `src/data/family-roles/` — 5 files (roles.ts, roles.en.ts, etiquette.ts, etiquette.en.ts, index.ts)
    - `src/components/wedding/family-roles-panel.tsx` — Role card grid with responsibilities
    - Per-phase responsibility mapping (role → duties by phase)
    - Regional etiquette notes via `EtiquetteRule.regionalNotes`

  - **Auspicious Date Picker:** Full lunar calendar with traditional guidelines
    - `src/data/auspicious/` — 6 files (types.ts, lunar-service.ts, hoang-dao.ts, avoidance-days.ts, ngu-hanh.ts, index.ts)
    - `src/components/calendar/` — 4 files (auspicious-calendar.tsx, day-cell.tsx, date-detail-modal.tsx, couple-compatibility.tsx)
    - Features: Hoàng Đạo/Hắc Đạo (lucky/unlucky days), Tam Nương (favorable dates), Nguyệt Kỵ (zodiac conflicts), Ngũ Hành (5 Elements compatibility)
    - 60-day lunar calendar view with zodiac and holiday indicators
    - Color-coded cell backgrounds (green=lucky, yellow=neutral, red=unlucky)
    - Couple compatibility scoring (1-10) based on 5 Elements
    - Couple birth data integration with yearly compatibility analysis

  - **Store Migration:** wp_v12 → wp_v13
    - Added `region: Region` field (default: "north")
    - Added `itemsChecked: Record<string, boolean>` for traditional items tracking
    - Migration logic in `migrateState()` function

### New Components (13 total)

**Wedding Ceremony:**
- `ceremony-section.tsx` — Ceremony display with gifts
- `ceremony-steps.tsx` — Step progression
- `collapsible-detail.tsx` — Reusable expander for significance/tips/mistakes
- `family-roles-panel.tsx` — Family role cards with per-phase duties
- `gifts-table.tsx` — Gift item display
- `items-checklist.tsx` — Interactive traditional items checklist
- `people-grid.tsx` — Person card grid
- `step-panel.tsx` — Main wedding step panel
- `tab-navigation.tsx` — Phase tab navigation
- `stats-grid.tsx` — Progress stats

**Calendar:**
- `auspicious-calendar.tsx` — Main lunar calendar grid
- `day-cell.tsx` — Individual day cell with indicators
- `date-detail-modal.tsx` — Extended date information modal
- `couple-compatibility.tsx` — 5 Elements compatibility display

### New Data Directories (3 total)

- `src/data/traditional-items/` — 9 files, 33 items across 4 phases
- `src/data/family-roles/` — 5 files, 7 roles + 5 etiquette rules
- `src/data/auspicious/` — 6 files, lunar calendar logic and compatibility

### Dependencies Added

- `@dqcai/vn-lunar` ^1.0.1 — Vietnamese lunar calendar conversion

### Type Additions

- `Region` — "north" | "central" | "south"
- `RegionalContent<T>` — Type helper for regional variations
- `TraditionalItem` — Item with name, icon, regional quantity, phase, purpose
- `FamilyRole` — Role with per-phase responsibilities
- `EtiquetteRule` — Rule with title, content, regional notes
- `Ceremony` fields: `significance`, `tips`, `commonMistakes`, `regionalNotes`

### Performance Notes

- Regional data loaded per-region (no unused content in memory)
- Lunar calendar calculations via @dqcai/vn-lunar library
- Checklist state stored in localStorage (wp_v13)
- No additional API calls for content (all data-driven)

---

## [0.2.0] - 2026-02-23

### Added

- **English Mode — Full Localization**
  - i18n system: `t(key, lang)` function with ~200 translation keys
  - `src/lib/i18n-translations.ts` centralized translation dictionary
  - Data resolver pattern: `src/data/resolve-data.ts` with 7 lang-aware getter functions
  - 17 new English data files (.en.ts) parallel to Vietnamese originals
  - Locale utilities in `src/lib/format.ts`: `getLocale(lang)`, `getCurrencySymbol(lang)`
  - `formatMoney()` and `formatShort()` now accept optional `lang` parameter
  - All components accept `lang?: string` prop (default "vi")
  - API endpoints (`/api/astrology-reading`) accept `lang` parameter
  - Language toggle in Settings UI, stored in `WeddingState.lang`
  - Full English translation coverage: UI strings, data sets, API responses

### Dependencies Added

- None (i18n implemented without external libraries)

### Performance Notes

- No runtime performance impact (language selection stored in state)
- Data arrays loaded per-language (no unused translations in memory)

---

## [0.1.0] - 2026-02-23

### Added

- **Astrology Expansion — Personal Astrology**
  - Data model migration v11 → v12: Added brideBirthDate, brideBirthHour, brideGender, groomBirthDate, groomBirthHour, groomGender fields
  - Birth input form with date picker, Vietnamese Earthly Branch hour dropdown, collapsible gender toggle
  - 12 zodiac personality profiles with characteristics, strengths, weaknesses, and compatibility
  - 5 element profiles (Wood, Fire, Earth, Metal, Water) with detailed descriptions
  - 12 yearly forecasts for 2026 with predictions for each zodiac sign
  - New "Cá Nhân" (Personal) tab with personality section, yearly forecast, lucky attributes, and element deep-dive
  - AI reading API endpoint (/api/astrology-reading) powered by OpenAI gpt-4o-mini
  - Redis caching for AI readings with 300-day TTL
  - Rate limiting (5 requests/IP/day) via @upstash/ratelimit
  - AI reading frontend with "Xếp Chi Tiết" button, loading states, error handling, and cached indicator
  - Updated all 5 astrology tabs to use v12 data model
  - Feng shui tab now uses explicit gender field instead of hardcoded values

### Dependencies Added

- `openai` (v4.x) — OpenAI SDK for AI-powered readings
- `@upstash/ratelimit` — Rate limiting for API endpoints

### Environment Variables

- `OPENAI_API_KEY` — OpenAI API key (required for AI readings)

### Performance Notes

- AI readings cached for 300 days per unique birth data + year combination
- Rate limited to 5 requests per IP per day to control costs
- gpt-4o-mini selected for cost efficiency (16x cheaper than gpt-4o)

---

## [0.0.1] - 2026-02-21

### Added

- **Initial Project Bootstrap**
  - Vite 7.3.1 + React 19.2.4 + TypeScript 5.9.3 scaffold
  - Tailwind CSS v4.2.0 with @tailwindcss/vite plugin
  - shadcn/ui 3.8.5 (New York style, neutral base)
  - Vercel serverless function support (/api directory)
  - Neon PostgreSQL integration + Drizzle ORM 0.45.1
  - Upstash Redis integration 1.36.2
  - ESLint configuration with TypeScript support
  - Health check API endpoint (/api/health)
  - Database factory function with error handling
  - Redis factory function with environment validation
  - TypeScript strict mode (all compilation options enabled)
  - Path alias configuration (@/ → src/)
  - Development, build, and database management scripts
  - Environment variable template (.env.example)
  - Complete documentation structure

### Configuration

- Tailwind CSS CSS-first approach active
- TypeScript strict mode: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch
- Vite aliases for clean imports
- Vercel deployment ready
- All node modules installed and functional

### Documentation Created

- project-overview-pdr.md - Product requirements and tech stack
- code-standards.md - Development conventions and patterns
- system-architecture.md - System design and data flow
- codebase-summary.md - File organization and component overview
- development-roadmap.md - Phase milestones and future planning
- project-changelog.md - Version history (this file)

---

## Versioning

Semantic versioning: MAJOR.MINOR.PATCH

- MAJOR: Breaking changes or significant feature additions
- MINOR: New features or non-breaking enhancements
- PATCH: Bug fixes and documentation updates
