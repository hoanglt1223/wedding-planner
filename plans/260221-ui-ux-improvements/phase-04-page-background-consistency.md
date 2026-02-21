# Phase 4: Page Background Consistency

## Context Links
- [UI/UX Audit — Issue #6](../reports/260221-ui-ux-audit-brainstorm.md)
- [SaaS Nav Patterns — Theming](research/researcher-01-saas-nav-patterns.md)
- [Scout Report — Styling inconsistencies](scout/scout-codebase-report.md)

## Parallelization
- **Parallel-safe** — Runs after Phase 1. No shared files with Phase 2, 3, 5.

## Overview
- **Priority:** High
- **Status:** Pending
- **Effort:** 1.5h

Unify page backgrounds across AI, Ideas, Cards, RSVP, and Photo Board panels. Currently each page uses a completely different background (dark slate, purple gradient, transparent white, cream), making the app feel like 6 disconnected tools. Standardize to a consistent light background with card-based content sections.

## Key Insights

Current inconsistencies (from Scout report):
- `ai-panel.tsx`: `bg-gradient-to-b from-slate-900 to-slate-800` (dark)
- `ideas-panel.tsx`: `bg-gradient-to-b from-purple-950 to-slate-900` (dark purple)
- `cards-panel.tsx`: `bg-white/5` sections (transparent, relies on page bg)
- `rsvp-section.tsx`: `bg-white/5` wrapper (transparent)
- `photo-board.tsx`: `bg-white/5` wrapper + `bg-gray-50` form

**Problem:** AI and Ideas pages use full dark mode while rest of app is light. Cards/RSVP use transparent overlays that assume a certain parent bg.

**Strategy:** Remove dark backgrounds from AI and Ideas. Use `bg-background` (from theme) as page base. Use `Card` components or `bg-card` for content sections. Allow accent sections via `bg-muted/50` headers.

Research guidance:
- All pages use `bg-background` (never raw colors)
- Content groups use `bg-card border border-border rounded-xl`
- Section headers can use `bg-muted/40 border-b`
- Differentiate pages via section header gradients or icons, not full-page bg changes

## Requirements

### Functional
1. AI panel: remove dark gradient, use light card-based layout
2. Ideas panel: remove purple gradient, use light card-based layout
3. Cards panel: replace `bg-white/5` with `bg-card` or `Card` component
4. RSVP section: use `Card` wrapper instead of `bg-white/5`
5. Photo Board: use `Card` wrapper instead of `bg-white/5`

### Non-functional
- Text colors must update: dark-bg text (`text-white`, `text-white/80`) becomes light-bg text (`text-foreground`, `text-muted-foreground`)
- Maintain readability for all content
- Theme color support via CSS vars
- Button/input styles must work on light background

## Architecture

**Color migration map:**

| Old class | New class |
|-----------|-----------|
| `bg-gradient-to-b from-slate-900 to-slate-800` | (remove, use parent bg) |
| `bg-gradient-to-b from-purple-950 to-slate-900` | (remove, use parent bg) |
| `bg-white/5` | `bg-card` or wrap in `<Card>` |
| `text-white` | `text-foreground` |
| `text-white/80`, `text-white/85` | `text-foreground` or `text-muted-foreground` |
| `text-white/60`, `text-white/65` | `text-muted-foreground` |
| `text-white/40`, `text-white/30` | `text-muted-foreground` with lower opacity or `text-muted-foreground/60` |
| `border-white/10` | `border-border` |
| `bg-white/5` (cards inside dark) | `bg-muted/50` or `bg-card` |
| `bg-white/10` (hover) | `hover:bg-muted` |
| `bg-red-900/40` (error) | `bg-destructive/10 text-destructive` |
| `bg-amber-500` (button) | Keep — accent buttons are fine |

## Related Code Files

### Files to modify (EXCLUSIVE to this phase)
| File | Current Lines | Action |
|------|--------------|--------|
| `src/components/ai/ai-panel.tsx` | 122 | Remove dark gradient, convert to light bg + cards |
| `src/components/ideas/ideas-panel.tsx` | 150 | Remove purple gradient, convert to light bg + cards |
| `src/components/cards/cards-panel.tsx` | 101 | Replace `bg-white/5` with `bg-card` or `Card` |
| `src/components/cards/rsvp-section.tsx` | 72 | Replace `bg-white/5` with `Card` component |
| `src/components/cards/photo-board.tsx` | 140 | Replace `bg-white/5` with `Card` component |

### Files NOT touched
- `header.tsx`, `topbar.tsx`, `App.tsx` (Phase 1)
- `scrollable-tab-bar.tsx` (Phase 2)
- All empty-state panels (Phase 3)
- `background-grid.tsx`, `invitation-grid.tsx`, `astrology-page.tsx`, `footer.tsx` (Phase 5)

## Implementation Steps

### Step 1: Convert `ai-panel.tsx` to light theme
1. Remove `className="min-h-[60vh] bg-gradient-to-b from-slate-900 to-slate-800 p-3 sm:p-4 rounded-xl"`
2. Replace with: `className="space-y-4"`
3. Wrap sections in `<Card>` components:
   - Header section: `<Card className="p-4">` with title + model info
   - Quick prompts: `<Card className="p-4">` with prompt buttons
   - Custom prompt: `<Card className="p-4">` with textarea + buttons
   - Response: `<Card className="p-4">` with rendered markdown
4. Update all `text-white*` classes to `text-foreground` / `text-muted-foreground`
5. Update textarea: `bg-white/5 border-white/10 text-white placeholder-white/30` -> `bg-background border-border text-foreground placeholder:text-muted-foreground`
6. Update buttons: `bg-white/5 border-white/10 text-white/70` -> `variant="outline"` or `bg-muted`
7. Error: `bg-red-900/40 text-red-300` -> `bg-destructive/10 text-destructive`

### Step 2: Convert `ideas-panel.tsx` to light theme
1. Remove `className="min-h-[60vh] bg-gradient-to-b from-purple-950 to-slate-900 p-3 sm:p-4 rounded-xl"`
2. Replace with: `className="space-y-4"`
3. Wrap "Luu Tru Du Lieu" export/import in `<Card>` component
4. Wrap each status group in `<Card>`
5. Update all `text-white*` -> `text-foreground` / `text-muted-foreground`
6. Update IdeaCard: `border-white/10 bg-white/5` -> `border-border bg-card`
7. Update status badges: keep colored but adjust for light bg:
   - `bg-green-500/20 text-green-300` -> `bg-green-100 text-green-700 border-green-200`
   - `bg-amber-500/20 text-amber-300` -> `bg-amber-100 text-amber-700 border-amber-200`
   - `bg-gray-500/20 text-gray-400` -> `bg-gray-100 text-gray-600 border-gray-200`
8. Update CTA section: `bg-white/5` -> `bg-muted/50`

### Step 3: Update `cards-panel.tsx`
1. Replace all `bg-white/5` with nothing (sections are just spacing groups) or use `<Card>` component
2. Better: wrap each event's background + invitation group in `<Card className="p-4">`
3. Header section: use `<Card>` for couple form area
4. These are mostly class replacements, minimal logic changes

### Step 4: Update `rsvp-section.tsx`
1. Replace `<div className="rounded-xl bg-white/5 p-4 shadow">` with `<Card><CardContent className="p-4 space-y-3">...</CardContent></Card>`
2. Import Card, CardContent, CardHeader, CardTitle from shadcn
3. `text-muted-foreground` for subtitle (already correct if using semantic classes)

### Step 5: Update `photo-board.tsx`
1. Replace `<div className="rounded-xl bg-white/5 p-4 shadow">` with `<Card><CardContent className="p-4 space-y-3">...</CardContent></Card>`
2. Add form area already uses `bg-gray-50` — fine for light theme
3. Photo grid items already use `bg-white border-gray-200` — fine

## Todo List
- [ ] Convert `ai-panel.tsx` from dark gradient to light Card-based layout
- [ ] Convert `ideas-panel.tsx` from purple gradient to light Card-based layout
- [ ] Update `cards-panel.tsx` sections from `bg-white/5` to `Card`
- [ ] Update `rsvp-section.tsx` to use `Card` component
- [ ] Update `photo-board.tsx` to use `Card` component
- [ ] Replace all `text-white*` classes with semantic foreground classes
- [ ] Update IdeaCard status badges for light background
- [ ] Update AI panel error/input/button colors for light bg
- [ ] Verify all files stay under 200 lines
- [ ] Run `npm run build` to verify no compile errors

## Success Criteria
- All 5 panels use light backgrounds consistent with rest of app
- No hardcoded dark gradient backgrounds remain
- Text readable on light background (no leftover `text-white` classes)
- shadcn `Card` components used for content grouping
- Theme colors apply consistently across all pages

## Conflict Prevention
- This phase ONLY touches: `ai-panel.tsx`, `ideas-panel.tsx`, `cards-panel.tsx`, `rsvp-section.tsx`, `photo-board.tsx`
- `cards-panel.tsx` imports `BackgroundGrid`, `InvitationGrid`, `RsvpSection`, `PhotoBoard` — but only modifies its own JSX wrapper, not the imported components
- Phase 5 modifies `background-grid.tsx` and `invitation-grid.tsx` (internal grid styling) — no conflict with `cards-panel.tsx` wrapper

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| AI panel loses "techy" dark aesthetic | Medium | Add subtle accent: `bg-muted/30` header area or icon-based differentiation |
| Ideas panel status badges unreadable on light | Medium | Use light-bg badge variants tested in step 2 |
| `cards-panel.tsx` wrapper changes break child component rendering | Low | Only changing wrapper divs, not child props |
| Files exceed 200 lines after Card import additions | Low | Card imports add 1 line; wrapper changes are net-neutral |

## Next Steps
- After all phases complete, review full app for any remaining color inconsistencies
- Consider future: page-scoped accent color overrides via CSS vars (YAGNI for now)
