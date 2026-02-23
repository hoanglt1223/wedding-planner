# Phase 3: Astrology English Data (3 Files)

## Context
- Parent: [plan.md](plan.md)
- Depends on: Phase 1 (resolve-data.ts references)
- Vietnamese originals: `src/data/astrology-*.ts`

## Overview
- **Priority:** P1
- **Status:** Completed
- **Description:** Create 3 English .en.ts files for astrology zodiac profiles, element profiles, yearly forecasts
- **Completed:** 2026-02-23

## Key Insights
- Astrology content is most culturally specific — needs careful annotation
- Vietnamese zodiac uses Cat (Mèo) not Rabbit — must note this cultural difference
- Ngũ Hành (Five Elements) is Vietnamese/Chinese philosophy — needs brief context
- Yearly forecasts reference Chinese calendar terminology (Bính Ngọ, etc.)
- All Vietnamese terms should be preserved alongside English translations

## Requirements
### Functional
- Zodiac profiles: 12 signs with all fields translated, Vietnamese branch names preserved
- Element profiles: 5 elements with all fields translated, Vietnamese element names preserved
- Yearly forecasts: 12 forecasts with overview/love/career/wealth/health translated

### Non-Functional
- Max 200 lines per file (zodiac may be tight — 12 signs × ~15 lines each)
- Same TypeScript interfaces (ZodiacProfile, ElementProfile, YearlyForecast)

## Related Code Files
### Create
- `src/data/astrology-zodiac-profiles.en.ts`
- `src/data/astrology-element-profiles.en.ts`
- `src/data/astrology-yearly-forecast.en.ts`

## Implementation Steps

### 1. Zodiac Profiles (`astrology-zodiac-profiles.en.ts`)

Translation pattern per sign:
```typescript
{
  branch: "Ty",              // Keep romanized Vietnamese
  animal: "Rat",             // English animal name
  emoji: "🐀",              // Same emoji
  traits: ["Intelligent", "Alert", "Adaptable", "Frugal"],
  strengths: ["High adaptability", "Quick thinking", "Good financial management"],
  weaknesses: ["Calculative", "Indecisive under pressure"],
  marriageDisposition: "Practical in love, carefully chooses life partner. Loyal and reliable once relationship is stable.",
  luckyNumbers: [2, 3],     // Same numbers
  luckyColors: ["Green", "Yellow"],
  luckyDirections: ["North", "Southeast"],
  compatibleSigns: ["Dragon (Thin)", "Monkey (Than)", "Ox (Suu)"],  // English + Vietnamese
  careers: ["Business", "Finance", "IT"],
}
```

**Special notes:**
- Vietnamese zodiac has Cat (Mèo) not Rabbit — annotate this: `animal: "Cat"` with comment
- Compatible signs should show both English and Vietnamese names
- Lucky colors/directions translated directly
- Career categories translated to English equivalents

### 2. Element Profiles (`astrology-element-profiles.en.ts`)

Translation pattern per element:
```typescript
{
  key: "metal",              // Same key
  label: "Metal (Kim)",      // English + Vietnamese
  emoji: "🪙",              // Same
  coreTraits: ["Resolute", "Decisive", "Principled", "Steadfast"],
  marriageTraits: "Strong protector and loyal partner. Sometimes rigid and inflexible — needs to learn compromise in marriage.",
  healthTendencies: "Watch lungs, respiratory system and skin. Practice deep breathing, yoga, avoid polluted environments.",
  luckyColors: ["White", "Silver", "Pale Yellow"],
  unluckyColors: ["Red", "Orange"],
  luckyNumbers: [4, 9],
  luckyDirections: ["West", "Northwest"],
  season: "Autumn (lunar months 7-9)",
}
```

### 3. Yearly Forecasts (`astrology-yearly-forecast.en.ts`)

Translation pattern per sign:
```typescript
{
  branch: "Ty",
  animal: "Rat",
  year: 2026,
  overview: "The Year of the Horse (Binh Ngo) 2026 brings many big changes for the Rat. Horse clashes with Rat — stay flexible, avoid risky investments, keep calm.",
  love: { rating: 3, description: "Romance is stable but lacks surprises. Couples should proactively create memories and listen more to each other." },
  career: { rating: 4, description: "Career picks up from mid-year with noble person support. Opportunities for promotion or positive career shifts." },
  wealth: { rating: 3, description: "Finances stable — avoid large loans. Side income may exceed main income." },
  health: { rating: 3, description: "Watch digestive system and sleep quality. Exercise regularly to maintain energy." },
}
```

**Special notes:**
- Keep Chinese calendar year names romanized: "Bính Ngọ" → "Binh Ngo" in parentheses
- Explain "tam hợp" (triple harmony) concept briefly where referenced
- "Quý nhân" → "noble person / benefactor" (cultural concept)

## Todo
- [x] Create astrology-zodiac-profiles.en.ts (12 signs)
- [x] Create astrology-element-profiles.en.ts (5 elements)
- [x] Create astrology-yearly-forecast.en.ts (12 forecasts)
- [x] Verify all compile

## Success Criteria
- All 3 files export correct types matching Vietnamese counterparts
- Vietnamese terms preserved in parentheses throughout
- Cultural concepts (tam hop, quy nhan, etc.) briefly explained
- Cat vs Rabbit difference noted for Vietnamese zodiac
- TypeScript compilation passes

## Risk Assessment
- zodiac-profiles.en.ts may exceed 200 lines (12 signs × ~17 lines = ~204) → use more concise formatting or split into zodiac-profiles-1.en.ts and zodiac-profiles-2.en.ts
- Cultural nuance in forecast descriptions — may need user review for tone

## Security Considerations
- No security impact — pure data files

## Next Steps
- Phase 5: Wire into astrology components via resolve-data.ts
