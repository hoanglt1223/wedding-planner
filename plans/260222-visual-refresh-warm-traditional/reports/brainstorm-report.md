# Visual Refresh: Warm & Traditional

## Problem Statement

The wedding planner app has solid functionality but accumulated visual inconsistencies that undermine perceived quality:
- **Theme system half-wired**: 6 themes exist but ~80% of color refs are hardcoded red
- **3 competing card patterns**: different padding, backgrounds, borders across panels
- **10+ arbitrary font sizes**: `text-[0.6rem]` through `text-[0.82rem]` create fuzzy hierarchy
- **shadcn `--primary` disconnected**: shadcn components use neutral black, not theme color
- **Mixed interactive controls**: shadcn buttons + raw buttons + hand-rolled checkboxes + raw inputs

**Target audience**: Mixed (couples, parents, planners) on both mobile and desktop.
**Design direction**: Warm & traditional — Vietnamese wedding invitation card aesthetic.

---

## Evaluated Approaches

### Approach A: Fix Theme Only
- Wire all hardcoded reds to CSS variables
- Pros: Smallest scope, quickest win
- Cons: Cards still inconsistent, font chaos remains, controls still mixed
- **Verdict**: Insufficient for "visual polish" goal

### Approach B: Card + Theme Fix
- Unify card pattern + wire theme
- Pros: Two biggest issues addressed
- Cons: Font and controls still inconsistent
- **Verdict**: Better but leaves rough edges

### Approach C: Full Visual Refresh (CHOSEN)
- All 5 pillars: theme, cards, fonts, shadcn integration, controls
- Pros: Comprehensive, transforms the entire feel
- Cons: More work (~15-20 files to touch)
- **Verdict**: Right choice for a "polished" outcome

---

## Final Recommended Solution

### Pillar 1: Theme System Overhaul

**Strategy**: Override shadcn's HSL `--primary` with each theme's color so all shadcn components auto-respond.

Each theme defines:
```css
--primary: H S% L%           /* theme color in HSL for shadcn */
--primary-foreground: H S% L% /* text on primary bg */
--theme-surface: #hex          /* card background */
--theme-surface-muted: #hex    /* nested section bg */
--theme-border: #hex           /* warm/cool border */
--theme-bg: #hex               /* page background */
--theme-note-bg: #hex          /* notes callout bg (light primary) */
--theme-note-border: #hex      /* notes callout border */
--theme-note-text: #hex        /* notes callout text */
```

**Theme-dependent surfaces**:
| Theme | Surface | Border | Page BG | Vibe |
|-------|---------|--------|---------|------|
| Red | #FFFBF5 (warm ivory) | #E8DDD0 (taupe) | #FDF8F3 (cream) | Warm |
| Pink | #FFF9FA (blush) | #F0D8DC (rose) | #FEF5F7 (soft pink) | Warm |
| Gold | #FFFDF5 (champagne) | #E8DFC8 (wheat) | #FBF8F0 (linen) | Warm |
| Navy | #F8FAFC (cool white) | #D4D9E2 (slate) | #F1F5F9 (light slate) | Cool |
| Sage | #F8FAF8 (mint white) | #D0DDD0 (sage) | #F2F7F2 (light sage) | Cool |
| Purple | #FAF8FC (lavender) | #DDD4E8 (mauve) | #F5F2F9 (light purple) | Cool |

**Migration**:
- Replace all `bg-white` in cards with `bg-[var(--theme-surface)]`
- Replace all `text-red-700/800` headings/stats with `text-primary`
- Replace all `bg-red-600/700` active states with `bg-primary text-primary-foreground`
- Replace `border-gray-200` on cards with `border-[var(--theme-border)]`

### Pillar 2: Card Pattern Unification

**Chosen pattern** (one for everything):
```tsx
<div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]">
```

- `p-3` for compact cards (ceremony, steps, people, gifts)
- `p-4` for larger panels (budget, guests, vendors, notes)
- Drop shadcn `<Card>` usage — its `px-6 py-6` padding is too spacious for mobile and requires constant overrides
- Optional: create a thin `<Panel>` wrapper component to standardize this

**Callout boxes** (meaning, notes):
```tsx
/* Y nghia */
<div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">

/* Luu y quan trong — now theme-aware */
<div className="bg-[var(--theme-note-bg)] border border-[var(--theme-note-border)] rounded-lg p-2.5">
```

### Pillar 3: Font Scale Consolidation

**Gentle approach** — merge close sizes, keep 6 usable tiers:

