# Phase 1: Header + Navbar Redesign

## Context Links
- [UI/UX Audit — Issues #1, #2, #4, #7](../reports/260221-ui-ux-audit-brainstorm.md)
- [SaaS Nav Patterns Research](research/researcher-01-saas-nav-patterns.md)
- [Scout Report](scout/scout-codebase-report.md)

## Parallelization
- **BLOCKING** — Must complete before Phases 2-5
- Touches layout shell that all pages render inside

## Overview
- **Priority:** Critical
- **Status:** Pending
- **Effort:** 2.5h

Consolidate the 120px gradient header + separate topbar into a single compact 48px sticky navbar. Move progress indicator inline. Relocate reminders to a popover/dropdown. Switch page nav from pills to underline style. Add mobile scroll fade indicators.

## Key Insights

From SaaS research:
- 48px (`h-12`) is the SaaS standard navbar height (Linear, Figma, Vercel)
- Page-level nav uses underline tabs; sub-tabs use pills — never same style for both
- Mobile 6+ items: horizontal scroll with gradient fade edges, not hidden overflow
- Progress inline as thin bar + fraction text, always visible

Current state:
- `header.tsx` (54 lines): gradient banner, h1 title, Progress bar, countdown, Reminders
- `topbar.tsx` (33 lines): sticky nav with pill buttons, overflow-x-auto but no fade indicators
- `App.tsx` (72 lines): renders Header > Topbar > PageRouter > Footer in vertical stack
- `reminders.tsx` (86 lines): chips rendered inside header, takes vertical space

## Requirements

### Functional
1. Navbar height must be 48px (`h-12`), sticky, single row
2. App title "Wedding Planner" left-aligned, compact
3. Page nav tabs use underline style (active = border-bottom-2 primary color)
4. Inline progress: thin bar + "3/5" fraction on right side of navbar
5. Countdown text integrated as small chip near progress (or tooltip)
6. Reminders moved to bell icon dropdown (Popover from shadcn)
7. Mobile (390px): page tabs horizontally scroll with left/right gradient fade
8. All 6 pages accessible without cutoff on 390px viewport

### Non-functional
- No layout shift during page transitions
- Smooth scroll on tab overflow
- Maintain theme color support (CSS vars `--theme-primary` etc.)

## Architecture

**Before:**
```
┌─────────────────────────────────┐
│  Header (120px gradient)        │  <- header.tsx
│  Title + Progress + Countdown   │
│  + Reminders chips              │
├─────────────────────────────────┤
│  Topbar (pill nav, sticky)      │  <- topbar.tsx
├─────────────────────────────────┤
│  Page Content                   │
└─────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo/Title]  [underline tabs ...]  [progress] [bell] │  <- 48px navbar
├─────────────────────────────────────────────────────┤
│  Page Content                                        │
└─────────────────────────────────────────────────────┘
```

**Component changes:**
- `header.tsx` — Rewrite to compact navbar. Inline title + tabs + progress + bell icon.
- `topbar.tsx` — Merge into header or delete. Page nav moves into navbar underline tabs.
- `App.tsx` — Remove old Header + Topbar. Render single Navbar component. Remove `mb-3` gap.
- `reminders.tsx` — Convert from inline chips to Popover dropdown triggered by bell icon.

## Related Code Files

### Files to modify (EXCLUSIVE to this phase)
| File | Current Lines | Action |
|------|--------------|--------|
| `src/components/layout/header.tsx` | 54 | Rewrite: compact navbar with title, underline tabs, progress, reminders popover |
| `src/components/layout/topbar.tsx` | 33 | Delete or gut: functionality absorbed into header |
| `src/App.tsx` | 72 | Simplify: remove Header+Topbar, render single Navbar |
| `src/components/layout/reminders.tsx` | 86 | Refactor: wrap content in Popover, triggered by bell icon |

### Files NOT touched (owned by other phases)
- `scrollable-tab-bar.tsx` (Phase 2)
- `footer.tsx`, `theme-picker.tsx` (Phase 5)

## Implementation Steps

### Step 1: Restructure `header.tsx` into compact Navbar
1. Replace gradient banner with `h-12 sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm`
2. Flex layout: `[title] [nav-tabs] [progress] [reminders-bell]`
3. Title: short text "Wedding Planner" or couple emoji, `text-sm font-bold`
4. Nav tabs: map `PAGES` array, underline active style:
   - Active: `border-b-2 border-primary text-primary`
   - Inactive: `text-muted-foreground hover:text-foreground`
   - Container: `flex gap-1 overflow-x-auto scrollbar-hide` with fade gradients on mobile
5. Progress: thin `h-1.5 w-16 rounded-full` bar + `"3/5"` text, `text-xs`
6. Props: merge HeaderProps + TopbarProps (activePage, onPageChange, progressPct, done, total, weddingDate, info)

### Step 2: Refactor `reminders.tsx`
1. Keep `getReminders()` logic unchanged
2. Wrap display in shadcn `Popover` + `PopoverTrigger` + `PopoverContent`
3. Trigger = bell icon button `h-8 w-8` with red dot badge when urgent reminders exist
4. Content = scrollable list of reminder items with urgency colors
5. Export a `RemindersBell` component (or keep name `Reminders` but change render)

### Step 3: Update `App.tsx`
1. Remove `<Header ... />` and `<Topbar ... />` separate renders
2. Add single `<Navbar ... />` (renamed header) with combined props
3. Remove `mb-3` class from header spacing
4. Keep `max-w-[920px]` content wrapper below navbar
5. Pass `activePage`, `onPageChange`, progress data, `info` to Navbar

### Step 4: Delete or empty `topbar.tsx`
1. If header.tsx absorbs all nav logic, delete topbar.tsx
2. Or keep as re-export: `export { Navbar as Topbar } from './header'`
3. Update any imports in `App.tsx`

### Step 5: Add mobile gradient fade for overflow tabs
1. In navbar tab container, add left/right gradient fade pseudo-elements
2. Use `relative` wrapper with `absolute` gradient overlays: `from-background to-transparent`
3. Only show when scrollable (check `scrollWidth > clientWidth`)
4. Add `scroll-smooth` and optional snap points

### Step 6: Countdown integration
1. Move countdown into navbar as small text chip next to progress
2. Format: `"42d"` compact, or tooltip with full text on hover
3. If wedding date passed: show "Chuc mung!" as green badge

## File Size Check
- `header.tsx` rewrite: ~80-100 lines (navbar + tabs + progress + countdown). If over 100, extract `NavTabs` or `ProgressChip` into sub-file.
- `reminders.tsx`: stays ~86 lines (Popover wrapper adds ~10 lines, but chips template shrinks)
- `App.tsx`: should shrink from 72 to ~60 lines

## Todo List
- [ ] Rewrite `header.tsx` as compact 48px navbar
- [ ] Implement underline-style page tabs in navbar
- [ ] Add inline progress bar + fraction
- [ ] Integrate countdown as compact chip/tooltip
- [ ] Refactor `reminders.tsx` to Popover dropdown with bell icon
- [ ] Update `App.tsx` to use single Navbar
- [ ] Remove/refactor `topbar.tsx`
- [ ] Add mobile gradient fade for tab overflow
- [ ] Test on 390px viewport — all 6 tabs accessible
- [ ] Run `npm run build` to verify no compile errors

## Success Criteria
- Navbar is exactly 48px tall, sticky
- Page tabs use underline style (not pills)
- Progress visible from every page
- All 6 tabs reachable on 390px mobile viewport
- Reminders accessible via bell icon popover
- No visual regression on desktop (920px max-width)

## Conflict Prevention
- This phase ONLY touches: `header.tsx`, `topbar.tsx`, `App.tsx`, `reminders.tsx`
- Does NOT touch: `scrollable-tab-bar.tsx`, `tab-navigation.tsx`, footer, any panel/page files
- Phase 2-5 agents must NOT modify these 4 files

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Navbar too cramped on mobile | High | Priority: tabs scroll, hide progress on <640px |
| Reminders popover z-index conflict | Low | Use z-50 consistent with sticky nav |
| Theme colors break on new navbar | Medium | Use CSS vars `--theme-primary` not hardcoded colors |

## Next Steps
- After Phase 1 completes, Phases 2-5 can start in parallel
- Phase 2 will update `scrollable-tab-bar.tsx` pill style for sub-tabs (distinct from navbar underlines)
