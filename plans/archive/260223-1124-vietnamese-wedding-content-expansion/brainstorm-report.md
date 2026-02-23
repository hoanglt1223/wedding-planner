# Brainstorm Report: Vietnamese Wedding Content Expansion

**Date:** 2026-02-23
**Status:** Approved
**Scope:** 4 new features — all at once, full content depth

---

## Problem Statement

Current wedding planning phases have basic step outlines but lack:
- Detailed cultural significance and sub-steps
- Traditional items checklists per ceremony phase
- Family roles and etiquette guidance
- Auspicious date selection based on Vietnamese lunar calendar

Target audience: **Vietnamese couples** planning traditional weddings.
Regional variations (North/Central/South) must be supported.

---

## Approved Features

### 1. Detailed Step Guides
- Expand all 6 ceremony phases with sub-steps, cultural significance ("why we do this"), how-to tips, common mistakes
- Bilingual (VI/EN) with regional variations where meaningfully different
- UI: Collapsible/expandable sections within existing phase views

### 2. Traditional Items Checklist
- Per-phase interactive checklist of required traditional items
- Each item: name, quantity guide, purpose, where to find
- Regional differences (e.g., North: 6 trays, South: 8-10 trays for Lễ Ăn Hỏi)
- Checkable state persisted in Zustand store

### 3. Family Roles & Etiquette
- Role cards: Ông Mai/Bà Mai, đại diện nhà trai/gái, MC, family members
- Per-phase responsibilities and protocol
- Etiquette tips: dress code, speech order, seating customs
- Both traditional and modern variations

### 4. Auspicious Date Picker
- Dynamic lunar calendar with solar ↔ lunar conversion
- Auspicious logic: Hoàng Đạo/Hắc Đạo, Tam Nương, Ngũ Hành compatibility
- Monthly calendar UI with color-coded dates (good/neutral/avoid)
- Couple birth year compatibility check
- Precomputed fallback data for verification/safety net

---

## Architecture

### Data Layer

```
src/data/
├── regions.ts                    # Region enum (north/central/south) + config
├── wedding-steps/                # Enhanced ceremony phases
│   ├── index.ts                  # Phase registry + resolver
│   └── phase-X-*.ts              # Per phase, per lang
├── traditional-items/            # Items per phase + region
│   ├── index.ts
│   └── items-*.ts
├── family-roles/                 # Roles per phase
│   ├── index.ts
│   └── roles*.ts
└── auspicious-dates/             # Lunar calendar + logic
    ├── index.ts                  # Orchestrator
    ├── lunar-calendar.ts         # Conversion engine
    ├── hoang-dao.ts              # Hoàng Đạo/Hắc Đạo
    ├── tam-nuong.ts              # Tam Nương days
    ├── ngu-hanh.ts               # Five elements
    └── precomputed-fallback.ts   # Safety net data
```

### UI Components

```
src/components/
├── wedding/
│   ├── step-detail-panel.tsx     # Expanded step with significance/tips
│   ├── items-checklist.tsx       # Interactive items list
│   └── family-roles-panel.tsx    # Role cards
├── calendar/
│   ├── auspicious-calendar.tsx   # Monthly calendar + lunar overlay
│   ├── date-detail-modal.tsx     # Date explanation tooltip
│   └── couple-compatibility.tsx  # Birth year check
└── layout/
    └── region-selector.tsx       # Global North/Central/South toggle
```

### Key Design Decisions

1. **Region selector** stored in Zustand alongside `lang`, propagated to all data resolvers
2. **Data resolution** extends existing `resolve-data.ts` to accept `(lang, region)` tuple
3. **Regional data pattern (DRY):**
   ```typescript
   type RegionalContent = {
     default: string;
     north?: string;    // Override only when different
     central?: string;
     south?: string;
   }
   ```
   Only write regional variants where they actually differ.
4. **Lunar logic** — custom implementation, verified against precomputed data
5. **Bilingual** — follow existing `.en.ts` naming pattern
6. **File size** — keep under 200 lines per file per project convention

---

## Evaluated Alternatives

### Date Picker Approach
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Precomputed data only | Simple, accurate, fast | Not dynamic, needs yearly updates | Rejected (user preference) |
| Lunar library only | Dynamic, flexible | No auspicious logic built-in | Rejected (incomplete) |
| **Custom dynamic logic** | Full control, culturally accurate | Complex, 3-5 days effort | **Chosen** |
| Hybrid (library + precomputed) | Best of both | Slightly more complex | Partial — precomputed used as fallback |

### Regional Variations
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Notes only | Simple, fast | Not personalized | Rejected |
| **Region selector** | Personalized, clean UX | Content multiplier | **Chosen** (with DRY override pattern) |
| Skip regions | Fastest | Loses cultural accuracy | Rejected |

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Content accuracy (wrong customs) | **High** | Research from trusted Vietnamese wedding sources, community validation |
| Lunar calculation errors | **High** | Precomputed fallback + unit tests against known dates |
| Content volume (6 phases × 3 regions × 2 langs) | Medium | DRY regional overrides, prioritize most-different regions |
| Scope creep | Medium | Stick to approved 4 features, resist adding new ones mid-sprint |
| Performance (large data files) | Low | Lazy loading per phase, code splitting |

---

## Success Criteria

- [ ] All 6 ceremony phases have detailed sub-steps with cultural significance (VI + EN)
- [ ] Traditional items checklist is interactive and phase-specific
- [ ] Family roles show per-phase responsibilities with role cards
- [ ] Calendar displays lunar dates with auspicious/inauspicious marking
- [ ] Region selector (N/C/S) correctly adapts content across all 4 features
- [ ] All content is bilingual (Vietnamese + English)
- [ ] No file exceeds 200 lines
- [ ] Existing features remain fully functional (no regressions)

---

## Estimated Effort

| Feature | Days |
|---------|------|
| Data architecture + region selector | 1 |
| Detailed step guides (content + UI) | 3-4 |
| Traditional items checklist | 2-3 |
| Family roles & etiquette | 2-3 |
| Auspicious date picker (logic + UI) | 3-5 |
| Integration testing + polish | 1-2 |
| **Total** | **~12-18 days** |

---

## Next Steps

1. Create detailed implementation plan with phased approach
2. Research Vietnamese wedding customs from authoritative sources
3. Select/evaluate lunar calendar JS libraries
4. Design data models and TypeScript interfaces
5. Implement region selector as foundation
6. Build features in parallel where possible
