# Project Changelog

All notable changes are documented here.

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
