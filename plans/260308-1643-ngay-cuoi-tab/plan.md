---
title: "Ngay Cuoi (Auspicious Wedding Date) Tab"
description: "Add wedding date finder tab to Astrology page with calendar, personal filtering, day details, and auspicious hours"
status: pending
priority: P1
effort: 6h
branch: master
tags: [astrology, feature, calendar, vietnamese-wedding]
created: 2026-03-08
---

# Ngay Cuoi Tab — Auspicious Wedding Date Finder

## Overview

Add 7th tab "Ngay Cuoi" to `AstrologyPage` — a monthly calendar with color-coded auspicious/avoidance days, personal filtering based on couple's birth years, day detail panel, Gio Hoang Dao (auspicious hours), and top picks summary.

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Gio Hoang Dao logic | pending | 1h | [phase-01](./phase-01-gio-hoang-dao-logic.md) |
| 2 | Personal scoring service | pending | 1h | [phase-02](./phase-02-personal-scoring-service.md) |
| 3 | Calendar component | pending | 2h | [phase-03](./phase-03-calendar-component.md) |
| 4 | Day detail panel | pending | 1h | [phase-04](./phase-04-day-detail-panel.md) |
| 5 | Wire into AstrologyPage | pending | 0.5h | [phase-05](./phase-05-wire-into-astrology-page.md) |
| 6 | i18n support | pending | 0.5h | [phase-06](./phase-06-i18n-support.md) |

## Key Dependencies

- `src/data/auspicious/` — existing Hoang Dao / Tam Nuong / Nguyet Ky / Ngu Hanh
- `src/lib/astrology.ts` — Tam Tai, Kim Lau, Ngu Hanh relations
- `@dqcai/vn-lunar` — lunar date conversion
- `src/pages/astrology-page.tsx` — tab host (add 1 entry to TAB_IDS)

## Architecture

```
src/data/auspicious/
  gio-hoang-dao.ts          (NEW - auspicious hours calc)
  wedding-day-scoring.ts    (NEW - composite score with personal factors)
src/components/astrology/
  tab-wedding-date.tsx      (NEW - main tab, calendar + top picks)
  wedding-date-calendar.tsx (NEW - month calendar grid)
  wedding-date-detail.tsx   (NEW - day detail panel)
src/pages/
  astrology-page.tsx        (MODIFY - add tab entry + render)
src/lib/
  i18n-translations.ts     (MODIFY - add translation keys)
```

## File Size Budget

All new files target <150 lines. Split calendar grid and detail panel into separate components.
