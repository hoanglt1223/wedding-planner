# Scout Report: English Mode Implementation

## Summary
- **~1,700-1,900 translatable strings** across entire app
- **10 wedding step files** (968 lines Vietnamese content)
- **3 astrology data files** (~190 Vietnamese string fields)
- **3 other data files** (budget: 13, ai-prompts: 32, ideas: 13)
- **~200+ hardcoded Vietnamese UI strings** across 40+ components
- **8+ files** with hardcoded `"vi-VN"` locale
- **2 API endpoints** with Vietnamese-only system prompts
- **Lang prop** only reaches Navbar and Footer — broken at PageRouter level

## Key Findings

### Lang Threading Gap
App.tsx → Navbar/Footer only. PlanningPage, AstrologyPage, all panels, all data-driven components never receive `lang`. Need full prop drilling through:
- PageRouter → all pages
- PanelRouter → all planning panels
- Each panel → sub-components

### Data Import Chain
`wedding-steps.ts` (aggregator) → imported by PrintPanel, OnboardingPreview, PanelRouter
Individual data files → imported by specific components
All need switching to resolve-data.ts getters

### Locale Formatting
8 files hardcode `"vi-VN"`: ai-panel, cards-panel, rsvp-section, seating-chart, onboarding-wizard, print-panel, event-timeline, shared-preview-page

### API Architecture
- ZhipuAI (glm-5) — Vietnamese system prompts
- Redis cache keys don't include lang — will serve wrong language
- Need lang parameter in request body + cache key suffix
