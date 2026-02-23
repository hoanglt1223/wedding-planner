# Phase 5: Component Wiring

## Context
- Parent: [plan.md](plan.md)
- Depends on: Phases 1-4 (all data files + resolver must exist)
- Scout report: All component files identified with Vietnamese strings and lang prop gaps

## Overview
- **Priority:** P1
- **Status:** Completed
- **Description:** Thread `lang` prop to all components, replace data imports with resolver, fix locale formatting, add t() calls
- **Completed:** 2026-02-23

## Key Insights
- `lang` currently only reaches Navbar and Footer from App.tsx
- PlanningPage, AstrologyPage, and all child components never receive lang
- 8+ files hardcode "vi-VN" locale
- ~20 components have hardcoded Vietnamese UI strings
- Data imports (WEDDING_STEPS, BUDGET_CATEGORIES, etc.) need to switch to resolver getters
- Onboarding wizard needs English sample data

## Requirements
### Functional
- All components receive `lang` prop (or access it from context/store)
- All data-driven displays use lang-aware getters from resolve-data.ts
- All `"vi-VN"` hardcoded locales replaced with `getLocale(lang)`
- All UI strings wrapped with `t(key, lang)`
- Onboarding shows English text and sample names when lang="en"

### Non-Functional
- Minimal prop drilling — thread through page → panel hierarchy
- No new state management (use existing store.lang)
- Max 200 lines per file (some may need splitting)

## Architecture

### Lang Threading Strategy

**Option A: Prop drilling** (simpler, matches existing pattern)
```
App.tsx (state.lang)
  → PageRouter (lang prop)
    → PlanningPage (lang prop)
      → StepPanel (lang prop)
      → BudgetPanel (lang prop)
      → GuestPanel (lang prop)
      → NotesPanel (lang prop)
      → VendorPanel (lang prop)
    → AstrologyPage (lang prop)
    → AiPanel (lang prop)
    → PrintPanel (lang prop)
    → CardsPanel (lang prop)
    → IdeasPanel (lang prop)
    → HandbookPanel (lang prop)
  → OnboardingWizard (lang prop)
```

This is the recommended approach — matches KISS principle and existing codebase patterns.

## Related Code Files
### Modify (~20 files)

**Routing/Layout:**
- `src/App.tsx` — Pass lang to PageRouter, OnboardingWizard
- `src/pages/page-router.tsx` — Accept lang, pass to all pages
- `src/components/wedding/panel-router.tsx` — Accept lang, pass to panels

**Planning Page Components:**
- `src/components/wedding/step-panel.tsx` — Accept lang, use t() for UI, pass to CeremonySection
- `src/components/wedding/ceremony-section.tsx` — Accept lang for ceremony rendering
- `src/components/budget/budget-panel.tsx` — Accept lang, use t() + getBudgetCategories(lang)
- `src/components/guests/guest-panel.tsx` — Accept lang, use t() for UI strings
- `src/components/guests/seating-chart.tsx` — Accept lang, fix locale
- `src/components/wedding/vendor-panel.tsx` — Accept lang, use t()
- `src/components/wedding/notes-panel.tsx` — Accept lang, use t()

**Other Pages:**
- `src/pages/astrology-page.tsx` — Accept lang, pass to sub-components, use getZodiacProfiles(lang) etc.
- `src/components/ai/ai-panel.tsx` — Accept lang, use getAiPrompts(lang), fix locale, pass lang to API
- `src/components/print/print-panel.tsx` — Accept lang, use t(), fix locale
- `src/components/print/event-timeline.tsx` — Accept lang, fix locale, translate labels
- `src/components/cards/cards-panel.tsx` — Accept lang, fix locale
- `src/components/cards/rsvp-section.tsx` — Accept lang, fix locale
- `src/pages/ideas-page.tsx` or `ideas-panel.tsx` — Accept lang, use getIdeas(lang)

**Onboarding:**
- `src/components/onboarding/onboarding-wizard.tsx` — Accept lang, use t(), English sample data
- `src/components/onboarding/onboarding-preview.tsx` — Accept lang, use getWeddingSteps(lang)

**Landing:**
- `src/components/landing/landing-hero.tsx` — Accept lang, use t()
- `src/components/landing/landing-footer.tsx` — Fix locale if needed

**Shared:**
- `src/pages/shared-preview-page.tsx` — Fix locale formatting

## Implementation Steps

### Step 1: Thread lang through routing layer
1. `App.tsx`: Pass `lang={state.lang}` to PageRouter and OnboardingWizard
2. `page-router.tsx`: Accept `lang` prop, pass to all page/panel components
3. `panel-router.tsx`: Accept `lang` prop, pass to StepPanel and sub-panels

