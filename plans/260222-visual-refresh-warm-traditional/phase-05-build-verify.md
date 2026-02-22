# Phase 5: Build Verify & QA

## Context
- Parent: [plan.md](./plan.md)
- Depends on: All previous phases

## Overview
- **Priority**: P1
- **Status**: pending
- **Description**: Final build verification, lint check, visual QA

## Implementation Steps

### Step 1: Build check
```bash
npm run build
```
Fix any TypeScript errors or Tailwind compilation issues.

### Step 2: Lint check
```bash
npm run lint
```
Fix any ESLint issues introduced by changes.

### Step 3: Visual QA checklist
- [ ] Red theme: warm ivory cards, red headings, red badges, red active states
- [ ] Navy theme: cool white cards, navy headings, navy badges, navy active states
- [ ] Sage theme: mint-white cards, green headings, green active states
- [ ] Gold theme: champagne cards, gold headings, gold active states
- [ ] Pink theme: blush cards, pink headings, pink active states
- [ ] Purple theme: lavender cards, purple headings, purple active states
- [ ] Notes callout matches theme color in each theme
- [ ] Font hierarchy looks clean (no fuzzy near-same sizes)
- [ ] Checkboxes respond to theme
- [ ] Budget panel amounts use theme color
- [ ] Print panel renders with white backgrounds + theme headings
- [ ] Mobile layout still works (tab bar scrolling, card stacking)

## Success Criteria
- `npm run build` passes with 0 errors
- `npm run lint` passes
- All 6 themes produce cohesive look
- No regressions in functionality
