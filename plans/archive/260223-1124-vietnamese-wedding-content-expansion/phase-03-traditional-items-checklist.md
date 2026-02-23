# Phase 03: Traditional Items Checklist

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 01](phase-01-foundation-region-types.md)
- Research: [Wedding customs](research/researcher-01-wedding-customs.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Est:** 5h
- **Description:** Interactive per-phase checklist of traditional Vietnamese wedding items with regional quantities, purposes, and check-off tracking.

## Key Insights
- Existing `GiftItem` in ceremony data has basic item info but no regional variants or interactive checking
- New `TraditionalItem` type adds regional quantities, purpose, required flag per region
- Items checklist is distinct from ceremony task checklist — separate state field `itemsChecked`
- Most regional variation in Lễ Ăn Hỏi (tray items, counts) and Lễ Cưới (ceremony-specific items)
- Items from research: trầu cau, rượu, bánh phu thê, bánh cốm (North), heo quay (South), tea set, candles, jewelry

## Requirements

### Functional
- Per-phase items list showing: name, icon, quantity (region-aware), purpose, required/optional badge
- Interactive checkbox per item, persisted in Zustand (`itemsChecked`)
- Progress indicator showing X/Y items prepared per phase
- Region selector changes quantities and required status dynamically

### Non-Functional
- Items organized by phase (linked via `phaseId`)
- Data files max 200 lines — split per phase if needed
- Reuse existing Badge, Checkbox UI patterns

## Architecture

### Data Structure
```typescript
// src/data/traditional-items/items-betrothal.ts
export const BETROTHAL_ITEMS: TraditionalItem[] = [
  {
    id: "trau-cau",
    name: "Trầu cau",
    icon: "🌿",
    quantity: { default: "105 quả", north: "105 quả", south: "105 quả + 210 lá" },
    purpose: "Biểu tượng hôn nhân gốc — truyền thuyết trầu cau",
    whereToFind: "Chợ truyền thống, đặt online",
    phaseId: "betrothal",
    required: { default: true },
  },
  // ...
];
```

### Data File Organization
```
src/data/traditional-items/
├── index.ts                          # getTraditionalItems(phaseId, lang, region)
├── items-engagement.ts               # Lễ Dạm Ngõ items (minimal)
├── items-engagement.en.ts
├── items-betrothal.ts                # Lễ Ăn Hỏi items (most items)
├── items-betrothal.en.ts
├── items-wedding.ts                  # Lễ Cưới items
├── items-wedding.en.ts
├── items-procession.ts               # Lễ Rước Dâu items
└── items-procession.en.ts
```

### UI Component
```
ItemsChecklist
├── Phase header + progress bar (X/Y prepared)
├── Item rows (map over filtered items)
│   ├── Checkbox (checked state from itemsChecked)
│   ├── Icon + Name
│   ├── Quantity (resolved by region)
│   ├── Required/Optional badge
│   └── Expandable: purpose + where to find
└── "Mua tất cả" / "Xóa hết" quick actions
```

## Related Code Files

### Modify
- `src/components/wedding/ceremony-section.tsx` — Add items checklist section below gifts
- `src/data/resolve-data.ts` — Add `getTraditionalItems(phaseId, lang, region)` getter
- `src/lib/i18n-translations.ts` — Add ~10 keys for items UI

### Create
- `src/data/traditional-items/index.ts` — Registry + resolver
- `src/data/traditional-items/items-engagement.ts` + `.en.ts`
- `src/data/traditional-items/items-betrothal.ts` + `.en.ts`
- `src/data/traditional-items/items-wedding.ts` + `.en.ts`
- `src/data/traditional-items/items-procession.ts` + `.en.ts`
- `src/components/wedding/items-checklist.tsx` — Interactive checklist component

## Implementation Steps

1. Create data files for each phase:
   - `items-engagement.ts` — Dạm Ngõ: trầu cau (small), rượu, bánh kẹo (~5 items)
   - `items-betrothal.ts` — Ăn Hỏi: full mâm quả (~15 items, most regional)
   - `items-wedding.ts` — Cưới: candles, tea set, rings, champagne (~8 items)
   - `items-procession.ts` — Rước Dâu: xe hoa, hoa cầm tay, confetti (~5 items)

2. Create English translation files (`.en.ts`) for each

3. Create `src/data/traditional-items/index.ts`:
   - Import all item arrays
   - Export `getTraditionalItems(phaseId: string, lang: string, region: Region): TraditionalItem[]`
   - Map phaseId to correct data, resolve regional quantities

4. Add getter to `src/data/resolve-data.ts`

5. Create `src/components/wedding/items-checklist.tsx`:
   - Accept `phaseId`, `lang`, `region`, `itemsChecked`, `onToggleItemCheck` props
   - Render item list with checkboxes, regional quantities, required badges
   - Progress bar showing checked/total
   - Collapsible purpose/whereToFind details

6. Integrate into `ceremony-section.tsx` or `step-panel.tsx`:
   - Show items checklist as a new section within each step view
   - Only render for phases that have items data

7. Add i18n keys: "Lễ vật truyền thống", "Đã chuẩn bị", "Nơi mua", "Mục đích", etc.

8. Build check

## Content: Items per Phase

### Lễ Dạm Ngõ (~5 items)
- Trầu cau (small bunch), rượu (2 chai), bánh kẹo, trái cây, trà

### Lễ Ăn Hỏi (~15 items, most regional variation)
- Trầu cau (105 quả), trà sen, rượu, bánh phu thê, trái cây ngũ quả
- Bánh cốm (North only), heo quay (South, optional North), xôi gấc (South)
- Hạt sen/mứt sen, nến rồng phượng, nữ trang (kiềng, nhẫn, bông tai, lắc)
- Phong bì tiền nạp tài, khay/mâm đỏ, giấy đỏ phủ mâm

### Lễ Cưới (~8 items)
- Nến rồng phượng (lớn), bộ ấm trà (ấm + 2 chén), nhẫn cưới
- Champagne/rượu vang, hoa cô dâu, khăn voan, thiệp mời, sổ ký tên

### Lễ Rước Dâu (~5 items)
- Xe hoa trang trí, hoa cầm tay cô dâu, confetti/cánh hoa rải
- Ô đỏ (che cô dâu — phong tục), tiền lì xì (qua cửa)

## Todo List
- [x] Create `items-engagement.ts` + `.en.ts`
- [x] Create `items-betrothal.ts` + `.en.ts`
- [x] Create `items-wedding.ts` + `.en.ts`
- [x] Create `items-procession.ts` + `.en.ts`
- [x] Create `traditional-items/index.ts` resolver
- [x] Add getter to `resolve-data.ts`
- [x] Create `items-checklist.tsx` component
- [x] Integrate into step views (panel-router.tsx + step-panel.tsx)
- [x] Add i18n keys (pre-existing in i18n-translations.ts)
- [x] Build check passes

## Success Criteria
- [x] Items checklist renders for relevant phases (engagement, betrothal, bride-ceremony, procession)
- [x] Quantities change when region is switched
- [x] Required/optional badges show correctly per region
- [x] Check state persists across sessions (via itemsChecked in store)
- [x] Progress indicator shows accurate counts
- [x] Content bilingual (VI + EN)

## Risk Assessment
- **Content volume**: MEDIUM — Betrothal phase has most items; keep files under 200 lines by splitting
- **Regional accuracy**: HIGH — Verify tray counts and items against research report
- **State size**: LOW — itemsChecked is a flat Record<string, boolean>, lightweight

## Security Considerations
- Static data only, no user-generated content processed

## Next Steps
- Future: Add item photos/thumbnails
- Future: Price estimates per region/city
- Future: "Where to buy" links to local vendors
