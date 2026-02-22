---
phase: 3
title: "Static Content Data Files"
status: completed
priority: P1
effort: 3h
---

# Phase 3: Static Content Data Files

## Context Links

- [plan.md](./plan.md) | [researcher-01 report](./research/researcher-01-zodiac-personality-content.md)
- [astrology.ts](../../src/lib/astrology.ts) | [astrology-feng-shui.ts](../../src/lib/astrology-feng-shui.ts)

## Overview

Create three static data files with Vietnamese astrology content: 12 zodiac personality profiles, 5 element profiles, and yearly forecasts. These provide the base content for the Personal tab (Phase 4). All text in Vietnamese with proper diacritics.

## Key Insights

- Research report has complete trait/marriage data for all 12 animals and 5 elements
- Lucky attributes (numbers, colors, directions, careers) available per zodiac AND per element
- Some data overlaps with existing `ELEMENT_COLORS`, `ELEMENT_NUMBERS`, `ELEMENT_SEASONS` in `astrology-feng-shui.ts` — reuse where possible, don't duplicate
- Yearly forecast is year-specific; for 2026 (Year of the Horse, Bính Ngọ), need 12 zodiac entries
- Keep each file under 200 lines

## Requirements

### Functional
1. Zodiac profiles: 12 objects with personality traits, strengths, weaknesses, marriage disposition, lucky attributes
2. Element profiles: 5 objects with core traits, marriage behavior, health tendencies
3. Yearly forecast: 12 objects with overall/love/career/wealth/health ratings + descriptions for 2026

### Non-functional
- All Vietnamese strings must use proper diacritics
- TypeScript interfaces for each data shape
- English variable names, Vietnamese UI strings
- Data files export typed arrays/objects for consumption by components

## Architecture

```
src/data/
  astrology-zodiac-profiles.ts    — 12 zodiac profiles (~180 lines)
  astrology-element-profiles.ts   — 5 element profiles (~100 lines)
  astrology-yearly-forecast.ts    — 12 forecasts for current year (~180 lines)
```

Types can live at top of each file (small interfaces) or in a shared types file if they grow.

## Related Code Files

### Modify
- None (these are new standalone data files)

### Create
- `src/data/astrology-zodiac-profiles.ts`
- `src/data/astrology-element-profiles.ts`
- `src/data/astrology-yearly-forecast.ts`

### Delete
- None

## Implementation Steps

### Step 1: Create zodiac profiles data

File: `src/data/astrology-zodiac-profiles.ts`

Define interface and export array:

```typescript
export interface ZodiacProfile {
  branch: string;           // "Tý", "Sửu", etc.
  animal: string;           // "Chuột", "Trâu", etc.
  emoji: string;            // "🐀", etc.
  traits: string[];         // 4-5 core personality traits
  strengths: string[];      // 3-4 strengths
  weaknesses: string[];     // 2-3 weaknesses
  marriageDisposition: string; // 1-2 sentence marriage/love summary
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDirections: string[];
  compatibleSigns: string[]; // Earthly Branch names of compatible signs
  careers: string[];         // 3-4 suitable career fields
}

export const ZODIAC_PROFILES: ZodiacProfile[] = [
  {
    branch: "Tý",
    animal: "Chuột",
    emoji: "🐀",
    traits: ["Thông minh", "Nhạy bén", "Linh hoạt", "Tiết kiệm"],
    strengths: ["Khả năng thích ứng cao", "Tư duy nhanh nhạy", "Quản lý tài chính giỏi"],
    weaknesses: ["Hay tính toán", "Thiếu quyết đoán khi áp lực"],
    marriageDisposition: "Thực dụng trong tình yêu, chọn bạn đời cẩn thận, trung thành khi ổn định.",
    luckyNumbers: [2, 3],
    luckyColors: ["Xanh lá", "Vàng"],
    luckyDirections: ["Bắc", "Đông Nam"],
    compatibleSigns: ["Thìn", "Thân", "Sửu"],
    careers: ["Kinh doanh", "Tài chính", "Công nghệ"],
  },
  // ... 11 more entries
];
```

Data sourced from researcher-01 report tables. Each entry follows the exact same shape. Use the research report's zodiac table (Section 1) for traits/marriage and Section 4 for lucky attributes.

Index order must match `EARTHLY_BRANCHES` in `astrology.ts`: Tý(0), Sửu(1), Dần(2), Mão(3), Thìn(4), Tỵ(5), Ngọ(6), Mùi(7), Thân(8), Dậu(9), Tuất(10), Hợi(11).

### Step 2: Create element profiles data

File: `src/data/astrology-element-profiles.ts`

```typescript
export interface ElementProfile {
  key: string;              // "metal", "wood", etc. (matches astrology.ts keys)
  label: string;            // "Kim", "Mộc", etc.
  emoji: string;            // "🪙", etc.
  coreTraits: string[];     // 4-5 personality traits
  marriageTraits: string;   // Marriage behavior summary
  healthTendencies: string; // Health pattern summary
  luckyColors: string[];
  unluckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
  season: string;           // Associated season
}

export const ELEMENT_PROFILES: ElementProfile[] = [
  {
    key: "metal",
    label: "Kim",
    emoji: "🪙",
    coreTraits: ["Cứng rắn", "Quyết đoán", "Nguyên tắc", "Kiên định"],
    marriageTraits: "Bảo vệ bạn đời mạnh mẽ; trung thành; đôi khi cứng nhắc, thiếu linh hoạt.",
    healthTendencies: "Cần chú ý phổi, đường hô hấp, da. Nên tập thở sâu, yoga.",
    luckyColors: ["Trắng", "Bạc", "Vàng nhạt"],
    unluckyColors: ["Đỏ", "Cam"],
    luckyNumbers: [4, 9],
    luckyDirections: ["Tây", "Tây Bắc"],
    season: "Thu (tháng 7-9 âm lịch)",
  },
  // ... 4 more: wood, water, fire, earth
];
```

