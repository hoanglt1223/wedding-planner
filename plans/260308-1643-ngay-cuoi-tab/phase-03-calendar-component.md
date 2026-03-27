# Phase 3: Calendar Component

## Context
- [tab-wedding-dates.tsx](../../src/components/numerology/tab-wedding-dates.tsx) — reference calendar pattern
- [tab-compatibility.tsx](../../src/components/astrology/tab-compatibility.tsx) — styling patterns
- Phase 2 provides `getMonthScoredDates()` and `ScoredDate`

## Overview
- **Priority:** P1
- **Status:** pending
- Monthly calendar grid with color-coded days + top picks summary

## Key Insights

Follow numerology calendar pattern exactly: month nav, 7-col grid, color legend. Add:
- Lunar day number as subscript in each cell
- Top picks section listing best 3-5 dates of the month

## Requirements

### Functional
- Month navigation (prev/next arrows)
- 7-column grid (Mon-Sun), color-coded cells:
  - Green (`bg-green-500 text-white`): score >= 70 (good + personal match)
  - Light green (`bg-green-200`): score 50-69 (Hoang Dao but partial match)
  - Gray (`bg-gray-100`): score 20-49 (Hac Dao / neutral)
  - Red (`bg-red-200`): score < 20 (avoidance days)
- Each cell shows solar day + tiny lunar day
- Click day → `onSelectDay(date)` callback
- Selected day ring indicator
- Color legend bar
- Top picks section: filter score >= 70, sort desc, show top 5 with brief info

### Non-functional
- Responsive on mobile (cells at least 36px)
- Memoize month data with useMemo
- <150 lines for calendar, <60 lines for top picks

## Architecture

```
tab-wedding-date.tsx (main tab container ~100 lines)
  ├── wedding-date-calendar.tsx (calendar grid ~150 lines)
  └── wedding-date-detail.tsx (Phase 4)
```

`tab-wedding-date.tsx` manages state: month/year, selectedDay. Passes scored dates down.

## Related Code Files
- **Create:** `src/components/astrology/tab-wedding-date.tsx`
- **Create:** `src/components/astrology/wedding-date-calendar.tsx`

## Implementation Steps

1. Create `wedding-date-calendar.tsx`:
   a. Props: `scoredDates: ScoredDate[]`, `firstDayOfWeek: number`, `selectedDay: number | null`, `onSelectDay: (day: number) => void`, `month: number`, `year: number`
   b. Weekday headers row (T2-CN)
   c. Empty cells for offset
   d. Day cells with color based on score thresholds
   e. Each cell: solar day (main), lunar day (tiny subscript from `scoredDate.lunar.day`)
   f. Legend bar at bottom

2. Create `tab-wedding-date.tsx`:
   a. Props: `brideYear, groomYear, weddingYear, lang`
   b. State: `month`, `year`, `selectedDay`
   c. `useMemo` → `getMonthScoredDates(month, year, brideYear, groomYear)`
   d. Month nav with arrows
   e. Render `WeddingDateCalendar`
   f. Top Picks section: filter/sort scored dates, show top 5 as mini cards (date, lunar date, score badge, 1-line reason)
   g. Conditionally render `WeddingDateDetail` when selectedDay set (Phase 4)

## Todo
- [ ] Create wedding-date-calendar.tsx with grid + legend
- [ ] Create tab-wedding-date.tsx with month nav + top picks
- [ ] Lunar day subscript in cells
- [ ] Score-based coloring with thresholds
- [ ] Top picks summary section
- [ ] Selected day ring indicator

## Success Criteria
- Calendar renders current month on load
- Color coding matches score thresholds
- Top picks show only high-score dates sorted desc
- Clicking a day highlights it
- Smooth month transitions

## Risk Assessment
- **Low:** Direct adaptation of existing numerology calendar pattern
- Mobile cell size — test with 7 columns on 320px screens