### Step 2: Replace data imports
In each component that imports data directly:
```typescript
// Before:
import { WEDDING_STEPS } from "@/data/wedding-steps";
// After:
import { getWeddingSteps } from "@/data/resolve-data";
// Usage:
const steps = getWeddingSteps(lang);
```

Apply to: WEDDING_STEPS, BUDGET_CATEGORIES, AI_PROMPTS, ZODIAC_PROFILES, ELEMENT_PROFILES, YEARLY_FORECASTS, IDEAS

### Step 3: Fix locale formatting (8 files)
Replace all hardcoded "vi-VN":
```typescript
// Before:
date.toLocaleDateString("vi-VN", { ... })
// After:
import { getLocale } from "@/lib/format";
date.toLocaleDateString(getLocale(lang), { ... })
```

**Files to update:**
1. `cards-panel.tsx` — date formatting
2. `rsvp-section.tsx` — date formatting
3. `ai-panel.tsx` — budget formatting
4. `seating-chart.tsx` — localeCompare
5. `onboarding-wizard.tsx` — date formatting
6. `print-panel.tsx` — date + currency formatting
7. `event-timeline.tsx` — date formatting
8. `shared-preview-page.tsx` — date formatting
9. `format.ts` — Already updated in Phase 1

### Step 4: Add t() calls for UI strings
In each component with hardcoded Vietnamese text:
```typescript
import { t } from "@/lib/i18n";

// Before:
<h2>💰 Ngân Sách</h2>
// After:
<h2>{t("💰 Ngân Sách", lang)}</h2>
```

### Step 5: Update onboarding
- Accept lang prop
- Use t() for all UI strings
- Conditional sample data: `lang === "en" ? SAMPLE_DATA_EN : SAMPLE_DATA`
- English sample data:
  ```typescript
  const SAMPLE_DATA_EN = {
    bride: "Sarah Nguyen",
    groom: "David Tran",
    brideFamilyName: "Nguyen Family",
    groomFamilyName: "Tran Family",
    date: "2026-03-14",
    engagementDate: "2026-09-15",
    betrothalDate: "2026-11-15",
  };
  ```

## Todo
- [x] Thread lang: App.tsx → PageRouter → all pages
- [x] Thread lang: PanelRouter → all planning panels
- [x] Replace WEDDING_STEPS imports with getWeddingSteps(lang) — print-panel, onboarding-preview, panel-router
- [x] Replace BUDGET_CATEGORIES import with getBudgetCategories(lang) — budget-panel
- [x] Replace AI_PROMPTS import with getAiPrompts(lang) — ai-panel
- [x] Replace astrology imports — astrology-page + sub-components
- [x] Replace IDEAS import — ideas-panel
- [x] Fix locale: cards-panel.tsx
- [x] Fix locale: rsvp-section.tsx
- [x] Fix locale: ai-panel.tsx
- [x] Fix locale: seating-chart.tsx
- [x] Fix locale: onboarding-wizard.tsx
- [x] Fix locale: print-panel.tsx
- [x] Fix locale: event-timeline.tsx
- [x] Fix locale: shared-preview-page.tsx
- [x] Add t() calls: onboarding-wizard (~15 strings)
- [x] Add t() calls: budget-panel (~12 strings)
- [x] Add t() calls: guest-panel (~15 strings)
- [x] Add t() calls: ai-panel (~10 strings)
- [x] Add t() calls: print-panel (~15 strings)
- [x] Add t() calls: astrology-page (~10 strings)
- [x] Add t() calls: event-timeline (~5 strings)
- [x] Add t() calls: landing-hero (~6 strings)
- [x] Add t() calls: remaining components
- [x] Update onboarding: English sample data + t() calls
- [x] Verify: `npm run build` passes
- [x] Verify: toggle to EN, all visible text is English

## Success Criteria
- All components receive and use `lang` prop
- No direct data imports remain (all via resolve-data getters)
- No hardcoded "vi-VN" locale strings
- No Vietnamese UI strings visible when lang="en" (except intentional preserved terms)
- TypeScript compilation passes
- Toggle lang in footer, entire app switches language

## Risk Assessment
- **Prop drilling depth:** Some components are 4-5 levels deep — may get verbose. Mitigation: if >5 levels, consider a simple React context for lang.
- **Missed strings:** Deep component UI strings may be overlooked → systematic grep pass after wiring
- **Type errors:** Adding `lang` prop to many component interfaces → many small changes, careful

## Security Considerations
- No security impact

## Next Steps
- Phase 6: API English support
- Full end-to-end testing in EN mode
