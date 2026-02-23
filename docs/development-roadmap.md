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

### Phase 2: Core Features (TBD)

**Estimated Duration:** 4-6 weeks

**Priority Features:**
- User authentication (sign up/login)
- User profile management
- Wedding event CRUD operations
- Guest list management
- Basic timeline/checklist features

**Deliverables (TBD):**
- Database schema (users, weddings, guests, events)
- Authentication API endpoints
- User dashboard page
- Guest management UI
- Event creation/editing forms

**Success Criteria (TBD):**
- 95%+ test coverage
- All endpoints documented
- Authentication working end-to-end

---

### Phase 3: Advanced Features (TBD)

**Estimated Duration:** 6-8 weeks

**Priority Features:**
- Budget tracking system
- Vendor database + communications
- Real-time notifications
- Multi-user collaboration
- Data export (PDF, CSV)

---

### Phase 4: Polish & Launch (TBD)

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
| Core Features | TBD | Planned |
| Beta Launch | TBD | Planned |
| General Availability | TBD | Planned |

## Future Considerations

- PWA capabilities (offline support)
- AI-powered planning suggestions
- Vendor partnership integrations
- Mobile native app (React Native)
- Analytics and insights dashboard
