# Phase 01: Types + Data Constants

## Context Links
- Source: `docs/wedding-planner.html` lines 97-142 (data), 144-149 (state+formatters)
- Code standards: `docs/code-standards.md`

## Overview
- **Priority**: P1 (foundation for all other phases)
- **Status**: complete
- **Group**: A (parallel with phases 02, 03)
- **Effort**: 1.5h

## Key Insights
- HTML `D.steps[]` contains 7 steps with nested ceremonies; each ceremony has checklist, people, rituals, gifts, tips
- Total data is large (~600 lines TS when typed); split into per-step files to stay under 200-line limit
- Budget categories (13) and AI prompts (16) are small, fit single files
- Backgrounds (10 gradient objects) used in cards panel
- Ideas (14 items) are static text

## Files Owned (EXCLUSIVE)

### Create
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/types/wedding.ts` | All TypeScript interfaces | ~120 |
| `src/data/wedding-steps.ts` | Re-exports all step data as `WEDDING_STEPS` array | ~30 |
| `src/data/wedding-steps-0-gap.ts` | Step 0: Gap Mat data | ~60 |
| `src/data/wedding-steps-1-cauhon.ts` | Step 1: Cau Hon data | ~40 |
| `src/data/wedding-steps-2-damngo.ts` | Step 2: Dam Ngo data | ~50 |
| `src/data/wedding-steps-3-damhoi.ts` | Step 3: Dam Hoi data | ~100 |
| `src/data/wedding-steps-4-cuoigai.ts` | Step 4: Cuoi Gai data | ~60 |
| `src/data/wedding-steps-5-ruocdau.ts` | Step 5: Ruoc Dau data | ~70 |
| `src/data/wedding-steps-6-cuoitrai.ts` | Step 6: Cuoi Trai data | ~200 |
| `src/data/budget-categories.ts` | `BUDGET_CATEGORIES` constant | ~40 |
| `src/data/ai-prompts.ts` | `AI_PROMPTS` constant | ~50 |
| `src/data/ideas.ts` | `IDEAS` constant (14 items) | ~40 |
| `src/data/backgrounds.ts` | `BACKGROUNDS` + `EXTRA_TABS` constants | ~50 |

## Implementation Steps

### 1. Create `src/types/wedding.ts`

Define all interfaces extracted from the HTML data model:

```typescript
// Checklist item within a ceremony
export interface ChecklistItem {
  t: string;    // task text
  c: number;    // cost in VND
  k: string;    // budget category key
}

// Person/participant in a ceremony
export interface Person {
  n: string;    // name/role title
  r: string;    // role description
  a: string;    // avatar emoji
}

// Gift/offering item
export interface GiftItem {
  n: string;    // name
  q: string;    // quantity
  c: number;    // cost
}

// Single ceremony within a step
export interface Ceremony {
  nm: string;           // ceremony name with emoji
  req: number;          // 1=required, 0=optional
  desc: string;         // description
  cl: ChecklistItem[];  // checklist
  pp: Person[];         // people
  ri: string[];         // ritual steps
  tp: string[];         // tips
  lv?: GiftItem[];      // gifts/offerings (optional)
}

// Wedding step (contains multiple ceremonies)
export interface WeddingStep {
  id: string;       // unique key (e.g. "gap", "cauhon")
  tab: string;      // tab label with emoji
  title: string;    // full title
  icon: string;     // emoji icon
  desc: string;     // description
  tm: string;       // timeline text
  aiHint: string;   // AI prompt hint for this step
  cers: Ceremony[]; // ceremonies
}

// Budget category
export interface BudgetCategory {
  k: string;    // key matching checklist item k
  l: string;    // label with emoji
  p: number;    // default percentage
  cl: string;   // color hex
}

// AI prompt template
export interface AiPrompt {
  l: string;    // label with emoji
  p: string;    // prompt text
}

// Idea item
export interface IdeaItem {
  icon: string;
  title: string;
  desc: string;
}

// Background/invitation style
export interface BackgroundStyle {
  bg: string;    // CSS gradient
  t: string;     // text color
  sub: string;   // subtitle/accent color
  f: string;     // font-family
}

// Couple info (persisted)
export interface CoupleInfo {
  bride: string;
  groom: string;
  bf: string;     // bride's family name
  gf: string;     // groom's family name
  date: string;   // wedding date YYYY-MM-DD
  dDN: string;    // dam ngo date
  dDH: string;    // dam hoi date
}

// Guest entry
export interface Guest {
  n: string;    // name
  p: string;    // phone
  s: string;    // side: 'trai' | 'gai'
  g: string;    // group/table
  id: number;   // unique id
}

// Full persisted state
export interface WeddingState {
  tab: number;                        // active tab index
  st: Record<string, number>;         // step -> active sub-ceremony index
  ck: Record<string, boolean>;        // checklist key -> done
  bud: number;                        // total budget VND
  bo: Record<string, number>;         // budget category overrides (percentage)
  zk: string;                         // ZhipuAI API key
  ar: string;                         // AI last response
  info: CoupleInfo;
  guests: Guest[];
  gid: number;                        // guest ID counter
}

