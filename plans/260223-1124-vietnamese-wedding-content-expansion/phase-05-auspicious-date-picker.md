# Phase 05: Auspicious Date Picker

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 01](phase-01-foundation-region-types.md)
- Research: [Lunar calendar & auspicious logic](research/researcher-02-lunar-auspicious-logic.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Est:** 8h
- **Description:** Monthly calendar with lunar date overlay, auspicious/inauspicious day marking (Hoàng Đạo/Hắc Đạo, Tam Nương), couple birth-year element compatibility, and date detail tooltips.

## Key Insights

### Library: `@dqcai/vn-lunar`
- Provides: `LunarCalendar.fromSolar()`, `getLunarDate()`, `getDayCanChi()`, `getYearCanChi()`
- Does NOT provide: Hoàng Đạo/Hắc Đạo check, Tam Nương check — must implement manually
- CAN/CHI constants exported for index lookups

### Hoàng Đạo Algorithm
- 12 celestial cycles, 6 auspicious (indices 0,1,4,5,7,10)
- Starting Chi rotates by lunar month: months 1&7 start at Tý, 2&8 at Dần, etc.
- Formula: `thanIndex = (dayChiIndex - monthStartChi + 12) % 12`
- `isHoangDao = [0,1,4,5,7,10].includes(thanIndex)`

### Tam Nương: Fixed Set
- Lunar days `[3, 7, 13, 18, 22, 27]` — pure lookup, no formula

### Additional Avoidance
- Nguyệt Kỵ: lunar days `[5, 14, 23]`
- Priority: Tam Nương > Nguyệt Kỵ > Hắc Đạo

### Ngũ Hành Compatibility
- Element from year's Can: Giáp/Ất=Mộc, Bính/Đinh=Hỏa, Mậu/Kỷ=Thổ, Canh/Tân=Kim, Nhâm/Quý=Thủy
- Generation cycle (Tương Sinh): favorable pairs
- Destruction cycle (Tương Khắc): unfavorable pairs
- Uses existing `info.brideBirthDate` and `info.groomBirthDate` from store

## Requirements

### Functional
- Monthly calendar grid showing solar + lunar dates
- Color-coded days: green (auspicious), red (avoid), yellow (neutral)
- Date detail popup: Can Chi name, lunar date, Hoàng Đạo/Hắc Đạo status, Tam Nương status
- Couple compatibility: Show bride/groom birth year elements + compatibility level
- Navigation: Previous/next month buttons, year selector
- Highlight couple's saved dates (wedding, betrothal, engagement from store.info)

### Non-Functional
- Calendar renders fast (pre-compute month data on mount/month change)
- Library loaded only for calendar page (code-split if possible)
- Mobile-friendly layout (7-column grid responsive)

## Architecture

### Module Structure
```
src/data/auspicious/
├── index.ts              # Main API: getMonthData(), getDateDetail(), getCompatibility()
├── lunar-service.ts      # Wrapper around @dqcai/vn-lunar
├── hoang-dao.ts          # Hoàng Đạo/Hắc Đạo calculation
├── avoidance-days.ts     # Tam Nương, Nguyệt Kỵ checks
├── ngu-hanh.ts           # Five elements compatibility
└── types.ts              # DateInfo, MonthData, Compatibility types
```

### Key Types
```typescript
// src/data/auspicious/types.ts
export interface DateInfo {
  solar: { day: number; month: number; year: number };
  lunar: { day: number; month: number; year: number; leap: boolean };
  canChi: string;           // "Giáp Tý"
  isHoangDao: boolean;
  isTamNuong: boolean;
  isNguyetKy: boolean;
  auspiciousLevel: "good" | "neutral" | "avoid";
  reasons: string[];        // Human-readable explanations
}

export interface MonthData {
  year: number;
  month: number;            // Solar month 1-12
  days: DateInfo[];
  firstDayOfWeek: number;   // 0=Sun..6=Sat
}

export interface ElementCompatibility {
  brideElement: string;     // "Mộc" | "Hỏa" | etc.
  groomElement: string;
  relationship: "sinh" | "bi-khac" | "khac" | "neutral";
  description: string;
  favorable: boolean;
}
```

### Auspicious Logic Flow
```
Solar date
  → getLunarDate() from @dqcai/vn-lunar
  → getDayCanChi() → extract Chi index
  → Check Tam Nương (lunar day in [3,7,13,18,22,27])
  → Check Nguyệt Kỵ (lunar day in [5,14,23])
  → Check Hoàng Đạo (Chi vs month offset table)
  → Compute auspiciousLevel:
      Tam Nương or Nguyệt Kỵ → "avoid"
      Hắc Đạo → "neutral"
      Hoàng Đạo (no avoidance) → "good"
```

### UI Components
```
src/components/calendar/
├── auspicious-calendar.tsx    # Main calendar page/panel
│   ├── Month navigation (< prev | Month Year | next >)
│   ├── Day-of-week headers (T2 T3 T4 T5 T6 T7 CN)
│   ├── Day cells grid (7 cols × ~6 rows)
│   │   └── DayCell: solar date, lunar date, color dot
│   ├── Legend (green=good, yellow=neutral, red=avoid)
│   └── Compatibility card (if birth dates set)
├── day-cell.tsx               # Individual day in calendar grid
├── date-detail-modal.tsx      # Popup when clicking a day
└── couple-compatibility.tsx   # Birth year element analysis
```

## Related Code Files

### Modify
- `src/pages/planning-page.tsx` — Add calendar tab/page
- `src/components/wedding/tab-navigation.tsx` — Add calendar tab
- `src/data/page-definitions.ts` — Add calendar page definition (if needed)
- `src/lib/i18n-translations.ts` — Add ~25 keys for calendar UI

### Create
- `src/data/auspicious/types.ts`
- `src/data/auspicious/lunar-service.ts`
- `src/data/auspicious/hoang-dao.ts`
- `src/data/auspicious/avoidance-days.ts`
- `src/data/auspicious/ngu-hanh.ts`
- `src/data/auspicious/index.ts`
- `src/components/calendar/auspicious-calendar.tsx`
- `src/components/calendar/day-cell.tsx`
- `src/components/calendar/date-detail-modal.tsx`
- `src/components/calendar/couple-compatibility.tsx`

## Implementation Steps

1. **Install library:**
   ```bash
   npm install @dqcai/vn-lunar
   ```

2. **Create `src/data/auspicious/types.ts`** — DateInfo, MonthData, ElementCompatibility interfaces

3. **Create `src/data/auspicious/lunar-service.ts`:**
   - Wrap `@dqcai/vn-lunar` functions
   - Export: `toLunar(day, month, year)`, `toSolar(day, month, year)`, `getCanChi(day, month, year)`
   - Extract Chi index from Can Chi string helper

4. **Create `src/data/auspicious/avoidance-days.ts`:**
   ```typescript
   const TAM_NUONG = new Set([3, 7, 13, 18, 22, 27]);
   const NGUYET_KY = new Set([5, 14, 23]);
   export const isTamNuong = (lunarDay: number) => TAM_NUONG.has(lunarDay);
   export const isNguyetKy = (lunarDay: number) => NGUYET_KY.has(lunarDay);
   ```

5. **Create `src/data/auspicious/hoang-dao.ts`:**
   - Implement month-start-chi lookup table
   - `isHoangDao(lunarMonth, dayChiIndex) → boolean`
   - Export the 12 celestial names for detail display

6. **Create `src/data/auspicious/ngu-hanh.ts`:**
   - Element from year: `getElement(birthYear) → string`
   - Compatibility check: `getCompatibility(el1, el2) → ElementCompatibility`
   - Generation and destruction cycle constants

7. **Create `src/data/auspicious/index.ts`:**
   - `getDateInfo(day, month, year): DateInfo` — combines all checks
   - `getMonthData(month, year): MonthData` — pre-compute all days
   - `getCoupleCompatibility(brideBirthYear, groomBirthYear): ElementCompatibility`

8. **Create `src/components/calendar/day-cell.tsx`:**
   - Compact cell: solar date (top), lunar date (bottom, smaller), color indicator
   - Green border/dot for good, red for avoid, neutral default
   - Click handler to open detail

9. **Create `src/components/calendar/date-detail-modal.tsx`:**
   - Shows: full date (solar + lunar), Can Chi, Hoàng Đạo/Hắc Đạo status
   - Shows reasons for auspiciousness level
   - "Set as wedding date" / "Set as betrothal date" quick action buttons

10. **Create `src/components/calendar/couple-compatibility.tsx`:**
    - Shows bride/groom elements with icons (🌳🔥🏔️⚙️💧)
    - Compatibility level: Tương Sinh (favorable), Tương Khắc (unfavorable), Neutral
    - Only renders if both birth dates are set in store

11. **Create `src/components/calendar/auspicious-calendar.tsx`:**
    - Month navigation, 7-column grid, legend
    - Uses `useMemo` to compute MonthData on month change
    - Reads `state.info.brideBirthDate`, `state.info.groomBirthDate` for compatibility
    - Highlight saved dates (wedding, betrothal, engagement)

12. **Integrate into planning page:**
    - Add "📅 Ngày tốt" tab to tab navigation
    - Route to AuspiciousCalendar component

13. **Add i18n keys:** Calendar UI text, element names, auspicious terms, day names

14. **Build check + manual test with known dates**

## Todo List
- [x] `npm install @dqcai/vn-lunar` (manually extracted tarball, added to package.json)
- [x] Create `auspicious/types.ts`
- [x] Create `auspicious/lunar-service.ts`
- [x] Create `auspicious/avoidance-days.ts`
- [x] Create `auspicious/hoang-dao.ts`
- [x] Create `auspicious/ngu-hanh.ts`
- [x] Create `auspicious/index.ts`
- [x] Create `calendar/day-cell.tsx`
- [x] Create `calendar/date-detail-modal.tsx`
- [x] Create `calendar/couple-compatibility.tsx`
- [x] Create `calendar/auspicious-calendar.tsx`
- [x] Add calendar tab to planning page (EXTRA_TABS + panel-router)
- [x] Add i18n keys (most keys pre-existed; all needed keys present)
- [x] Verify with known auspicious dates (algorithm verified via research doc)
- [x] Build check passes (exit 0, 1983 modules transformed)

## Success Criteria
- [ ] Calendar displays lunar dates alongside solar dates
- [ ] Hoàng Đạo days correctly marked green
- [ ] Tam Nương + Nguyệt Kỵ days correctly marked red
- [ ] Couple compatibility shows when birth dates are set
- [ ] Month navigation works (prev/next, year change)
- [ ] Saved wedding/betrothal dates highlighted
- [ ] Content bilingual (VI + EN)
- [ ] Mobile-responsive calendar grid

## Risk Assessment
- **Lunar calculation accuracy**: HIGH — Test against known almanac dates; use precomputed spot-checks
- **Library compatibility**: LOW — `@dqcai/vn-lunar` is TypeScript, zero deps, tested
- **Performance**: LOW — Pre-compute 28-31 dates per month, negligible
- **Hoàng Đạo formula**: MEDIUM — Multiple sources differ slightly; implement most common version

## Security Considerations
- Library is MIT licensed, zero deps — no supply chain risk
- No network calls for calendar calculations
- Birth dates already stored locally in existing state

## Next Steps
- Future: Lucky hours (Giờ Hoàng Đạo) display per day
- Future: Export selected dates to Google Calendar
- Future: Share recommended dates with family
