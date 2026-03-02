# Brainstorm Report: Thần Số Học (Numerology) Feature

## Problem Statement
App has comprehensive Tử Vi (astrology) but zero numerology. Need full Pythagorean numerology system with Vietnamese wedding context.

## Confirmed Requirements
- **System**: Pythagorean base + Vietnamese wedding cultural interpretations
- **Features**: Full suite — profile, compatibility, wedding dates, yearly forecast, lucky colors/numbers, name analysis
- **Name handling**: Strip diacritics → calculate (Nguyễn → Nguyen)
- **Input**: Reuse existing CoupleInfo, optional full name input within numerology page
- **Language**: Vietnamese only (no .en.ts files)
- **AI**: Static interpretations by default + optional AI deep reading button
- **Placement**: New top-level page route `numerology` in PageRouter

## Core Numbers

| # | Tên | Calculation | Source |
|---|-----|-------------|--------|
| 1 | Số Chủ Đạo (Life Path) | Sum all birth date digits → reduce | Ngày sinh |
| 2 | Số Biểu Đạt (Expression) | Sum all name letters → reduce | Tên |
| 3 | Số Linh Hồn (Soul Urge) | Sum vowels in name → reduce | Tên |
| 4 | Số Nhân Cách (Personality) | Sum consonants in name → reduce | Tên |
| 5 | Số Ngày Sinh (Birthday) | Birth day only → reduce | Ngày sinh |
| 6 | Số Năm Cá Nhân (Personal Year) | birth month + day + current year → reduce | Ngày sinh + năm |
| 7 | Số Trưởng Thành (Maturity) | Life Path + Expression → reduce | Kết hợp |
| 8 | Số Thử Thách (Challenge) | Differences of birth date parts | Ngày sinh |

Master numbers: 11, 22, 33 kept unreduced.

## Architecture: Mirror Astrology Pattern

```
src/lib/numerology.ts                    # Core calculations (~150 lines)
src/lib/numerology-compatibility.ts      # Couple scoring (~80 lines)
src/lib/numerology-prompt.ts             # AI prompt builder (~50 lines)

src/data/numerology-profiles.ts          # Interpretations for 1-9, 11, 22, 33
src/data/numerology-compatibility.ts     # Pair compatibility meanings
src/data/numerology-wedding.ts           # Wedding date scoring data

src/pages/numerology-page.tsx            # Main page with tabs
src/components/numerology/
  ├── tab-personal-profile.tsx           # Hồ sơ cá nhân
  ├── tab-compatibility.tsx              # Tương hợp cặp đôi
  ├── tab-wedding-dates.tsx              # Ngày cưới may mắn
  ├── tab-yearly-forecast.tsx            # Dự báo năm cá nhân
  ├── tab-lucky-attributes.tsx           # Màu sắc & con số may mắn
  └── ai-numerology-card.tsx             # Optional AI deep reading
```

## Key Design Decisions

1. **Name Input**: Optional "Họ và tên đầy đủ" input within numerology page (not CoupleInfo). Falls back to existing names.
2. **Wedding Date Suggestions**: Universal Day Number scored against both partners' Life Paths. Calendar-style color-coded view.
3. **Compatibility Scoring**: Life Path (40%) + Expression (20%) + Soul Urge (20%) + Birthday (10%) + Personal Year (10%)
4. **Vietnamese vowels**: Strip diacritics first, then A/E/I/O/U/Y = vowels (standard Pythagorean)

## Risks

| Risk | Mitigation |
|------|-----------|
| Data quality — interpretations must be culturally appropriate | Research popular Vietnamese numerology sources |
| Content volume — 12 profiles × 5+ categories = 60+ text blocks | Start with Life Path profiles, add others incrementally |
| Full name input not in CoupleInfo | Store in numerology page local state or localStorage |

## Estimated Scope
- Calculation logic: ~300 lines
- Data/interpretations: ~800-1200 lines
- UI components: ~600-800 lines
- AI prompt: ~50 lines
- Route wiring: ~20 lines
- Total: ~1,800-2,400 lines across ~12-15 files
