# Phase 04: Wedding Step Components

## Context Links
- Source: `docs/wedding-planner.html` lines 164-180 (`rS` function)
- Types: `src/types/wedding.ts` (Phase 01)
- Hooks: `src/hooks/use-wedding-store.ts` (Phase 02)
- shadcn: Tabs, Card, Badge, Table, Progress (Phase 03)

## Overview
- **Priority**: P1
- **Status**: completed
- **Group**: B (parallel with phases 05, 06; depends on Group A)
- **Effort**: 2.5h

## Key Insights
- Each wedding step shows: overview card + progress bar, sub-ceremony tabs, ceremony detail sections
- Ceremony detail has 5 optional subsections: checklist, people, gifts table, ritual timeline, tips
- Checklist toggle mutates state via `toggleCheck(key)` — key format: `{stepId}_{ceremonyIndex}_{itemIndex}`
- Sub-ceremony tabs are horizontal scrollable, independent of main tabs
- "Hỏi AI" button on step overview navigates to AI tab with pre-filled prompt

## Files Owned (EXCLUSIVE)

### Create
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/wedding/stats-grid.tsx` | 4 stats cards (steps, done, budget, progress) | ~50 |
| `src/components/wedding/step-panel.tsx` | Single step: overview + sub-tabs + ceremony panels | ~80 |
| `src/components/wedding/ceremony-section.tsx` | Orchestrates all ceremony sub-components | ~70 |
| `src/components/wedding/checklist.tsx` | Interactive checklist with toggle | ~60 |
| `src/components/wedding/people-grid.tsx` | People/participants grid | ~40 |
| `src/components/wedding/ritual-timeline.tsx` | Ritual steps vertical timeline | ~50 |
| `src/components/wedding/gifts-table.tsx` | Gifts/offerings table with total | ~60 |

Tips are simple enough to inline in `ceremony-section.tsx` (just a map of styled divs).

## Implementation Steps

### 1. Create `src/components/wedding/stats-grid.tsx`

Props: `{ totalSteps, done, total, budget, progressPct }`. Renders 4 Card items in a 4-column grid (2-col on mobile).

```typescript
import { Card, CardContent } from "@/components/ui/card";
import { formatShort } from "@/lib/format";

interface StatsGridProps {
  totalSteps: number;
  done: number;
  total: number;
  budget: number;
  progressPct: number;
}

export function StatsGrid({ totalSteps, done, total, budget, progressPct }: StatsGridProps) {
  const stats = [
    { value: String(totalSteps), label: "Bước" },
    { value: `${done}/${total}`, label: "Xong" },
    { value: formatShort(budget), label: "Budget" },
    { value: `${progressPct}%`, label: "Tiến độ" },
  ];
  return (
    <div className="grid grid-cols-4 gap-1.5 mb-2.5 max-sm:grid-cols-2">
      {stats.map((s) => (
        <Card key={s.label} className="text-center py-2.5 px-1">
          <CardContent className="p-0">
            <div className="text-lg font-extrabold text-red-700">{s.value}</div>
            <div className="text-[0.65rem] text-muted-foreground">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 2. Create `src/components/wedding/step-panel.tsx`

Props: `{ step, stepIndex, activeSubTab, checkedKeys, onSubTabChange, onToggleCheck, onGoAI }`.

- Computes step-level progress from `checkedKeys`
- Renders overview card with progress bar, "Hỏi AI" button
- Renders sub-ceremony tab bar (horizontal scroll)
- Renders active `CeremonySection`

### 3. Create `src/components/wedding/ceremony-section.tsx`

Props: `{ ceremony, stepId, ceremonyIndex, checkedKeys, onToggleCheck }`.

Renders in order:
1. Header card (name, required badge, description)
2. `PeopleGrid` if `ceremony.pp.length > 0`
3. `Checklist` if `ceremony.cl.length > 0`
4. `GiftsTable` if `ceremony.lv?.length > 0`
5. `RitualTimeline` if `ceremony.ri.length > 0`
6. Tips section if `ceremony.tp.length > 0`

### 4. Create `src/components/wedding/checklist.tsx`

Props: `{ items, stepId, ceremonyIndex, checkedKeys, onToggle }`.

Each item renders as a clickable row with a checkbox indicator. Key format: `{stepId}_{ceremonyIndex}_{itemIndex}`. Shows cost badge if `item.c > 0`.

Use `formatShort` for cost display.

### 5. Create `src/components/wedding/people-grid.tsx`

Props: `{ people }`. Renders a responsive grid of person cards (avatar emoji circle + name + role).

### 6. Create `src/components/wedding/ritual-timeline.tsx`

Props: `{ steps }`. Renders a vertical timeline with numbered steps, using a left border line and circle markers (CSS via Tailwind).

### 7. Create `src/components/wedding/gifts-table.tsx`

Props: `{ gifts }`. Uses shadcn Table component. Shows name, quantity, cost columns. Includes total row at top as a highlighted banner.

Use `formatMoney` for cost display.

## Todo List

- [x] Create `src/components/wedding/stats-grid.tsx`
- [x] Create `src/components/wedding/step-panel.tsx`
- [x] Create `src/components/wedding/ceremony-section.tsx`
- [x] Create `src/components/wedding/checklist.tsx`
- [x] Create `src/components/wedding/people-grid.tsx`
- [x] Create `src/components/wedding/ritual-timeline.tsx`
- [x] Create `src/components/wedding/gifts-table.tsx`
- [x] Run `npm run build` to verify all components compile

## Success Criteria
- Each step renders: overview + sub-tabs + all ceremony sections
- Checklist toggles persist via `onToggleCheck` callback
- Progress bar updates when items are checked
- "Hỏi AI" button calls `onGoAI` with step's `aiHint`
- Gift table shows correct Vietnamese-formatted total
- All Vietnamese text matches HTML source exactly
- No file exceeds 200 lines

## Risk Assessment
- `step-panel.tsx` orchestrates many pieces; keep it focused on layout, delegate to sub-components
- Step 6 (Cuoi Trai) has 8 ceremonies; sub-tab bar must scroll horizontally

## Security Considerations
- No user input in this phase; all data is from typed constants
- Checklist keys are derived from data indices, no injection risk
