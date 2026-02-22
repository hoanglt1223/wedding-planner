# Code Review: Visual Refresh -- Warm & Traditional

**Date**: 2026-02-22
**Reviewer**: code-reviewer
**Score**: 8.0 / 10
**Build**: PASS (TypeScript + Vite)

---

## Scope

- **Files reviewed**: 24 component files, 1 data file, 1 CSS file, 1 root component
- **Focus**: Theme system wiring, card pattern unification, font consolidation, shadcn --primary integration, interactive controls

---

## Overall Assessment

Solid execution of a cross-cutting visual refresh. The 5-pillar approach (theme tokens, card unification, font scale, shadcn override, controls) was well-planned and systematically applied. The core 13 target components are correctly migrated. Build passes, TypeScript clean, no runtime regressions expected.

Main gaps: several files outside the migration scope still use hardcoded colors, and 2 minor inconsistencies remain in the migrated set.

---

## Critical Issues

None.

---

## High Priority

### H1: `onboarding-wizard.tsx` -- 10+ hardcoded `#c0392b` references

**File**: `D:\Projects\wedding-planner\src\components\onboarding\onboarding-wizard.tsx`

This file renders BEFORE `App.tsx` mounts (line 38-39 of App.tsx: `if (!state.onboardingComplete) return <OnboardingWizard />`), so it sits outside the CSS var injection scope. It has:
- `bg-[#c0392b]` on 3 buttons (lines 106, 123, 152)
- `bg-[#c0392b]/40` progress dots (line 57)
- `focus:ring-[#c0392b]/30` on 3 inputs (lines 77, 89, 100)
- `border-[#e8ddd0]` hardcoded border (lines 77, 89, 100)
- `bg-gradient-to-b from-red-50` page background (line 42)

**Impact**: Onboarding always renders in red regardless of saved theme. Since CSS vars are not injected here, the fix requires either (a) passing theme to OnboardingWizard and injecting vars on its root, or (b) applying CSS vars at a higher level (e.g., index.html body).

**Recommendation**: Wire theme into OnboardingWizard the same way App.tsx does, using inline style with CSS vars. Replace all `#c0392b` with `var(--theme-primary)` and `#e8ddd0` with `var(--theme-border)`.

### H2: `landing-hero.tsx` and `landing-footer.tsx` -- hardcoded `#c0392b`

**Files**:
- `D:\Projects\wedding-planner\src\components\landing\landing-hero.tsx` (lines 8, 18)
- `D:\Projects\wedding-planner\src\components\landing\landing-footer.tsx` (line 6)

CTA buttons and accent text use `bg-[#c0392b]`. These are public-facing pages. Same issue as onboarding -- likely outside CSS var scope.

**Recommendation**: Either inject CSS vars at the landing layout level, or accept these as intentionally branded (always-red). If intentional, document the decision.

### H3: `shared-progress.tsx` -- hardcoded `#c0392b`

**File**: `D:\Projects\wedding-planner\src\components\shared\shared-progress.tsx` (lines 33, 36)

Progress bar and percentage text use `text-[#c0392b]` and `bg-[#c0392b]`. This is the shared preview page shown to external viewers.

**Recommendation**: Same as H2 -- either wire theme vars or document as intentionally branded.

### H4: `budget-category-row.tsx` -- hardcoded border `#f0e8e0`

**File**: `D:\Projects\wedding-planner\src\components\budget\budget-category-row.tsx` (line 25)

`border-b border-[#f0e8e0]` is the "warm" border color but hardcoded. This IS inside the CSS var scope.

**Recommendation**: Replace with `border-[var(--theme-border)]` for theme consistency. The current `#f0e8e0` only matches the red theme.

---

## Medium Priority

### M1: `invitation-grid.tsx` -- arbitrary font size `text-[1.4rem]`

**File**: `D:\Projects\wedding-planner\src\components\cards\invitation-grid.tsx` (line 63)

Phase 3 targeted eliminating all arbitrary sizes. This one survived. It is larger than `text-xl` (1.25rem) -- could use `text-2xl` (1.5rem) or `text-xl` depending on desired visual.

**Recommendation**: Replace `text-[1.4rem]` with `text-2xl` or `text-xl` for consistency with the 6-tier font scale.

### M2: `photo-board.tsx` -- not using theme card pattern

**File**: `D:\Projects\wedding-planner\src\components\cards\photo-board.tsx` (line 40)

Uses `border-border bg-card` (shadcn tokens) instead of the unified `bg-[var(--theme-surface)] border-[var(--theme-border)]` pattern. Also `bg-gray-50` on line 47 instead of `bg-[var(--theme-surface-muted)]`.

**Impact**: PhotoBoard cards will not match the warm surface tones of other panels when using non-default themes.

**Recommendation**: Migrate to theme vars like the other 10+ panels.

### M3: `ceremony-steps.tsx` -- detail collapsible uses `bg-gray-50`

**File**: `D:\Projects\wedding-planner\src\components\wedding\ceremony-steps.tsx` (line 82)

