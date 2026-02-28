# Phase 01: Mobile Responsive Fixes

## Context Links
- [Parent Plan](./plan.md)
- [Mobile Audit](./scout/scout-01-mobile-audit.md)
- [Mobile UX Research](./research/researcher-02-mobile-ux-and-landing.md)

## Overview
- **Date:** 2026-02-22
- **Priority:** P1 (blocking all other phases)
- **Status:** pending
- **Effort:** 2h
- **Description:** Fix 4 mobile-broken components + improve container padding. Quick surgical fixes, no redesign.

## Key Insights
- Samsung 29%, Xiaomi 19%, Apple 17% in Vietnam. Min test width: 375px (iPhone SE).
- Touch targets must be 48px min. Current inputs at h-8 (32px) are acceptable for text fields but action buttons need padding.
- Guest table uses `min-w-[420px]` forcing horizontal scroll on 375px screens.
- Budget category row uses hardcoded pixel widths (`w-[50px]`, `w-[80px]`) that cramp on small screens.
- Vendor form inputs don't stack on mobile -- `flex gap-1` stays horizontal.

## Requirements
**Functional:** All 4 components usable on 375px viewport without horizontal scroll or overlapping elements.
**Non-functional:** No visual regression on desktop (920px container).

## Architecture
No new components. In-place Tailwind class changes only.

## Related Code Files
**Modify:**
- `src/components/guests/guest-panel.tsx` -- form grid breakpoint fix
- `src/components/guests/guest-table.tsx` -- remove min-w-[420px], responsive columns
- `src/components/vendors/vendor-panel.tsx` -- stack inputs on mobile
- `src/components/budget/budget-category-row.tsx` -- replace hardcoded widths
- `src/App.tsx` -- increase container padding on mobile

## Implementation Steps

1. **guest-panel.tsx (line 79):** Change `grid grid-cols-2 gap-1 sm:grid-cols-[2fr_1fr_auto_1fr_auto]` to `grid grid-cols-1 gap-1.5 sm:grid-cols-[2fr_1fr_auto_1fr_auto]`. This stacks all inputs vertically on mobile. Add `col-span-1` to the "Them" button (line 107) replacing `col-span-2 sm:col-span-1`.

2. **guest-table.tsx (line 21):** Remove `min-w-[420px]` from `<Table>`. Hide "Nhom" column on mobile: add `hidden sm:table-cell` to the TableHead (line 28) and TableCell (line 44) for "Nhom". Delete button column (line 29) keep `w-6`.

3. **vendor-panel.tsx (line 61):** Change `<div className="flex gap-1">` to `<div className="flex flex-col sm:flex-row gap-1.5">` so name+phone inputs stack on mobile. Same for line 81 (note + add button): change to `flex flex-col sm:flex-row gap-1.5`.

4. **budget-category-row.tsx (line 25):** Replace the outer flex container. Change `<div className="flex justify-between items-center py-[5px]...">` to use `flex-wrap gap-1`. Change `w-[50px]` on percentage input (line 29) to `w-12`. Change `min-w-[50px]` (line 37) to `min-w-[45px]`. Change `w-[80px]` expense input (line 52) to `w-20`. These are slightly wider Tailwind utilities that render identically but use consistent Tailwind tokens.

5. **App.tsx (line 66):** Change `px-2` to `px-3 sm:px-2` on the main content container. This adds 4px more padding on mobile for breathing room.

## Todo List
- [ ] Fix guest-panel.tsx form grid to single-column on mobile
- [ ] Fix guest-table.tsx remove min-w, hide group column on mobile
- [ ] Fix vendor-panel.tsx stack inputs vertically on mobile
- [ ] Fix budget-category-row.tsx replace hardcoded pixel widths
- [ ] Increase container padding on mobile in App.tsx
- [ ] Manual test on 375px viewport (Chrome DevTools iPhone SE)
- [ ] Verify desktop layout unchanged at 920px

## Success Criteria
- All 4 components render without horizontal overflow on 375px width
- No overlapping or truncated text
- Desktop layout visually unchanged
- `npm run build` passes without errors

## Risk Assessment
- **Low:** Tailwind class changes are isolated, no logic changes
- **Mitigation:** Test both 375px and 920px after each file change

## Security Considerations
None -- purely visual changes.

## Next Steps
Phase 02 (PWA Setup) can begin immediately after mobile fixes are verified.
