# Phase 02: Detailed Step Guides

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 01](phase-01-foundation-region-types.md)
- Research: [Wedding customs](research/researcher-01-wedding-customs.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Est:** 8h
- **Description:** Enrich all 8 ceremony phases with cultural significance, tips, common mistakes, and regional notes per ceremony. Add collapsible UI sections.

## Key Insights
- Current betrothal step already has extensive `notes[]` with mixed content (tips, warnings, regional info)
- New approach: Move structured content into ceremony-level fields (`significance`, `tips`, `commonMistakes`)
- Keep step-level `notes[]` for general reminders; ceremony-level for detailed guidance
- Regional notes use `RegionalContent<string[]>` — only override where regions genuinely differ
- Most detailed regional differences: Lễ Ăn Hỏi (tray counts, items), Lễ Cưới (ceremony order), dress code

## Requirements

### Functional
- Each ceremony has optional `significance` (1-2 paragraphs), `tips[]`, `commonMistakes[]`
- Regional notes appear when content differs by region
- Collapsible UI sections (default collapsed to avoid overwhelming)
- All content bilingual (VI + EN)

### Non-Functional
- Content accuracy verified against research report
- No file exceeds 200 lines (split data files if needed)
- Preserve existing checklist key format

## Architecture

### Data Enhancement Pattern
```typescript
// In existing ceremony data (e.g., wedding-steps-3-betrothal.ts)
{
  name: "🎀 Lễ Ăn Hỏi",
  significance: "Lễ ăn hỏi là nghi thức...",
  tips: [
    "Đặt mâm quả ít nhất 2 tuần trước...",
    "Tập dượt đội bê tráp trước 1 ngày...",
  ],
  commonMistakes: [
    "Không thống nhất số mâm quả với nhà gái trước...",
    "Để nắp mâm quả mở khi mang đi...",
  ],
  regionalNotes: {
    default: [],
    north: ["Số mâm quả: 5, 7, 9, 11 (số lẻ)..."],
    south: ["Số mâm quả: 6, 8, 10 (số chẵn)..."],
    central: ["Phong cách Huế: trang trọng, ảnh hưởng cung đình..."],
  },
  // ... existing fields unchanged
}
```

### UI Component: Collapsible Detail Section
```
CeremonySection
├── Header + description (existing)
├── [NEW] CollapsibleDetail: "📖 Ý nghĩa" → significance
├── [NEW] CollapsibleDetail: "💡 Mẹo hay" → tips[]
├── [NEW] CollapsibleDetail: "⚠️ Sai lầm thường gặp" → commonMistakes[]
├── [NEW] CollapsibleDetail: "🗺️ Đặc trưng vùng miền" → regionalNotes[region]
├── PeopleGrid (existing)
├── CeremonySteps (existing)
└── GiftsTable (existing)
```

## Related Code Files

### Modify
- `src/data/wedding-steps-0-meeting.ts` + `.en.ts` — Add ceremony enrichment
- `src/data/wedding-steps-1-proposal.ts` + `.en.ts`
- `src/data/wedding-steps-2-engagement.ts` + `.en.ts`
- `src/data/wedding-steps-3-betrothal.ts` + `.en.ts`
- `src/data/wedding-steps-4-bride.ts` + `.en.ts`
- `src/data/wedding-steps-5-procession.ts` + `.en.ts`
- `src/data/wedding-steps-6-groom.ts` + `.en.ts` (A/B variants)
- `src/data/wedding-steps-7-post-wedding.ts` + `.en.ts`
- `src/components/wedding/ceremony-section.tsx` — Add collapsible detail sections
- `src/lib/i18n-translations.ts` — Add section header keys

### Create
- `src/components/wedding/collapsible-detail.tsx` — Reusable collapsible section

## Implementation Steps

1. Create `src/components/wedding/collapsible-detail.tsx`:
   - Props: `title: string`, `icon: string`, `items: string[] | string`, `defaultOpen?: boolean`
   - Uses Radix Collapsible or simple state toggle
   - Theme-aware styling

2. Update `src/components/wedding/ceremony-section.tsx`:
   - Import CollapsibleDetail
   - After ceremony description, render significance/tips/mistakes/regional sections
   - Accept `region` prop, pass to resolveRegional for regionalNotes
   - Only render sections if data exists (backward-compatible)

3. **Content creation** — For each of 8 step files (VI), add to each ceremony:
   - `significance`: 1-2 sentences explaining cultural meaning
   - `tips`: 3-5 practical tips
   - `commonMistakes`: 2-4 things to avoid
   - `regionalNotes`: Only where N/C/S differ meaningfully

4. **Content creation** — For each .en.ts file, mirror the same enrichment in English

5. Add i18n keys: "Ý nghĩa văn hóa", "Mẹo hay", "Sai lầm thường gặp", "Đặc trưng vùng miền"

6. Update StepPanel to pass `region` down to CeremonySection

7. Build check

## Content Plan by Phase

| Step | Ceremonies | Significance? | Tips? | Regional? |
|------|-----------|--------------|-------|-----------|
| 0-Meeting | 2 | Yes | Yes | Low (universal) |
| 1-Proposal | 2 | Yes | Yes | Low |
| 2-Engagement (Dạm Ngõ) | 2 | Yes | Yes | Medium (tray items differ) |
| 3-Betrothal (Ăn Hỏi) | 3 | Yes | Yes | **High** (tray count, items, customs) |
| 4-Bride (Lễ Dâu) | 2 | Yes | Yes | Medium (dress, rituals) |
| 5-Procession (Rước Dâu) | 2 | Yes | Yes | Medium |
| 6-Groom (Thành Hôn) | 3 | Yes | Yes | Medium (Giao Bôi in Central) |
| 7-Post-Wedding | 2 | Yes | Yes | Low |

## Todo List
- [x] Create `collapsible-detail.tsx` component
- [x] Update `ceremony-section.tsx` with new sections
- [x] Enrich step 0 (Meeting) — VI + EN
- [x] Enrich step 1 (Proposal) — VI + EN
- [x] Enrich step 2 (Engagement/Dạm Ngõ) — VI + EN
- [x] Enrich step 3 (Betrothal/Ăn Hỏi) — VI + EN (highest regional detail)
- [x] Enrich step 4 (Bride/Lễ Dâu) — VI + EN
- [x] Enrich step 5 (Procession/Rước Dâu) — VI + EN
- [x] Enrich step 6 (Groom/Thành Hôn) — VI + EN
- [x] Enrich step 7 (Post-Wedding) — VI + EN
- [x] Add i18n keys (already present from Phase 1)
- [x] Update StepPanel to pass region prop
- [x] Build check passes (tsc --noEmit: 0 errors)

## Success Criteria
- [ ] All 8 steps have enriched ceremony data
- [ ] Collapsible sections render correctly (collapsed by default)
- [ ] Regional notes show correct content for selected region
- [ ] Content is bilingual (VI + EN)
- [ ] No file exceeds 200 lines
- [ ] Existing checklist tracking unaffected

## Risk Assessment
- **Content accuracy**: HIGH — Verify against research/researcher-01-wedding-customs.md
- **File size overflow**: MEDIUM — Split large data files if needed (e.g., betrothal VI data already ~147 lines)
- **Regression on checklist**: LOW — New fields are optional additions

## Security Considerations
- Static content only, no user input processed
- No API calls

## Next Steps
- Content can be iteratively improved after initial version ships
- Consider adding images/illustrations in future iteration