The expanded detail section uses `bg-gray-50 border border-gray-100` instead of theme vars. Every other nested section in this file uses `bg-[var(--theme-surface-muted)]`.

**Recommendation**: Replace with `bg-[var(--theme-surface-muted)] border border-[var(--theme-border)]`.

### M4: `party-time-toggle.tsx` -- inactive hover `bg-gray-50`

**File**: `D:\Projects\wedding-planner\src\components\wedding\party-time-toggle.tsx` (lines 14, 24)

Inactive state uses `hover:bg-gray-50`. Other inactive hovers in the system use `hover:bg-[var(--theme-surface-muted)]` or `hover:bg-muted`.

**Recommendation**: Replace with `hover:bg-[var(--theme-surface-muted)]` for consistency.

### M5: `budget-panel.tsx` -- summary bg uses `bg-gray-50`

**File**: `D:\Projects\wedding-planner\src\components\budget\budget-panel.tsx` (line 103)

Summary row uses `bg-gray-50` while the rest of the panel uses theme vars.

**Recommendation**: Replace with `bg-[var(--theme-surface-muted)]`.

### M6: `zodiac-share-card.tsx` -- Canvas hardcoded `#c0392b`

**File**: `D:\Projects\wedding-planner\src\components\astrology\zodiac-share-card.tsx` (lines 130, 168)

Canvas fill uses `#c0392b`. Canvas cannot use CSS vars directly, but could read via `getComputedStyle()`.

**Recommendation**: Low effort -- read `--theme-primary` from computed style and use it as canvas fill. Or accept as intentional since astrology module was not in scope.

---

## Low Priority

### L1: Astrology module still uses `<Card>` component

5 astrology files still import `Card/CardContent` from shadcn. These were not in the migration scope per the plan, but they create visual inconsistency when switching themes.

**Recommendation**: Future phase -- migrate astrology components.

### L2: `ideas-panel.tsx` and `ai-panel.tsx` use `bg-card` / `border-border`

These panels use shadcn semantic tokens (`bg-card`, `border-border`) rather than theme vars. They work but produce slightly different surfaces than `--theme-surface`.

**Recommendation**: Align in a future pass if visual consistency matters.

### L3: Delete buttons (`text-red-500`) kept intentionally

`guest-table.tsx` (line 47), `vendor-panel.tsx` (line 108) -- these use semantic red for destructive actions. Correctly preserved per the plan.

---

## Positive Observations

1. **Theme token design is excellent.** 11 tokens per theme covering surface, border, notes, and shadcn primary. Well-chosen warm/cool palettes per theme identity.

2. **shadcn --primary override is elegant.** Injecting HSL into `--primary` at the root div means all shadcn components (Button, Badge, Progress, Slider) automatically respond to theme changes with zero per-component work.

3. **`text-2xs` utility is clean.** Using Tailwind v4's `@utility` directive instead of a plugin is the right approach. `0.625rem / 0.875rem` is a well-chosen size.

4. **Card pattern is highly consistent.** The canonical `bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)]` appears in 10+ components with no variation. Good discipline.

5. **Semantic reds preserved correctly.** Budget warnings (`text-red-500` for over-budget), delete buttons, and astrology indicators were correctly left as semantic colors.

6. **Print panel handled separately.** `bg-white` retained for print compatibility with explicit `print-clean` class. Correct decision.

7. **No `bg-white` in any non-print card wrappers.** Complete migration verified by grep.

8. **TypeScript clean, build passes.** Zero type errors, zero build warnings (aside from existing chunk size).

---

## Recommended Actions (Prioritized)

1. **[H4]** Fix `budget-category-row.tsx` border -- 1 line, in scope, simple miss
2. **[M3]** Fix ceremony-steps detail bg -- 1 line, breaks theme consistency
3. **[M4]** Fix party-time-toggle hover -- 2 lines
4. **[M5]** Fix budget-panel summary bg -- 1 line
5. **[M2]** Migrate photo-board to theme vars -- ~3 lines
6. **[M1]** Replace `text-[1.4rem]` in invitation-grid -- 1 line
7. **[H1-H3]** Decide on onboarding/landing/shared -- either wire theme or document as branded

---

## Metrics

| Metric | Value |
|--------|-------|
| Type Coverage | 100% (strict mode, no `any`) |
| Build Status | PASS |
| Arbitrary font sizes remaining | 2 (invitation-grid `text-[1.4rem]`, tab-compatible-ages `text-[10px]`) |
| Hardcoded `#c0392b` in components | 14 (all in out-of-scope files: onboarding, landing, shared, zodiac-canvas) |
| Hardcoded `#f0e8e0` in scope | 1 (budget-category-row) |
| `bg-white` in non-print components | 0 |
| shadcn Card imports in scope | 0 (only astrology retains Card) |
| Theme vars usage count | 30 across 14 files |

---

## Unresolved Questions

1. Should onboarding/landing pages be theme-aware, or deliberately always-red as brand identity?
2. Is the astrology module in scope for a future visual refresh phase?