| Token | Size | Replaces | Usage |
|-------|------|----------|-------|
| `text-2xs` (custom) | 0.625rem | `text-[0.6rem]`, `text-[0.65rem]` | Badges, cost pills, tiny labels |
| `text-xs` | 0.75rem | `text-[0.68rem]`, `text-[0.7rem]`, `text-[0.78rem]` | Body text, descriptions |
| `text-sm` | 0.875rem | `text-[0.82rem]` | Section headings, form labels |
| `text-base` | 1rem | — | Card titles |
| `text-lg` | 1.125rem | — | Stat values |
| `text-xl` | 1.25rem | — | Hero numbers |

**Implementation**: Add `text-2xs` to CSS (`@utility text-2xs { font-size: 0.625rem; line-height: 0.875rem; }`) since Tailwind v4 uses CSS-first config. Then find-replace arbitrary sizes.

### Pillar 4: shadcn Token Integration

**Override in theme application** (wherever themes are applied):
```css
:root {
  --primary: 0 72% 42%;          /* red theme default */
  --primary-foreground: 0 0% 100%;
}
```

Each theme switch updates these HSL values. All shadcn `<Button>`, `<Badge>`, `<Progress>`, `<Input>` components auto-respond.

**Benefit**: No need to add `text-[var(--theme-primary)]` to every button. Just use `<Button>` and it works.

### Pillar 5: Interactive Controls Unification

**Buttons**:
- All buttons use shadcn `<Button>` with appropriate variant
- Primary actions: `<Button>` (default — uses `bg-primary`)
- Secondary actions: `<Button variant="outline">`
- Destructive: `<Button variant="destructive">`
- Remove all raw `<button className="bg-amber-500...">` patterns

**Inputs**:
- All text inputs use shadcn `<Input>` (already has `h-9 rounded-md border`)
- All selects use shadcn approach or consistent raw style
- Time picker: keep native `<input type="time">` but wrap with consistent border style

**Checkboxes**:
- Keep hand-rolled checkbox in `CheckableRow` — it has good UX with the click-to-toggle behavior
- But update colors: checked state from `bg-green-500` to `bg-primary` (theme-aware)
- Unchecked border from `border-gray-400` to `border-[var(--theme-border)]`

**Active state toggles** (guest view, photo filters):
- From hardcoded `bg-red-700` to `bg-primary text-primary-foreground`

---

## Implementation Considerations

### File Impact (~15-20 files)
- `src/data/themes.ts` — add surface/border/note tokens per theme
- `src/App.tsx` — apply theme CSS variables including shadcn overrides
- `src/index.css` — add `text-2xs` utility, warm shadow utility
- `src/components/wedding/step-panel.tsx` — card pattern, colors, fonts
- `src/components/wedding/ceremony-section.tsx` — card pattern, badge colors
- `src/components/wedding/ceremony-steps.tsx` — heading colors, table colors, checkbox
- `src/components/wedding/stats-grid.tsx` — stat value colors
- `src/components/wedding/people-grid.tsx` — card pattern
- `src/components/wedding/gifts-table.tsx` — card pattern, colors
- `src/components/budget/budget-panel.tsx` — drop shadcn Card, wire theme colors
- `src/components/guests/guest-panel.tsx` — drop shadcn Card, active toggle colors
- `src/components/vendors/vendor-panel.tsx` — drop shadcn Card
- `src/components/notes/notes-panel.tsx` — drop shadcn Card
- `src/components/ai/ai-panel.tsx` — button colors
- `src/components/cards/cards-panel.tsx` — card pattern
- `src/components/print/print-panel.tsx` — heading colors
- `src/components/layout/header.tsx` / `navbar.tsx` — progress bar color

### Risks
1. **HSL conversion**: Need to convert hex theme colors to HSL. Minor math, one-time.
2. **Print panel**: Print styles may need separate treatment (no CSS variables in print?)
3. **Dark mode future**: Theme-dependent surfaces set up nicely for future dark mode (just add dark surface tokens)
4. **Regression**: Touching 15+ files means visual regression risk. Need side-by-side comparison.

### Migration Order (recommended)
1. **Theme tokens first** (themes.ts + App.tsx + index.css) — foundation
2. **shadcn --primary wiring** — unlocks all shadcn components
3. **Card pattern unification** — biggest visual impact
4. **Heading/stat color migration** — theme-aware headings
5. **Font consolidation** — cleanup pass
6. **Control unification** — buttons, inputs, checkboxes
7. **Callout boxes** — notes section theme-aware

---

## Success Metrics
- All 6 themes produce a cohesive look (no stray red on navy theme)
- Card spacing is visually consistent across all panels
- No arbitrary font sizes remain in codebase
- All interactive elements follow shadcn patterns
- Page feels "warm and traditional" on default red/gold themes
- Page feels "clean and cool" on navy/sage/purple themes
- Parents and tech-savvy users both find it approachable

## Next Steps
- Create detailed implementation plan with per-file changes
- Consider creating a `/preview` visual comparison before/after
