# Phase 06: Integration & Polish

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 02](phase-02-detailed-step-guides.md), [Phase 03](phase-03-traditional-items-checklist.md), [Phase 04](phase-04-family-roles-etiquette.md), [Phase 05](phase-05-auspicious-date-picker.md)

## Overview
- **Priority:** P2
- **Status:** completed
- **Est:** 2h
- **Description:** Final integration testing, cross-feature consistency, responsive design verification, and build validation.

## Key Insights
- All 4 features modify different parts of the app; integration mainly involves:
  - Region selector propagation to all new components
  - i18n key consistency across all new content
  - Theme variable usage consistency
  - State migration working cleanly
  - Mobile responsiveness of new UI sections

## Requirements

### Functional
- All features work together seamlessly
- Region change propagates to all content immediately
- Language change updates all new content
- No existing feature regression

### Non-Functional
- Build passes with zero TypeScript errors
- All files under 200 lines
- No unused imports or variables
- Mobile-responsive (test at 375px width)

## Implementation Steps

1. **Cross-feature region test:**
   - Switch region N→C→S → verify: step guides regional notes, items checklist quantities, etiquette dress code, calendar (unaffected by region)
   - Verify default "south" works for new users

2. **Cross-feature language test:**
   - Switch VI→EN → verify all new content translates
   - Check for untranslated strings (search for Vietnamese text in EN mode)

3. **State migration test:**
   - Clear localStorage, reload → verify v13 state with defaults
   - Set v12 data, reload → verify migration adds region + itemsChecked

4. **Responsive design check:**
   - Calendar grid at 375px width
   - Role cards and items checklist on mobile
   - Collapsible sections tap targets (min 44px)

5. **Theme consistency:**
   - Verify all new components use `var(--theme-*)` variables
   - Test with all 4+ themes

6. **Code quality:**
   - Run `npm run lint`
   - Run `npm run build`
   - Check no file exceeds 200 lines
   - Verify no unused imports

7. **Content review:**
   - Spot-check Vietnamese content for diacritics accuracy
   - Verify English translations are natural (not machine-translated)
   - Cross-reference calendar dates with online Vietnamese almanac

## Todo List
- [ ] Cross-feature region propagation test
- [ ] Cross-feature language switching test
- [ ] State migration test (fresh + existing users)
- [ ] Mobile responsive check (375px)
- [ ] Theme consistency check (all themes)
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] File size audit (all <200 lines)
- [ ] Content accuracy spot-check
- [ ] Calendar date verification against almanac

## Success Criteria
- [ ] Zero TypeScript errors in build
- [ ] Zero lint errors
- [ ] All features render correctly across N/C/S regions
- [ ] All features render correctly in VI and EN
- [ ] Mobile layout usable at 375px
- [ ] State migration preserves existing user data
- [ ] Calendar dates verified against 3+ known almanac dates

## Risk Assessment
- **Integration conflicts**: LOW — Features modify different data modules
- **Regression**: MEDIUM — Test existing features (checklist, budget, guests) still work
- **Content quality**: MEDIUM — Vietnamese cultural content needs careful review

## Next Steps
- Deploy to staging for user testing
- Gather feedback on content accuracy from Vietnamese users
- Plan next feature batch (Phase 2 core features: auth, persistence)
