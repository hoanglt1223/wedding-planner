# Phase 4: Other Data Files — Budget, AI Prompts, Ideas (3 Files)

## Context
- Parent: [plan.md](plan.md)
- Depends on: Phase 1 (resolve-data.ts references)
- Vietnamese originals: `src/data/budget-categories.ts`, `src/data/ai-prompts.ts`, `src/data/ideas.ts`

## Overview
- **Priority:** P1
- **Status:** Completed
- **Description:** Create 3 English .en.ts files for budget categories, AI prompts, ideas panel
- **Completed:** 2026-02-23

## Key Insights
- Budget: 13 simple labels — straightforward translation
- AI Prompts: 16 labels + 16 prompts — prompts need full rewrite for English AI response context
- Ideas: 13 descriptions — straightforward, some already have English titles

## Requirements
### Functional
- Budget labels in English, same keys/percentages/colors
- AI prompts fully English: labels for UI + prompts for API (AI responds in English)
- Ideas descriptions translated, titles already mostly English

### Non-Functional
- Max 200 lines per file
- Same types (BudgetCategory, AiPrompt, IdeaItemExt)

## Related Code Files
### Create
- `src/data/budget-categories.en.ts`
- `src/data/ai-prompts.en.ts`
- `src/data/ideas.en.ts`

## Implementation Steps

### 1. Budget Categories (`budget-categories.en.ts`)

Simple label translation:
```typescript
export const BUDGET_CATEGORIES_EN: BudgetCategory[] = [
  { key: "ring",             label: "💍 Ring",              percentage: 5,  color: "#e74c3c" },
  { key: "ceremonial-gifts", label: "🎁 Ceremonial Gifts",  percentage: 8,  color: "#e67e22" },
  { key: "venue",            label: "🏛️ Venue",             percentage: 15, color: "#f39c12" },
  { key: "food",             label: "🍽️ Banquet",           percentage: 25, color: "#27ae60" },
  { key: "clothes",          label: "👗 Attire",            percentage: 7,  color: "#2980b9" },
  { key: "photo",            label: "📸 Photo/Video",       percentage: 10, color: "#8e44ad" },
  { key: "decor",            label: "🌸 Decoration",        percentage: 7,  color: "#e84393" },
  { key: "makeup",           label: "💄 Makeup",            percentage: 4,  color: "#fd79a8" },
  { key: "music",            label: "🎵 Music/MC",          percentage: 5,  color: "#00b894" },
  { key: "transport",        label: "🚗 Transport",         percentage: 3,  color: "#6c5ce7" },
  { key: "jewelry",          label: "💎 Jewelry",           percentage: 8,  color: "#fdcb6e" },
  { key: "flower",           label: "💐 Flowers",           percentage: 1,  color: "#ff6b6b" },
  { key: "other",            label: "📦 Other",             percentage: 2,  color: "#636e72" },
];
```

### 2. AI Prompts (`ai-prompts.en.ts`)

Full English — both labels and prompts adapted for Viet Kieu audience:
```typescript
export const AI_PROMPTS_EN: AiPrompt[] = [
  {
    label: "📋 Wedding MC Script",
    prompt: "Write a detailed Vietnamese wedding MC script minute-by-minute, from opening to closing. Include traditional Vietnamese customs and modern elements.",
  },
  {
    label: "🍽️ Banquet Menu (3 Tiers)",
    prompt: "Suggest 3 Vietnamese wedding banquet menu sets: premium, mid-range, budget-friendly. Each set 8-10 dishes, price per table of 10 in VND.",
  },
  // ... adapt all 16 prompts
];
```

**Adaptation notes for AI prompts:**
- Keep Vietnamese wedding cultural context but explain in English
- "3 miền Bắc-Trung-Nam" → "3 regions: North, Central, South Vietnam"
- VND prices still expected (audience lives abroad but wedding in Vietnam)
- Some prompts are Vietnam-location-specific (HCM restaurants, Hanoi venues) — keep but clarify

### 3. Ideas (`ideas.en.ts`)

Translate descriptions, keep status/links unchanged:
```typescript
export const IDEAS_EN: IdeaItemExt[] = [
  {
    icon: "🗓️",
    title: "Countdown timer",
    description: "Countdown to wedding day, displayed in header.",
    status: "done",
    link: { page: "planning", hint: "Header" },
  },
  // ... translate all 13 descriptions
];
```

## Todo
- [x] Create budget-categories.en.ts
- [x] Create ai-prompts.en.ts (adapt all 16 prompts for English)
- [x] Create ideas.en.ts
- [x] Verify all compile

## Success Criteria
- Budget: 13 English labels, same structure
- AI Prompts: 16 English labels + 16 English prompts, culturally adapted
- Ideas: 13 English descriptions
- TypeScript compilation passes

## Risk Assessment
- AI prompts: English prompts may produce different quality responses from ZhipuAI (Chinese LLM) → may need to test actual AI responses
- Location-specific prompts (HCM/Hanoi restaurants) still relevant for Viet Kieu planning from abroad

## Security Considerations
- No security impact

## Next Steps
- Phase 5: Wire into components
