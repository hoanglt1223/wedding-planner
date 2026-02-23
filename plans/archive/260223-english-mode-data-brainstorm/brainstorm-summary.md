# English Mode Data — Brainstorm Summary

**Date:** 2026-02-23
**Status:** Agreed
**Audience:** Viet Kieu couples (overseas Vietnamese, prefer English UI, understand Vietnamese culture)

---

## Problem Statement

The wedding planner app has a VI/EN toggle in the footer, but English mode only translates 6 navigation tab labels. All content (650+ strings across ceremony steps, budget, AI prompts, astrology, onboarding, ideas) remains Vietnamese. Date/number formatting is hardcoded to `vi-VN` in 8+ files.

The "Multi-language" feature is marked "done" in the ideas panel but is ~5% complete.

---

## Agreed Decisions

### 1. Architecture: Dual Data Files

Create parallel `.en.ts` files for each Vietnamese data file. Import conditionally based on `state.lang`.

```
src/data/
  wedding-steps-0-meeting.ts        # Vietnamese (existing, untouched)
  wedding-steps-0-meeting.en.ts     # English (new)
  budget-categories.ts              # Vietnamese
  budget-categories.en.ts           # English
  ai-prompts.ts                     # Vietnamese
  ai-prompts.en.ts                  # English
  astrology-zodiac-profiles.ts      # Vietnamese
  astrology-zodiac-profiles.en.ts   # English
  astrology-element-profiles.ts     # Vietnamese
  astrology-element-profiles.en.ts  # English
  astrology-yearly-forecast.ts      # Vietnamese
  astrology-yearly-forecast.en.ts   # English
  ideas.ts                          # Vietnamese
  ideas.en.ts                       # English
  page-definitions.en.ts            # English nav labels (merge into i18n)
```

**Rationale:** Keeps files under 200 lines, no type changes, no structural changes to existing code, easy for AI to generate.

### 2. Content Style: Culturally Annotated with Preserved Terms

- Keep Vietnamese cultural terms in parentheses: "Betrothal Ceremony (Dam Hoi)"
- Add brief cultural context for non-obvious traditions
- Wedding step fields: tab, title, formalName, description, meaning, notes, timeline, aiHint, ceremony names, step text, people roles — all translated
- Astrology: Translate + annotate. Keep Vietnamese zodiac/element names alongside English. E.g., "Ty - Rat: In Vietnamese astrology..."

### 3. AI Prompts: Full English

- English labels + English prompts
- AI responds in English
- Adapt prompts for English-speaking Viet Kieu context (keep Vietnamese cultural references but explain them)

### 4. Translation Source: AI-Generated Draft

- Use AI to generate all `.en.ts` files from Vietnamese originals
- Single pass generation, user reviews output

---

## Content Inventory

| Category | New Files | Est. Strings | Notes |
|---|---|---|---|
| Wedding Steps (8 ceremonies) | 10 `.en.ts` files | ~300 | Most complex — ceremony descriptions, notes, step text, people roles |
| Budget Categories | 1 file | 13 | Simple label translation |
| AI Prompts | 1 file | 32 (16 labels + 16 prompts) | Prompts need cultural adaptation for English AI response |
| Astrology Zodiac | 1 file | ~96 | 12 signs x 8 Vietnamese string fields |
| Astrology Elements | 1 file | ~35 | 5 elements x 7 fields |
| Yearly Forecasts | 1 file | ~60 | 12 signs x 5 fields |
| Ideas | 1 file | ~13 | Description translations |
| i18n.ts expansion | Update existing | ~50-80 | Onboarding, misc UI strings across components |
| Locale formatting | Code changes in 8+ files | N/A | `vi-VN` -> lang-aware |

**Total: ~15 new data files + i18n expansion + 8+ locale fixes**

---

## Implementation Considerations

### Data File Pattern

Each `.en.ts` file exports the same type and structure as its Vietnamese counterpart:

```typescript
// wedding-steps-0-meeting.en.ts
import type { WeddingStep } from "@/types/wedding";

export const STEP_MEETING_EN: WeddingStep = {
  id: "meeting",
  tab: "Meeting",
  title: "Step 1: Family Meeting (Gap Mat)",
  formalName: "First Family Introduction (Le Giap Mat)",
  description: "The first informal meeting — two families get acquainted...",
  meaning: "This crucial first step in Vietnamese marriage tradition...",
  // ... same structure, English content
};
```

### Conditional Import Strategy

Create a data resolver utility:

```typescript
// src/data/resolve-data.ts
import { STEP_MEETING } from "./wedding-steps-0-meeting";
import { STEP_MEETING_EN } from "./wedding-steps-0-meeting.en";

export function getStepMeeting(lang: string): WeddingStep {
  return lang === "en" ? STEP_MEETING_EN : STEP_MEETING;
}
```

Or use a barrel file pattern for cleaner imports.

### Locale Formatting Fix

Replace all hardcoded `"vi-VN"` with lang-aware formatting:

```typescript
// src/lib/format.ts
export function getLocale(lang: string): string {
  return lang === "en" ? "en-US" : "vi-VN";
}
```

Apply across 8 files: cards-panel, rsvp-section, ai-panel, seating-chart, onboarding-wizard, print-panel, event-timeline, shared-preview-page.

### i18n.ts Expansion

Expand the existing `TRANSLATIONS` map to cover all UI strings not in data files:

- Onboarding wizard text (~15 strings)
- Tab labels within planning page (8 ceremony tabs + 4 utility tabs)
- Button labels, placeholders, tooltips
- Error messages, empty states
- Footer/header UI text

### Onboarding Sample Data

English mode should use English sample names:

```typescript
const SAMPLE_DATA_EN = {
  bride: "Sarah Nguyen",
  groom: "David Tran",
  brideFamilyName: "Nguyen Family",
  groomFamilyName: "Tran Family",
  // ...
};
```

---

## Risks

1. **Bundle size increase:** ~15 new data files. Mitigate with lazy loading (dynamic imports per active lang)
2. **Sync drift:** Vietnamese data changes won't auto-propagate to English files. Mitigate with a checklist or diff script
3. **AI translation quality:** Cultural nuances may be lost. Mitigate with user review pass
4. **Incomplete coverage:** Some UI strings in deep components may be missed. Mitigate with a systematic grep pass

---

## Success Criteria

- [ ] All 8 wedding step pages display full English content when lang="en"
- [ ] Budget categories show English labels
- [ ] AI prompts send English prompts and display English labels
- [ ] Astrology section fully translated with cultural annotations
- [ ] Onboarding wizard works in English with English sample data
- [ ] Ideas panel shows English descriptions
- [ ] Date/number formatting respects current language
- [ ] No Vietnamese strings visible when lang="en" (except intentional preserved terms)

---

## Next Steps

1. Create implementation plan with phased approach
2. Generate all `.en.ts` data files via AI
3. Update data resolver / conditional imports
4. Expand i18n.ts for UI strings
5. Fix locale formatting in 8+ files
6. Test full English mode end-to-end
