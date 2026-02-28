---
phase: "03"
title: "Wedding Day Timeline"
status: complete
priority: P1
effort: 2-3 days
completed: 2026-02-28
---

# Phase 03: Wedding Day Timeline

## Context Links
- [plan.md](./plan.md)
- [phase-01-foundation.md](./phase-01-foundation.md)
- [brainstorm-summary.md](../260227-phase2-features-brainstorm/brainstorm-summary.md)

## Parallelization Info
- **Group:** Parallel (02-07)
- **Dependencies:** Phase 01 (types, store methods, EXTRA_TABS, panel-router)
- **Can run with:** Phases 02, 04, 05, 06, 07
- **No file conflicts** — only creates files in `src/components/timeline/`, `src/data/`, `src/pages/`

## Overview
Minute-by-minute schedule builder for the wedding day event program. Distinct from the planning checklist — this is the **live-day schedule** that can be shared. Includes template generation from enabled ceremony steps and manual editing.

## Key Insights
- Uses `TimelineEntry[]` and store methods from Phase 01
- Template generation leverages existing `WeddingStep` data + enabled steps + party time + step start times
- Categories map to ceremony types: prep, ceremony, reception, other
- Entries sortable by time; manual time editing
- Accessible via planning page sub-tab "Lich Trinh" (added by Phase 01)
- Shareable via wedding website (Phase 07 reads timeline data)

## Requirements

### Functional
- CRUD for timeline entries: add, edit, delete
- Template generation: auto-populate from enabled wedding steps
- Category filtering (ceremony/reception/prep/other)
- Time-ordered display with color-coded categories
- Entry fields: time (HH:mm), title, location, responsible person, notes, category
- Export/print view of timeline

### Non-Functional
- Responsive on mobile
- Entries persist to localStorage via WeddingState
- Max 100 entries per timeline
- All files < 200 lines

## Architecture

```
PanelRouter (stepCount + 5)
  └── TimelinePage (src/pages/timeline-page.tsx)
        ├── timeline-header.tsx      — title + "generate from template" button
        ├── timeline-entry-list.tsx   — sorted list of entries
        ├── timeline-entry-card.tsx   — single entry display/edit
        └── timeline-entry-form.tsx   — add/edit form modal

src/data/timeline-templates.ts — template generation logic
```

## Related Code Files (Full Paths)

**Reads (does NOT edit):**
- `D:\Projects\wedding-planner\src\types\wedding.ts` — `TimelineEntry`, `WeddingState`
- `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` — timeline store methods
- `D:\Projects\wedding-planner\src\data\resolve-data.ts` — `getWeddingSteps(lang)`
- `D:\Projects\wedding-planner\src\lib\i18n.ts` — `t()`

**CREATES (exclusive):**
- `D:\Projects\wedding-planner\src\pages\timeline-page.tsx`
- `D:\Projects\wedding-planner\src\components\timeline\timeline-header.tsx`
- `D:\Projects\wedding-planner\src\components\timeline\timeline-entry-list.tsx`
- `D:\Projects\wedding-planner\src\components\timeline\timeline-entry-card.tsx`
- `D:\Projects\wedding-planner\src\components\timeline\timeline-entry-form.tsx`
- `D:\Projects\wedding-planner\src\data\timeline-templates.ts`

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/pages/timeline-page.tsx` | CREATE — default export, used by PanelRouter |
| `src/components/timeline/timeline-header.tsx` | CREATE |
| `src/components/timeline/timeline-entry-list.tsx` | CREATE |
| `src/components/timeline/timeline-entry-card.tsx` | CREATE |
| `src/components/timeline/timeline-entry-form.tsx` | CREATE |
| `src/data/timeline-templates.ts` | CREATE |

## Implementation Steps

### 1. Create `src/data/timeline-templates.ts`

Template generation function:
```typescript
import type { TimelineEntry } from "@/types/wedding";
import type { WeddingStep } from "@/types/wedding";

export function generateTimelineFromSteps(
  steps: WeddingStep[],
  enabledSteps: Record<string, boolean>,
  stepStartTimes: Record<string, string>,
  partyTime: "noon" | "afternoon",
  lang: string,
): TimelineEntry[] {
  // Build entries from enabled steps' ceremonies
  // Use stepStartTimes for base times, fall back to defaults
  // Map ceremony types to categories
  // Return sorted by time
}
```

Default time slots:
- Prep: 05:00-07:00
- Ceremony (bride side): 07:00-09:00 (south) or per stepStartTimes
- Ceremony (groom side): 09:00-10:00
- Reception noon: 11:00-14:00 / afternoon: 17:00-21:00

### 2. Create `src/pages/timeline-page.tsx`

Default export container page:
```typescript
export default function TimelinePage({ state, store }: { state: WeddingState; store: WeddingStore }) {
  // State for editing entry, showing form
  // Renders: TimelineHeader + TimelineEntryList
  // Max ~80 lines
}
```

### 3. Create `src/components/timeline/timeline-header.tsx`

- Title: "Lich Trinh Ngay Cuoi"
- "Add Entry" button -> opens form
- "Generate from Template" button -> calls `generateTimelineFromSteps()` + confirms overwrite
- Entry count display
- Max ~60 lines

### 4. Create `src/components/timeline/timeline-entry-list.tsx`

- Receives sorted `TimelineEntry[]`
- Category filter tabs: All / Ceremony / Reception / Prep / Other
- Maps entries to `TimelineEntryCard`
- Empty state when no entries
- Max ~80 lines

### 5. Create `src/components/timeline/timeline-entry-card.tsx`

- Single entry row: time badge, title, location, responsible, notes
- Category color coding: ceremony=red, reception=blue, prep=yellow, other=gray
- Edit button -> opens form with entry data
- Delete button with confirmation
- Max ~80 lines

### 6. Create `src/components/timeline/timeline-entry-form.tsx`

- Modal/sheet form for add/edit
- Fields: time (HH:mm input), title, location, responsible, notes, category (select)
- Category dropdown: ceremony, reception, prep, other
- Save calls `addTimelineEntry()` or `updateTimelineEntry()`
- Max ~100 lines

## Todo List

- [x] Create `src/data/timeline-templates.ts` with template generation logic
- [x] Create `src/pages/timeline-page.tsx` (default export)
- [x] Create `src/components/timeline/timeline-header.tsx`
- [x] Create `src/components/timeline/timeline-entry-list.tsx`
- [x] Create `src/components/timeline/timeline-entry-card.tsx`
- [x] Create `src/components/timeline/timeline-entry-form.tsx`
- [x] Test: add/edit/delete entries (manual verification via component logic)
- [x] Test: generate from template populates correct entries
- [x] Test: category filtering works
- [x] Test: time sorting is correct
- [x] Build check passes (tsc + eslint clean)

## Success Criteria

- Timeline tab appears in planning page after calendar tab
- Can add entries manually with all fields
- Template generation creates entries from enabled steps
- Entries sorted by time, color-coded by category
- Edit and delete work correctly
- Data persists across page reloads
- All files < 200 lines

## Conflict Prevention

- Only creates files in `src/components/timeline/`, `src/pages/`, `src/data/`
- PanelRouter integration already done in Phase 01 (lazy import of `timeline-page`)
- No shared file edits

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Template generation misses step data | Medium | Test with all region/partyTime combos |
| Time input UX on mobile | Low | Use native `type="time"` input |
| Large timeline (100+ entries) | Low | Cap at 100; warn user |

## Security Considerations
- No API calls; pure client-side
- All data stored in localStorage
- No user-generated HTML rendered (use text content only)
