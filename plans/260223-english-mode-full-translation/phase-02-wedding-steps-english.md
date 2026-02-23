# Phase 2: Wedding Steps English Data (10 Files)

## Context
- Parent: [plan.md](plan.md)
- Depends on: Phase 1 (resolve-data.ts references these exports)
- Vietnamese originals: `src/data/wedding-steps-*.ts`

## Overview
- **Priority:** P1
- **Status:** Completed
- **Description:** Create 10 English .en.ts files for all wedding ceremony steps
- **Completed:** 2026-02-23

## Key Insights
- 10 Vietnamese step files total: 968 lines
- Each file: same WeddingStep type, English content
- Content style: culturally annotated, Vietnamese terms in parentheses
- Costs stay in VND (numbers unchanged)
- Export naming convention: `STEP_*_EN` (matches Vietnamese `STEP_*` pattern)
- Most complex file: wedding-steps-3-betrothal.ts (146 lines) — EN version may be slightly larger due to cultural annotations

## Requirements
### Functional
- Each .en.ts file exports same WeddingStep structure as Vietnamese counterpart
- All string fields translated to English with cultural annotations
- Vietnamese ceremony terms preserved in parentheses: "Betrothal (Dam Hoi)"
- People roles translated: "Cô dâu & Chú rể" → "Bride & Groom"
- Timeline translated: "4-6 tháng trước" → "4-6 months before"

### Non-Functional
- Max 200 lines per file
- Same types — no interface changes
- AI-generated translations, culturally accurate

## Related Code Files
### Create (10 files)
- `src/data/wedding-steps-0-meeting.en.ts`
- `src/data/wedding-steps-1-proposal.en.ts`
- `src/data/wedding-steps-2-engagement.en.ts`
- `src/data/wedding-steps-3-betrothal.en.ts`
- `src/data/wedding-steps-4-bride-ceremony.en.ts`
- `src/data/wedding-steps-5-procession.en.ts`
- `src/data/wedding-steps-6-groom-ceremony.en.ts`
- `src/data/wedding-steps-6-groom-ceremony-a.en.ts`
- `src/data/wedding-steps-6-groom-ceremony-b.en.ts`
- `src/data/wedding-steps-7-post-wedding.en.ts`

### Also create
- `src/data/wedding-steps.en.ts` — Aggregator (imports all _EN exports, exports WEDDING_STEPS_EN array)

## Implementation Steps

### Translation Guidelines

**Tab names:** Short, emoji-prefixed
- "☕ Gặp Mặt" → "☕ Meeting"
- "💍 Cầu Hôn" → "💍 Proposal"
- "🤝 Dạm Ngõ" → "🤝 Engagement"
- "🎁 Đám Hỏi" → "🎁 Betrothal"
- "👰 Lễ Cưới Gái" → "👰 Bride Ceremony"
- "🚗 Rước Dâu" → "🚗 Procession"
- "🤵 Lễ Cưới Trai" → "🤵 Groom Ceremony"
- "🎉 Sau Cưới" → "🎉 Post-Wedding"

**Title pattern:** "Step X: English Name (Vietnamese Name)"
- "Bước 1: Gặp Mặt Hai Gia Đình" → "Step 1: Family Meeting (Gap Mat)"

**Formal names:** Keep Vietnamese in parentheses
- "Lễ Giáp Mặt / Buổi Ra Mắt" → "First Family Introduction (Le Giap Mat)"

**Descriptions:** Translate naturally, add brief cultural context where helpful

**Meanings:** Full cultural annotation — explain traditions for Viet Kieu audience

**Notes:** Direct translation, keep practical advice tone

**Ceremony steps:**
- Task text: Translate to English
- `cost`: Keep VND numbers unchanged
- `categoryKey`: Keep English keys (already English)
- `time`: Keep HH:MM format
- `responsible`: Translate roles
  - "Cô dâu & Chú rể" → "Bride & Groom"
  - "Bố mẹ 2 bên" → "Both Parents"
  - "Chú rể" → "Groom"
  - "Cô dâu" → "Bride"
  - "Bạn thân" → "Best Friend"
  - "Nhiếp ảnh gia" → "Photographer"
  - "Thợ makeup" → "Makeup Artist"
  - "Người dẫn" → "MC / Host"
  - "Đội bê tráp" → "Gift Bearer Team"

**People names & roles:**
- "Bố mẹ 2 bên" → "Both Parents"
- "Cô dâu & Chú rể" → "Bride & Groom"
- Role: "Cầu nối" → "Liaison"
- Role: "Hỗ trợ" → "Support"
- Role: "Chụp + chỉnh sửa" → "Photo + Editing"

**Timeline:** Direct translation
- "4-6 tháng trước" → "4-6 months before"
- "2-3 tháng trước" → "2-3 months before"

### Per-file creation

For each of 10 files:
1. Read the Vietnamese original
2. Generate English translation following guidelines above
3. Export with `_EN` suffix (e.g., `STEP_MEETING_EN`)
4. Verify same type structure

### Create aggregator
`src/data/wedding-steps.en.ts`:
```typescript
import { STEP_MEETING_EN } from "./wedding-steps-0-meeting.en";
import { STEP_PROPOSAL_EN } from "./wedding-steps-1-proposal.en";
// ... all 8 step imports
import type { WeddingStep } from "@/types/wedding";

export const WEDDING_STEPS_EN: WeddingStep[] = [
  STEP_PROPOSAL_EN, STEP_MEETING_EN, STEP_ENGAGEMENT_EN,
  STEP_BETROTHAL_EN, STEP_BRIDE_CEREMONY_EN, STEP_PROCESSION_EN,
  STEP_GROOM_CEREMONY_EN, STEP_POST_WEDDING_EN,
];

// Re-export individuals
export {
  STEP_MEETING_EN, STEP_PROPOSAL_EN, STEP_ENGAGEMENT_EN,
  STEP_BETROTHAL_EN, STEP_BRIDE_CEREMONY_EN, STEP_PROCESSION_EN,
  STEP_GROOM_CEREMONY_EN, STEP_POST_WEDDING_EN,
};
```

Note: wedding-steps-6-groom-ceremony-a.en.ts and -b.en.ts are sub-parts imported by the main groom-ceremony.en.ts (same pattern as Vietnamese).

## Todo
- [x] Create wedding-steps-0-meeting.en.ts
- [x] Create wedding-steps-1-proposal.en.ts
- [x] Create wedding-steps-2-engagement.en.ts
- [x] Create wedding-steps-3-betrothal.en.ts
- [x] Create wedding-steps-4-bride-ceremony.en.ts
- [x] Create wedding-steps-5-procession.en.ts
- [x] Create wedding-steps-6-groom-ceremony.en.ts
- [x] Create wedding-steps-6-groom-ceremony-a.en.ts
- [x] Create wedding-steps-6-groom-ceremony-b.en.ts
- [x] Create wedding-steps-7-post-wedding.en.ts
- [x] Create wedding-steps.en.ts aggregator
- [x] Verify all files compile (`npm run build`)

## Success Criteria
- All 10 .en.ts files export correct WeddingStep type
- Aggregator exports WEDDING_STEPS_EN array with 8 steps (same order as Vietnamese)
- No Vietnamese strings remain (except intentional preserved terms in parens)
- Cultural annotations present in meaning/description fields
- Costs unchanged (VND numbers)
- TypeScript compilation passes

## Risk Assessment
- Large files (betrothal 146 lines) may exceed 200-line limit in English due to annotations → split ceremonies into sub-files if needed
- Translation quality for cultural terms → user review pass

## Next Steps
- Phase 5: Wire into components via resolve-data.ts
