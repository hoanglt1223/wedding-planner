# Phase 2: Personal Scoring Service

## Context
- [ngu-hanh.ts](../../src/data/auspicious/ngu-hanh.ts) — element from birth year, compatibility
- [astrology.ts](../../src/lib/astrology.ts) — Tam Tai, Kim Lau, Thai Tue checks
- [index.ts](../../src/data/auspicious/index.ts) — getDateInfo() returns base day info

## Overview
- **Priority:** P1 (blocks Phase 3 calendar coloring)
- **Status:** pending
- Composite scoring that combines base day quality with personal factors for a couple

## Key Insights

Score composition (0-100 scale):
- **Base (40pts):** Hoang Dao +30, no avoidance days +10
- **Ngu Hanh match (30pts):** Day's element vs bride/groom elements — Tuong Sinh +30, neutral +15, Tuong Khac +0
- **Year factors (30pts):** No Tam Tai +15, no Kim Lau +10, no Thai Tue +5

Penalty overrides: Tam Nuong or Nguyet Ky day → cap score at 10 regardless

## Requirements

### Functional
- `scoreDateForCouple(dateInfo: DateInfo, brideYear: number, groomYear: number, weddingYear: number): ScoredDate`
- `ScoredDate` extends `DateInfo` with: `score`, `scoreBreakdown`, `warnings[]`, `ngoHanhMatch`, `kimLauBride/Groom`, `tamTaiBride/Groom`
- `getMonthScoredDates(month, year, brideYear, groomYear): ScoredDate[]` — batch for calendar
- Day element derived from day Can Chi heavenly stem → Ngu Hanh

### Non-functional
- Pure, memoizable
- <120 lines

## Architecture

Day's element: extract Heavenly Stem from `dateInfo.canChi` string → map to element via existing `getElement` logic but for stems not years. Need a small `STEM_TO_ELEMENT` map:
```
Giap/At → Moc, Binh/Dinh → Hoa, Mau/Ky → Tho, Canh/Tan → Kim, Nham/Quy → Thuy
```

## Related Code Files
- **Create:** `src/data/auspicious/wedding-day-scoring.ts`
- **Modify:** `src/data/auspicious/types.ts` (add ScoredDate interface)
- **Modify:** `src/data/auspicious/index.ts` (re-export)

## Implementation Steps

1. Add `ScoredDate` and `ScoreBreakdown` interfaces to `types.ts`
2. Create `wedding-day-scoring.ts`
3. Define `STEM_TO_ELEMENT` map (10 stems → 5 elements)
4. Implement `getDayElement(canChi: string): string` — parse first word of canChi string
5. Implement `scoreDateForCouple()`:
   a. Start with base score from auspiciousLevel
   b. Get day element, compare with bride/groom elements via `getCompatibility`
   c. Check Tam Tai for bride/groom year vs wedding year
   d. Check Kim Lau for bride/groom
   e. Sum weighted scores, apply avoidance cap
   f. Collect warnings array
6. Implement `getMonthScoredDates()` — wraps getMonthData + scoring
7. Re-export from index.ts

## Todo
- [ ] Add ScoredDate, ScoreBreakdown to types.ts
- [ ] Create wedding-day-scoring.ts
- [ ] Implement STEM_TO_ELEMENT mapping
- [ ] Implement scoreDateForCouple with weighted scoring
- [ ] Implement getMonthScoredDates batch helper
- [ ] Re-export from index.ts

## Success Criteria
- A Hoang Dao day with good element match for couple scores 80+
- A Tam Nuong day always scores <=10
- Warnings include specific Tam Tai / Kim Lau notices

## Risk Assessment
- **Medium:** Day element derivation from canChi string parsing — ensure consistent format from `getDayCanChiStr()`
- Verify `canChi` format is always "Stem Branch" (space-separated) — confirmed in lunar-service.ts
