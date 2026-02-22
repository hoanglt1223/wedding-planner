# Phase 1: Theme Foundation

## Context
- Parent: [plan.md](./plan.md)
- Brainstorm: [brainstorm-report.md](./reports/brainstorm-report.md)

## Overview
- **Priority**: P0 (blocks all other phases)
- **Status**: pending
- **Description**: Expand theme data with new tokens, wire shadcn `--primary` HSL, add CSS utilities

## Key Insights
- Current themes define only 4 tokens: primary, primaryDark, primaryLight, accent
- shadcn's `--primary` is oklch neutral black in index.css — disconnected from theme
- Need HSL values for shadcn override (shadcn v4 uses oklch but HSL injection works)
- Tailwind v4 CSS-first config: custom utilities go in index.css via `@utility`

## Requirements
- Each theme gets 9+ new tokens: primaryHSL, primaryForegroundHSL, surface, surfaceMuted, border, bg, noteBg, noteBorder, noteText
- Warm surfaces for red/pink/gold; cool surfaces for navy/sage/purple
- shadcn `--primary` overridden per theme so Button/Badge/Progress auto-respond
- Custom `text-2xs` utility (0.625rem/0.875rem line-height)

## Related Code Files
- `src/data/themes.ts` — MODIFY: expand WeddingTheme interface + add tokens to each theme
- `src/App.tsx` — MODIFY: inject new CSS vars including shadcn overrides
- `src/index.css` — MODIFY: add `@utility text-2xs`, remove hardcoded `--color-wedding-red`

## Implementation Steps

### Step 1: Expand theme type & data in `src/data/themes.ts`

Add to the WeddingTheme interface:
```typescript
export interface WeddingTheme {
  id: string;
  label: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  // NEW tokens:
  primaryHSL: string;           // "0 72% 42%" for shadcn --primary
  primaryForegroundHSL: string; // "0 0% 100%" (white text on primary)
  surface: string;              // card background
  surfaceMuted: string;         // nested section bg
  themeBorder: string;          // card border color
  bg: string;                   // page background
  noteBg: string;               // notes callout bg
  noteBorder: string;           // notes callout border
  noteText: string;             // notes callout text
}
```

Theme values:
| Theme | primaryHSL | surface | surfaceMuted | themeBorder | bg | noteBg | noteBorder | noteText |
|-------|-----------|---------|-------------|------------|-----|--------|-----------|----------|
| red | 0 72% 36% | #FFFBF5 | #FFF5EB | #E8DDD0 | #FDF8F3 | #FEF2F2 | #FECACA | #991B1B |
| pink | 330 81% 53% | #FFF9FA | #FFF0F3 | #F0D8DC | #FEF5F7 | #FDF2F8 | #FBCFE8 | #9D174D |
| gold | 38 90% 33% | #FFFDF5 | #FFF8E1 | #E8DFC8 | #FBF8F0 | #FEFCE8 | #FDE68A | #854D0E |
| navy | 220 73% 40% | #F8FAFC | #F1F5F9 | #D4D9E2 | #F1F5F9 | #EFF6FF | #BFDBFE | #1E3A8A |
| sage | 142 64% 24% | #F8FAF8 | #F0FDF4 | #D0DDD0 | #F2F7F2 | #F0FDF4 | #BBF7D0 | #14532D |
| purple | 271 76% 47% | #FAF8FC | #F5F0FF | #DDD4E8 | #F5F2F9 | #FAF5FF | #E9D5FF | #581C87 |

All themes use `primaryForegroundHSL: "0 0% 100%"` (white).

### Step 2: Inject CSS vars in `src/App.tsx`

In the root div inline style, add:
```typescript
style={{
  backgroundColor: theme.bg,  // was: theme.primaryLight
  '--theme-primary': theme.primary,
  '--theme-primary-dark': theme.primaryDark,
  '--theme-primary-light': theme.primaryLight,
  '--theme-accent': theme.accent,
  // NEW:
  '--theme-surface': theme.surface,
  '--theme-surface-muted': theme.surfaceMuted,
  '--theme-border': theme.themeBorder,
  '--theme-bg': theme.bg,
  '--theme-note-bg': theme.noteBg,
  '--theme-note-border': theme.noteBorder,
  '--theme-note-text': theme.noteText,
  // shadcn overrides:
  '--primary': theme.primaryHSL,
  '--primary-foreground': theme.primaryForegroundHSL,
} as React.CSSProperties}
```

### Step 3: Add text-2xs utility in `src/index.css`

```css
@utility text-2xs {
  font-size: 0.625rem;
  line-height: 0.875rem;
}
```

Also remove the hardcoded `--color-wedding-red: #c0392b` if it's only used by components we're migrating.

## Todo List
- [ ] Expand WeddingTheme interface with new tokens
- [ ] Add all token values to each of 6 themes
- [ ] Update App.tsx to inject new CSS vars + shadcn overrides
- [ ] Update App.tsx background: `theme.bg` instead of `theme.primaryLight`
- [ ] Add `@utility text-2xs` to index.css
- [ ] Verify build compiles

## Success Criteria
- All 6 themes have correct warm/cool surface colors
- `--primary` CSS var changes when theme switches
- shadcn `<Button>` default renders in theme color
- `text-2xs` utility works in Tailwind classes
- Build passes

## Risk Assessment
- Low: HSL conversion is deterministic math
- Low: CSS var injection is additive, no breaking changes
- Medium: shadcn oklch vs HSL — test that `--primary` override actually works with Tailwind v4

## Next Steps
→ Phase 2 (Card & Color Migration) and Phase 3 (Font & Controls) can start in parallel
