# Phase 6: Testing & Polish

## Context Links

- Parent plan: [plan.md](plan.md)
- Depends on: All previous phases
- Reference: `CLAUDE.md` (build commands)

## Overview

- **Priority**: P1 (feature must build cleanly)
- **Status**: complete
- **Description**: Verify full build passes, test edge cases, polish UI details, ensure feature integrates cleanly.

## Key Insights

- No test framework configured — testing is manual + `npm run build` + `npm run lint`
- Key edge cases: missing names, missing birth dates, master number calculations, empty strings
- Verify Vietnamese diacritics display correctly in all components
- Check theme CSS variables render correctly across all 4 themes

## Requirements

### Functional
- All new files compile without TypeScript errors
- ESLint passes with no new warnings
- Edge cases handled gracefully (empty inputs, missing data)
- Navigation works in both directions (to and from numerology page)

### Non-functional
- Build size increase reasonable (< 50KB gzipped for new code)
- No console errors in browser

## Architecture

N/A — verification phase.

## Related Code Files

### All Files Created (verify each)
- `src/lib/numerology.ts`
- `src/lib/numerology-compatibility.ts`
- `src/lib/numerology-prompt.ts`
- `src/data/numerology-profiles.ts`
- `src/data/numerology-compatibility.ts`
- `src/data/numerology-wedding.ts`
- `src/pages/numerology-page.tsx`
- `src/components/numerology/tab-personal-profile.tsx`
- `src/components/numerology/tab-compatibility.tsx`
- `src/components/numerology/tab-wedding-dates.tsx`
- `src/components/numerology/tab-yearly-forecast.tsx`
- `src/components/numerology/tab-lucky-attributes.tsx`
- `src/components/numerology/ai-numerology-card.tsx`

### Modified Files (verify changes)
- `src/pages/page-router.tsx`
- `src/data/nav-sections.ts`
- `api/ai.ts`

## Implementation Steps

1. Run `npm run build` — fix any TypeScript errors
2. Run `npm run lint` — fix any linting issues
3. Manual edge case verification:
   - **No birth dates**: numerology page shows empty state
   - **No names**: falls back to "Co dau" / "Chu re"
   - **Only one birth date**: partial data handled (show available person only)
   - **Master number dates**: 29th (2+9=11), Nov 22 (11+22), etc.
   - **Single-letter name**: still calculates
   - **All-consonant name**: Soul Urge = 0, handle gracefully
   - **Empty full name input**: falls back to CoupleInfo name
4. Verify theme rendering:
   - Switch through all 4 themes
   - Check cards, buttons, text colors adapt
5. Verify navigation flow:
   - Menu drawer -> Than So Hoc -> page loads
   - Back to home -> return to numerology -> tab state reset (expected)
6. Verify AI integration (if API key available):
   - Click AI button -> loading state -> response
   - Rate limit message after 5 attempts
   - Cached response indicator
7. Check all Vietnamese text for diacritics accuracy
8. Review file sizes (all under 200 lines)

## Todo List

- [ ] Run `npm run build` — zero errors
- [ ] Run `npm run lint` — zero new warnings
- [ ] Test empty state (no birth dates)
- [ ] Test partial data (one birth date only)
- [ ] Test master number calculations (11, 22, 33)
- [ ] Test name fallback (empty full name -> CoupleInfo)
- [ ] Test theme rendering across all 4 themes
- [ ] Test navigation to/from numerology page
- [ ] Test AI reading flow (if possible)
- [ ] Verify all files under 200 lines
- [ ] Verify Vietnamese diacritics in all UI text
- [ ] Check no console errors in dev mode

## Success Criteria

- `npm run build` exits 0
- `npm run lint` exits 0
- All edge cases handled without crashes
- Feature accessible from menu drawer
- All 5 tabs render content correctly
- AI card works end-to-end (or degrades gracefully)
- No regressions in existing features

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Build failure from import paths | Blocks deploy | Fix .js extensions in API imports (tsconfig.node.json pattern) |
| Unused variable lint errors | Build warning | Remove unused imports/vars before lint |
| Missing theme var causing white text on white bg | Invisible content | Test all themes visually |

## Security Considerations

- Final review: no secrets in client code
- API endpoint validates all inputs
- No XSS vectors (React auto-escapes, no dangerouslySetInnerHTML)

## Next Steps

- Feature complete after this phase
- Future enhancement: persist full names in WeddingState if users request it
- Future enhancement: add English translations (.en.ts files) if i18n needed