// Event for cards panel
export interface WeddingEvent {
  n: string;    // event name
  d: string;    // date string
}
```

### 2. Create per-step data files

Each file exports a single `WeddingStep` typed constant. Example for `src/data/wedding-steps-0-gap.ts`:

```typescript
import type { WeddingStep } from "@/types/wedding";

export const STEP_GAP_MAT: WeddingStep = {
  id: "gap",
  tab: "☕ Gặp Mặt",
  // ... exact data from HTML D.steps[0]
};
```

Copy data verbatim from HTML lines 98-122, splitting into 7 files.

### 3. Create `src/data/wedding-steps.ts`

```typescript
import type { WeddingStep } from "@/types/wedding";
import { STEP_GAP_MAT } from "./wedding-steps-0-gap";
import { STEP_CAU_HON } from "./wedding-steps-1-cauhon";
import { STEP_DAM_NGO } from "./wedding-steps-2-damngo";
import { STEP_DAM_HOI } from "./wedding-steps-3-damhoi";
import { STEP_CUOI_GAI } from "./wedding-steps-4-cuoigai";
import { STEP_RUOC_DAU } from "./wedding-steps-5-ruocdau";
import { STEP_CUOI_TRAI } from "./wedding-steps-6-cuoitrai";

export const WEDDING_STEPS: WeddingStep[] = [
  STEP_GAP_MAT, STEP_CAU_HON, STEP_DAM_NGO, STEP_DAM_HOI,
  STEP_CUOI_GAI, STEP_RUOC_DAU, STEP_CUOI_TRAI,
];
```

### 4. Create `src/data/budget-categories.ts`

Export `BUDGET_CATEGORIES: BudgetCategory[]` from HTML line 124.

### 5. Create `src/data/ai-prompts.ts`

Export `AI_PROMPTS: AiPrompt[]` from HTML lines 125-142.

### 6. Create `src/data/ideas.ts`

Export `IDEAS: IdeaItem[]` -- extract 14 idea items from HTML lines 265-279.

### 7. Create `src/data/backgrounds.ts`

Export `BACKGROUNDS: BackgroundStyle[]` from HTML lines 205-216. Also export:

```typescript
export const EXTRA_TABS = [
  "💰 Chi Phí", "👥 Khách Mời", "🖼️ BG & Thiệp",
  "🤖 AI", "📖 Sổ Tay", "💡 Ý Tưởng"
] as const;
```

### 8. Default state constant

In `src/types/wedding.ts` (or `src/data/backgrounds.ts` if types file is full), export:

```typescript
export const DEFAULT_STATE: WeddingState = {
  tab: 0, st: {}, ck: {}, bud: 200_000_000, bo: {},
  zk: "", ar: "",
  info: {
    bride: "Nguyễn Thị Thu Thảo", groom: "Nguyễn Thanh Hoàng",
    bf: "Họ Nguyễn", gf: "Họ Nhà Trai",
    date: "2025-12-20", dDN: "2025-10-15", dDH: "2025-11-15",
  },
  guests: [], gid: 0,
};
```

## Todo List

- [x] Create `src/types/wedding.ts` with all interfaces
- [x] Create `src/data/wedding-steps-0-gap.ts` (Step 0)
- [x] Create `src/data/wedding-steps-1-cauhon.ts` (Step 1)
- [x] Create `src/data/wedding-steps-2-damngo.ts` (Step 2)
- [x] Create `src/data/wedding-steps-3-damhoi.ts` (Step 3)
- [x] Create `src/data/wedding-steps-4-cuoigai.ts` (Step 4)
- [x] Create `src/data/wedding-steps-5-ruocdau.ts` (Step 5)
- [x] Create `src/data/wedding-steps-6-cuoitrai.ts` (Step 6, split into -a and -b sub-files)
- [x] Create `src/data/wedding-steps.ts` (re-export barrel)
- [x] Create `src/data/budget-categories.ts`
- [x] Create `src/data/ai-prompts.ts`
- [x] Create `src/data/ideas.ts`
- [x] Create `src/data/backgrounds.ts` with `BACKGROUNDS`, `EXTRA_TABS`, `DEFAULT_STATE`
- [x] Run `npm run build` to verify no type errors

## Success Criteria
- All types compile with strict TypeScript
- Data constants exactly match HTML source values (Vietnamese text preserved)
- No file exceeds 200 lines
- All exports are properly typed (no `any`)

## Risk Assessment
- Step 6 (Cuoi Trai) has 8 ceremonies and may push close to 200 lines; split into sub-files if needed
- Vietnamese Unicode characters must be preserved in string literals

## Security Considerations
- No API keys or secrets in data files
- All data is static constants, no runtime concerns