Data sourced from researcher-01 Section 2 + Section 4 element tables. Reuse existing `ELEMENT_COLORS`/`ELEMENT_NUMBERS`/`ELEMENT_SEASONS` values from `astrology-feng-shui.ts` to ensure consistency — but element profiles add richer description text.

Order: metal, wood, water, fire, earth.

### Step 3: Create yearly forecast data

File: `src/data/astrology-yearly-forecast.ts`

```typescript
export interface YearlyForecast {
  branch: string;       // "Tý", etc.
  animal: string;       // "Chuột", etc.
  year: number;         // 2026
  overview: string;     // 2-3 sentence overall summary
  love: { rating: number; description: string };    // 1-5
  career: { rating: number; description: string };
  wealth: { rating: number; description: string };
  health: { rating: number; description: string };
}

export const FORECAST_YEAR = 2026;

export const YEARLY_FORECASTS: YearlyForecast[] = [
  {
    branch: "Tý",
    animal: "Chuột",
    year: 2026,
    overview: "Năm Bính Ngọ 2026 đem lại thay đổi lớn cho tuổi Tý. Cần linh hoạt ứng biến, tránh đầu tư mạo hiểm.",
    love: { rating: 3, description: "Tình duyên ổn định nhưng thiếu bất ngờ. Cặp đôi cần chủ động tạo kỷ niệm." },
    career: { rating: 4, description: "Sự nghiệp khởi sắc nửa cuối năm. Có quý nhân phù trợ." },
    wealth: { rating: 3, description: "Tài chính ổn, tránh cho vay lớn. Thu nhập phụ tốt hơn thu nhập chính." },
    health: { rating: 3, description: "Chú ý đường tiêu hóa và giấc ngủ. Nên tập thể dục đều đặn." },
  },
  // ... 11 more entries
];
```

Notes:
- 2026 is Year of the Horse (Bính Ngọ). Forecasts should reference this.
- Ratings 1-5 where 5 = excellent. Descriptions should be 1-2 sentences.
- Content is creative/informational, based on traditional Vietnamese astrology patterns from research.
- Export `FORECAST_YEAR` constant so UI can display the year dynamically.

### Step 4: Add lookup helpers

At bottom of each file, add helper functions:

In `astrology-zodiac-profiles.ts`:
```typescript
/** Get zodiac profile by Earthly Branch index (0=Tý, 1=Sửu, ...) */
export function getZodiacProfile(branchIndex: number): ZodiacProfile {
  return ZODIAC_PROFILES[branchIndex % 12];
}
```

In `astrology-element-profiles.ts`:
```typescript
/** Get element profile by key ("metal", "wood", etc.) */
export function getElementProfile(key: string): ElementProfile | undefined {
  return ELEMENT_PROFILES.find((p) => p.key === key);
}
```

In `astrology-yearly-forecast.ts`:
```typescript
/** Get yearly forecast by Earthly Branch index */
export function getYearlyForecast(branchIndex: number): YearlyForecast {
  return YEARLY_FORECASTS[branchIndex % 12];
}
```

## Todo List

- [x] Create `src/data/astrology-zodiac-profiles.ts` with 12 zodiac entries
- [x] Create `src/data/astrology-element-profiles.ts` with 5 element entries
- [x] Create `src/data/astrology-yearly-forecast.ts` with 12 forecast entries for 2026
- [x] Add lookup helper functions to each file
- [x] Verify all Vietnamese strings have proper diacritics
- [x] Verify index order matches `EARTHLY_BRANCHES` in `astrology.ts`
- [x] Verify element keys match existing keys in `astrology.ts` (metal, wood, water, fire, earth)
- [x] Run `npm run build` to check types
- [x] Each file under 200 lines

## Success Criteria

- All three data files compile without errors
- `getZodiacProfile(0)` returns Tý/Chuột profile
- `getElementProfile("metal")` returns Kim profile
- `getYearlyForecast(0)` returns 2026 Tý forecast
- All Vietnamese text uses proper diacritics
- No duplicate data with existing `astrology-feng-shui.ts` (reference, don't copy)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content accuracy for Vietnamese astrology | Medium | Based on researcher-01 report; mark as "tham khảo" (reference) in UI |
| Files exceed 200 lines | Low | Minimize description length; split if needed |
| Yearly forecast outdated next year | Low | Export FORECAST_YEAR constant; update file annually or generate via script |

## Security Considerations

- Static data only, no user input processing
- No API calls; purely client-side data

## Next Steps

- Phase 4 (Personal Tab UI) imports these data files to render profile sections
- Phase 5 (AI Reading API) uses zodiac/element data in system prompt
