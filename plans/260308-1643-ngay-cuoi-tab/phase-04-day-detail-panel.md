# Phase 4: Day Detail Panel

## Context
- Phase 1 provides `getHoangDaoHours()`, `getAuspiciousHours()`
- Phase 2 provides `ScoredDate` with warnings, score breakdown
- [tab-wedding-dates.tsx](../../src/components/numerology/tab-wedding-dates.tsx) — detail panel pattern (lines 97-120)

## Overview
- **Priority:** P1
- **Status:** pending
- Panel shown when user clicks a calendar day; displays comprehensive day analysis

## Requirements

### Functional
When a day is selected, show card with:

**Header row:**
- Solar date formatted: "Thu 5, 15/6/2026"
- Score badge (colored pill)

**Section 1 — Lunar & Can Chi:**
- Lunar date: "Mung 1 thang 5 nam Binh Ngo"
- Day Can Chi: "Giap Ty"
- Day element with emoji

**Section 2 — Day Quality:**
- Hoang Dao / Hac Dao status with celestial official name
- Tam Nuong warning (if applicable, red banner)
- Nguyet Ky warning (if applicable, red banner)

**Section 3 — Personal Match:**
- Day element vs bride element compatibility (icon + text)
- Day element vs groom element compatibility (icon + text)
- Tam Tai / Kim Lau warnings for bride/groom (if any)

**Section 4 — Gio Hoang Dao:**
- Grid of 6 auspicious hours with time ranges
- Highlight recommended ceremony hours (typically Thin 7-9, Ngo 11-13)
- Show chi name + time range + celestial name

**Section 5 — Recommendation:**
- Single sentence summary: "Ngay tot de to chuc le cuoi" / "Nen tranh ngay nay"

### Non-functional
- Smooth slide-in or fade animation (CSS transition)
- <150 lines

## Architecture

Single component: `wedding-date-detail.tsx`
- Props: `scoredDate: ScoredDate`, `brideYear: number`, `groomYear: number`, `lang: string`
- Internally calls `getAuspiciousHours(dayChiIndex)` — needs dayChiIndex from scoredDate (extend ScoredDate or recompute)

## Related Code Files
- **Create:** `src/components/astrology/wedding-date-detail.tsx`
- **Modify:** `src/data/auspicious/types.ts` — add `dayChiIndex` to ScoredDate if not already present

## Implementation Steps

1. Ensure `ScoredDate` includes `dayChiIndex` (from Phase 2, or add here)
2. Create `wedding-date-detail.tsx`
3. Header: format solar date with weekday, show score badge
4. Lunar section: format "Mung X thang Y" from lunar data + canChi
5. Day quality section: Hoang Dao status card, avoidance warnings
6. Personal match: 2-col grid showing element compatibility for bride/groom
7. Gio Hoang Dao: 2x3 grid of auspicious hour cards, each with chi name + time
8. Recommendation sentence based on score thresholds

## Todo
- [ ] Create wedding-date-detail.tsx
- [ ] Header with date + score badge
- [ ] Lunar + Can Chi section
- [ ] Day quality (Hoang Dao / avoidance warnings)
- [ ] Personal match grid (element compat for both)
- [ ] Gio Hoang Dao grid
- [ ] Recommendation summary

## Success Criteria
- All 5 info sections render correctly for any selected day
- Avoidance days show red warning banners
- Auspicious hours grid shows exactly 6 hours
- Responsive on mobile

## Risk Assessment
- **Low:** Pure display component, data already prepared by scoring service
- Ensure `dayChiIndex` is available on ScoredDate — may need to thread it through from Phase 2
