---
title: "Than So Hoc (Numerology) Feature"
description: "Full Pythagorean numerology system with Vietnamese wedding interpretations"
status: complete
priority: P2
effort: 6h
branch: master
tags: [numerology, feature, vietnamese, wedding]
created: 2026-03-02
completed: 2026-03-02
---

# Than So Hoc (Numerology) Feature

## Summary

Add a new top-level Numerology page mirroring the existing Astrology page pattern. Pythagorean system with 8 core numbers, couple compatibility, wedding date scoring, yearly forecast, lucky attributes, and optional AI deep reading. Vietnamese only.

## Architecture

```
src/lib/numerology.ts                    # Core calculation engine
src/lib/numerology-compatibility.ts      # Couple scoring
src/lib/numerology-prompt.ts             # AI prompt builder
src/data/numerology-profiles.ts          # Life Path 1-9, 11, 22, 33 interpretations
src/data/numerology-compatibility.ts     # Pair compatibility meanings
src/data/numerology-wedding.ts           # Wedding date scoring data
src/pages/numerology-page.tsx            # Main page with tabs
src/components/numerology/
  tab-personal-profile.tsx               # Ho so ca nhan
  tab-compatibility.tsx                  # Tuong hop cap doi
  tab-wedding-dates.tsx                  # Ngay cuoi may man
  tab-yearly-forecast.tsx                # Du bao nam ca nhan
  tab-lucky-attributes.tsx               # Mau sac & con so may man
  ai-numerology-card.tsx                 # Optional AI deep reading
```

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Core Calculations](phase-01-core-calculations.md) | complete | 1h |
| 2 | [Data & Interpretations](phase-02-data-interpretations.md) | complete | 1.5h |
| 3 | [UI Components](phase-03-ui-components.md) | complete | 1.5h |
| 4 | [Page & Routing](phase-04-page-and-routing.md) | complete | 0.5h |
| 5 | [AI Integration](phase-05-ai-integration.md) | complete | 1h |
| 6 | [Testing & Polish](phase-06-testing-and-polish.md) | complete | 0.5h |

## Dependencies

- Existing `CoupleInfo` type (birth dates, names)
- Existing AI infrastructure (`api/ai.ts`, ZhipuAI)
- shadcn/ui Button component
- Theme CSS variables pattern

## Key Decisions

1. Name input: optional full-name field within numerology page, stored in `useState` (not WeddingState)
2. Compatibility weights: Life Path 40%, Expression 20%, Soul Urge 20%, Birthday 10%, Personal Year 10%
3. Master numbers 11/22/33 preserved (not reduced)
4. Vietnamese diacritics stripped before letter-to-number mapping
5. No .en.ts files, no i18n keys — Vietnamese only
