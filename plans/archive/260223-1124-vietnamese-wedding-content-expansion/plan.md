---
title: "Vietnamese Wedding Content Expansion"
description: "Add detailed step guides, traditional items checklist, family roles, and auspicious date picker with regional support"
status: completed
priority: P1
effort: 30h
branch: master
tags: [content, features, i18n, lunar-calendar, regional]
created: 2026-02-23
---

# Vietnamese Wedding Content Expansion

## Overview

Expand the wedding planner with 4 culturally-rich features targeting Vietnamese couples. All features support bilingual (VI/EN) content and a region selector (North/Central/South).

## Research

- [Wedding customs report](research/researcher-01-wedding-customs.md)
- [Lunar calendar & auspicious logic](research/researcher-02-lunar-auspicious-logic.md)
- [Brainstorm report](brainstorm-report.md)

## Phases

| # | Phase | Est. | Status | Deps |
|---|-------|------|--------|------|
| 1 | [Foundation: Region System + Types](phase-01-foundation-region-types.md) | 3h | completed | — |
| 2 | [Detailed Step Guides](phase-02-detailed-step-guides.md) | 8h | completed | P1 |
| 3 | [Traditional Items Checklist](phase-03-traditional-items-checklist.md) | 5h | completed | P1 |
| 4 | [Family Roles & Etiquette](phase-04-family-roles-etiquette.md) | 4h | completed | P1 |
| 5 | [Auspicious Date Picker](phase-05-auspicious-date-picker.md) | 8h | completed | P1 |
| 6 | [Integration & Polish](phase-06-integration-polish.md) | 2h | completed | P2-P5 |

**Total:** ~30 hours | **Parallel:** P2, P3, P4, P5 can run in parallel after P1

## Architecture Summary

```
src/
├── types/wedding.ts          # Extended types (Region, TraditionalItem, FamilyRole, etc.)
├── data/
│   ├── regions.ts            # Region enum + config
│   ├── resolve-data.ts       # Extended with (lang, region) getters
│   ├── traditional-items/    # Per-phase item data (VI + EN)
│   ├── family-roles/         # Role data by phase (VI + EN)
│   └── auspicious/           # Lunar calendar logic + data
├── hooks/
│   └── use-wedding-store.ts  # +region, +itemsChecked fields (wp_v13)
├── components/
│   ├── wedding/              # Enhanced step views + new panels
│   ├── calendar/             # Auspicious calendar components
│   └── layout/               # Region selector in header
└── lib/
    └── i18n-translations.ts  # +50 new keys
```

## Key Decisions

1. Region stored in Zustand as `region: "north" | "central" | "south"` (default: "south")
2. DRY regional overrides: `{ default: T; north?: T; central?: T; south?: T; }`
3. Lunar calendar: `@dqcai/vn-lunar` for conversion + custom auspicious logic layer
4. Store version bump: `wp_v12` → `wp_v13` with migration
5. Ceremony types extended with `significance`, `tips`, `regionalNotes` (backward-compatible optional fields)
