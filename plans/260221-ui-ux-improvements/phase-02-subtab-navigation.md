# Phase 2: Sub-tab Navigation

## Context Links
- [UI/UX Audit — Issue #3](../reports/260221-ui-ux-audit-brainstorm.md)
- [SaaS Nav Patterns — Two-level nav](research/researcher-01-saas-nav-patterns.md)
- [Scout Report](scout/scout-codebase-report.md)

## Parallelization
- **Parallel-safe** — Runs after Phase 1. No shared files with Phase 3, 4, 5.
- Depends on Phase 1 completing (navbar underline establishes L1; this phase ensures L2 pills are visually distinct)

## Overview
- **Priority:** Critical
- **Status:** Pending
- **Effort:** 1h

Improve sub-tab (L2) navigation: better scroll indicators with gradient fade edges, clear pill styling distinct from navbar underlines, visible overflow hints so hidden tabs (Chi Phi, Khach Moi, Ghi Chu, Vendor) are discoverable.

## Key Insights

Current problems:
- `scrollable-tab-bar.tsx` (116 lines): has left/right arrow buttons, but they're small circular overlays — easy to miss
- `tab-navigation.tsx` (24 lines): wrapper using `variant="box"` (border-2 style), same red-700 active color as old page nav
- After Phase 1 changes page nav to underline, sub-tabs need to stay as pills but be clearly L2-styled
- On mobile, arrow buttons partially cover tab text

Research guidance:
- L2 pills: `bg-muted rounded-lg` container, active pill = `bg-background shadow-sm font-medium`, inactive = `text-muted-foreground`
- Gradient fade edges (not arrow buttons) for scroll indication
- Optional dot indicators below to show position in scroll

## Requirements

### Functional
1. Replace arrow button scroll indicators with gradient fade edges (left/right)
2. Active tab: pill style with shadow, clearly different from L1 underline
3. Consider softer color palette (not red-700) to differentiate from navbar — or use `bg-background` + `shadow-sm` for active
4. Scroll snapping so tabs don't land half-visible
5. Tab count indicator: subtle dot row or "N more" text when overflow exists

### Non-functional
- Smooth horizontal scroll with `scroll-smooth`
- Touch-friendly: swipe to scroll on mobile
- No layout shift when switching tabs

## Architecture

```
┌───────────────────────────────────────┐
│ [pill] [pill] [ACTIVE] [pill] >>>fade │  <- scrollable-tab-bar.tsx
└───────────────────────────────────────┘
```

Components:
- `scrollable-tab-bar.tsx` — Main reusable component. Replace arrow buttons with fade overlays. Update styling.
- `tab-navigation.tsx` — Switch from `variant="box"` to `variant="pill"`. Pass updated styling props.

## Related Code Files

### Files to modify (EXCLUSIVE to this phase)
| File | Current Lines | Action |
|------|--------------|--------|
| `src/components/layout/scrollable-tab-bar.tsx` | 116 | Replace arrow buttons with gradient fades, update pill styling |
| `src/components/wedding/tab-navigation.tsx` | 24 | Change variant to "pill", update label display |

### Files NOT touched
- `header.tsx`, `topbar.tsx`, `App.tsx` (Phase 1)
- All panel files (Phase 3, 4)
- Card grids, footer (Phase 5)

## Implementation Steps

### Step 1: Update `scrollable-tab-bar.tsx` scroll indicators
1. Remove left/right arrow `<button>` elements
2. Add gradient fade overlays:
   ```
   <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
   <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
   ```
3. Show/hide using existing `showLeft`/`showRight` state
4. Keep existing `ResizeObserver` + scroll event listeners for detection

### Step 2: Update pill styling in `scrollable-tab-bar.tsx`
1. Update `isPill` active class: `bg-white shadow-sm text-foreground font-semibold` (or `bg-primary text-primary-foreground`)
2. Update inactive class: `text-muted-foreground hover:text-foreground hover:bg-muted`
3. Pill container: add `bg-muted/50 rounded-lg p-1` wrapper for visual grouping
4. Keep `rounded-full` for pills
5. Remove `box` variant border-2 style — or keep but update colors to be distinct from L1

### Step 3: Add scroll snap
1. Add `snap-x snap-mandatory` to scroll container
2. Add `snap-start` to each tab button
3. Ensures tabs don't land in partially-visible positions

### Step 4: Update `tab-navigation.tsx`
1. Change `variant="box"` to `variant="pill"`
2. Verify tab labels from `WEDDING_STEPS` + `EXTRA_TABS` render correctly with new styling
3. No logic changes needed — this is a styling pass

### Step 5: Test discoverability
1. Verify on 390px viewport: all 11 planning sub-tabs are reachable via scroll
2. Gradient fade clearly signals "more content to scroll"
3. Active tab auto-scrolls into view (existing `scrollIntoView` behavior)

## Todo List
- [ ] Replace arrow buttons with gradient fade overlays in `scrollable-tab-bar.tsx`
- [ ] Update pill active/inactive styling to be distinct from L1 underline
- [ ] Add scroll snap to tab container
- [ ] Add `bg-muted/50` container wrapper for visual grouping
- [ ] Update `tab-navigation.tsx` variant from "box" to "pill"
- [ ] Test overflow discovery on 390px viewport
- [ ] Run `npm run build` to verify no compile errors

## Success Criteria
- Sub-tabs visually distinct from navbar underline tabs (pills vs underlines)
- Gradient fades visible when tabs overflow
- All 11 planning sub-tabs reachable on mobile
- No arrow buttons obscuring tab text
- Smooth scroll with snap points

## Conflict Prevention
- This phase ONLY touches: `scrollable-tab-bar.tsx`, `tab-navigation.tsx`
- Does NOT import from or modify any Phase 1/3/4/5 files
- `scrollable-tab-bar.tsx` is used by `tab-navigation.tsx` and `astrology-page.tsx` — but Phase 5 touches `astrology-page.tsx` only for content/bg changes, not for ScrollableTabBar usage

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Gradient fades less discoverable than arrows | Medium | Make fade wider (w-12) + add subtle "..." text |
| Scroll snap on short content fights natural scroll | Low | Only apply snap if `scrollWidth > clientWidth * 1.2` |
| `astrology-page.tsx` uses its own inline tabs, not ScrollableTabBar | Info | Phase 5 will address astrology styling separately |

## Next Steps
- Verify `astrology-page.tsx` tab styling aligned after Phase 5 completes
- Consider extracting shared tab style tokens if patterns diverge
