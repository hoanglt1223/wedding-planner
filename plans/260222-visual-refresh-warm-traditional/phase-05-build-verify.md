# Phase 5: Build Verify & QA

## Context
- Parent: [plan.md](./plan.md)
- Depends on: All previous phases

## Overview
- **Priority**: P1
- **Status**: completed
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
- [x] Red theme: warm ivory cards, red headings, red badges, red active states
- [x] Navy theme: cool white cards, navy headings, navy badges, navy active states
- [x] Sage theme: mint-white cards, green headings, green active states
- [x] Gold theme: champagne cards, gold headings, gold active states
- [x] Pink theme: blush cards, pink headings, pink active states
- [x] Purple theme: lavender cards, purple headings, purple active states
- [x] Notes callout matches theme color in each theme
- [x] Font hierarchy looks clean (no fuzzy near-same sizes)
- [x] Checkboxes respond to theme
- [x] Budget panel amounts use theme color
- [x] Print panel renders with white backgrounds + theme headings
- [x] Mobile layout still works (tab bar scrolling, card stacking)

## Success Criteria
- `npm run build` passes with 0 errors
- `npm run lint` passes
- All 6 themes produce cohesive look
- No regressions in functionality
