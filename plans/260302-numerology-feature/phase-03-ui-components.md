# Phase 3: UI Components

## Context Links

- Parent plan: [plan.md](plan.md)
- Depends on: [Phase 1](phase-01-core-calculations.md), [Phase 2](phase-02-data-interpretations.md)
- Reference: `src/components/astrology/tab-personal.tsx` (tab component pattern)
- Reference: `src/components/astrology/ai-reading-card.tsx` (AI card pattern)

## Overview

- **Priority**: P1 (blocks page assembly)
- **Status**: complete
- **Description**: Build 5 tab components + 1 AI card for the numerology page, following astrology component patterns exactly.

## Key Insights

- Mirror `src/components/astrology/` folder structure
- Each tab receives calculated data as props, not raw state
- Bride/groom toggle pattern from `tab-personal.tsx` reused
- Theme CSS vars via `var(--theme-surface)`, `var(--theme-border)`
- Optional full-name input lives in tab-personal-profile (local state)
- Cards use `bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)]` pattern

## Requirements

### Functional
- 5 tab components showing different numerology aspects
- Full-name input within personal profile tab (optional, fallback to CoupleInfo names)
- Bride/groom toggle on personal profile and yearly forecast tabs
- Color-coded compatibility score display
- Wedding date calendar with color-coded suitability
- Lucky colors shown as swatches, lucky numbers as badges

### Non-functional
- Each component under 200 lines
- Responsive (mobile-first)
- Use existing shadcn Button component
- Vietnamese only (hardcoded strings)

## Architecture

### Component Tree

```
numerology-page.tsx
  +-- NameInputSection (optional full name inputs)
  +-- Tab Navigation (horizontal scroll pills)
  +-- tab-personal-profile.tsx
  |     +-- bride/groom toggle
  |     +-- profile header card (number + name + keywords)
  |     +-- traits/strengths/weaknesses sections
  |     +-- marriage disposition card
  +-- tab-compatibility.tsx
  |     +-- score ring/bar visualization
  |     +-- breakdown cards (Life Path, Expression, etc.)
  |     +-- overall assessment text
  +-- tab-wedding-dates.tsx
  |     +-- month selector
  |     +-- date grid with color-coded cells
  |     +-- selected date detail card
  +-- tab-yearly-forecast.tsx
  |     +-- bride/groom toggle
  |     +-- personal year number + meaning
  |     +-- year themes and advice
  +-- tab-lucky-attributes.tsx
  |     +-- lucky numbers as badges
  |     +-- lucky colors as swatches
  |     +-- career suggestions
  |     +-- wedding-specific advice
  +-- ai-numerology-card.tsx
        +-- request button
        +-- loading state
        +-- response display
```

## Related Code Files

### Files to Create
- `src/components/numerology/tab-personal-profile.tsx`
- `src/components/numerology/tab-compatibility.tsx`
- `src/components/numerology/tab-wedding-dates.tsx`
- `src/components/numerology/tab-yearly-forecast.tsx`
- `src/components/numerology/tab-lucky-attributes.tsx`
- `src/components/numerology/ai-numerology-card.tsx`

### Files to Reference
- `src/components/astrology/tab-personal.tsx` — toggle + profile pattern
- `src/components/astrology/tab-compatibility.tsx` — score display
- `src/components/astrology/ai-reading-card.tsx` — AI fetch + display
- `src/components/ui/button.tsx` — shadcn button

## Implementation Steps

### 1. tab-personal-profile.tsx (~150 lines)

1. Props: `{ info: CoupleInfo; fullNames: { bride: string; groom: string } }`
2. Local state: `activeProfile: "bride" | "groom"`
3. Compute `NumerologyProfile` using `calcFullProfile(birthDate, fullName)`
4. Lookup `NumerologyNumberProfile` from data via `getNumerologyProfile(lifePath)`
5. Render:
   - Bride/groom toggle buttons (same pattern as `tab-personal.tsx` ToggleButton)
   - Hero card: large number display, Vietnamese name, emoji, keywords
   - Traits list with bullet points
   - Strengths (green badges) / Weaknesses (amber badges)
   - Marriage disposition card
   - All 8 numbers summary grid (2x4)

### 2. tab-compatibility.tsx (~130 lines)

1. Props: `{ profile1: NumerologyProfile; profile2: NumerologyProfile; brideName: string; groomName: string }`
2. Call `calcCompatibility(profile1, profile2)` for overall score
3. Render:
   - Score circle: number in center, color by level (green/yellow/orange/red)
   - Level label in Vietnamese
   - Breakdown cards: each factor (Life Path, Expression, etc.) with weight + harmony bar
   - Harmony description from `getNumberHarmony()` for Life Path pair
   - Wedding advice summary

### 3. tab-wedding-dates.tsx (~180 lines)

1. Props: `{ lifePath1: number; lifePath2: number }`
2. Local state: selected month (default current month)
3. Generate days for selected month
4. For each day: `calcWeddingDateScore(dateStr, lifePath1, lifePath2)`
5. Render:
   - Month nav (prev/next buttons)
   - 7-column date grid
   - Color-coded cells: green (>80), yellow (60-80), gray (40-60), red (<40)
   - Tap a day to see detail card: Universal Day Number, meaning, tip, harmony with each partner

### 4. tab-yearly-forecast.tsx (~100 lines)

1. Props: `{ info: CoupleInfo; fullNames: { bride: string; groom: string } }`
2. Bride/groom toggle
3. Calculate Personal Year number for current year
4. Lookup Personal Year meaning from profiles
5. Render:
   - Large Personal Year number
   - Year theme title + description
   - Advice cards for love, career, health
   - "Ket hop voi nam cuoi" section if wedding this year

### 5. tab-lucky-attributes.tsx (~120 lines)

1. Props: `{ profile: NumerologyNumberProfile; brideName: string; groomName: string }`
2. Bride/groom toggle
3. Render:
   - Lucky numbers: rounded badges with numbers
   - Lucky colors: color swatches with Vietnamese names
   - Career directions: icon + text list
   - Wedding advice card: profile.weddingAdvice

### 6. ai-numerology-card.tsx (~100 lines)

1. Clone pattern from `ai-reading-card.tsx`
2. Props: `{ birthDate: string; fullName: string; lifePath: number }`
3. POST to `/api/ai?action=numerology`
4. Render: same loading/error/result pattern
5. Require both birth date and full name to enable button

## Todo List

- [ ] Create `src/components/numerology/` directory
- [ ] Implement tab-personal-profile.tsx
- [ ] Implement tab-compatibility.tsx
- [ ] Implement tab-wedding-dates.tsx
- [ ] Implement tab-yearly-forecast.tsx
- [ ] Implement tab-lucky-attributes.tsx
- [ ] Implement ai-numerology-card.tsx
- [ ] Verify all components use theme CSS vars
- [ ] Verify mobile responsiveness
- [ ] Run `npm run build`

## Success Criteria

- All 6 components render without errors
- Bride/groom toggle switches data correctly
- Wedding date grid shows color-coded cells
- Score circle displays correctly at all levels
- AI card handles loading/error/cached states
- All Vietnamese strings use proper diacritics
- Each file under 200 lines

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Wedding date grid too slow for full month calc | Laggy UI | useMemo for date calculations |
| Component exceeds 200 lines | Code standard violation | Extract sub-sections (e.g. number-summary-grid.tsx) |

## Security Considerations

- AI card sends only birth date + name — no sensitive data
- No localStorage writes in components (that's the page's job)

## Next Steps

- Phase 4 wires these components into the main page and router
