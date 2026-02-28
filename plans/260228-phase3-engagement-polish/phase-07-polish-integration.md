# Phase 07: Polish + Integration

## Parallelization Info

- **Group:** D (sequential -- runs after ALL previous phases complete)
- **Depends on:** Phase 01, 02, 03, 04, 05, 06
- **Blocks:** Nothing (final phase)

## Context Links

- [Current index.css](../../src/index.css) -- global styles
- [Phase 01: useOnlineStatus hook](phase-01-pwa-infrastructure.md)
- [Phase 02: bottom-nav.tsx](phase-02-navigation-architecture.md)
- [Phase 04: home dashboard components](phase-04-home-dashboard.md)
- [Code Standards](../../docs/code-standards.md)

## Overview

- **Priority:** MEDIUM
- **Status:** complete
- **Effort:** 3h
- **Description:** Final polish pass: CSS page transitions, offline badge in header, touch target audit, theme variable consistency, final responsive testing, integration verification.

## Key Insights

- Page transitions: CSS-only animations (no Framer Motion per YAGNI)
- Offline badge: consume `useOnlineStatus()` from Phase 01, display in header
- Touch targets: audit all interactive elements >= 44px
- Theme consistency: verify all new Phase 3 components use `var(--theme-*)` tokens
- This phase is light on new code; heavy on QA and refinement

## Requirements

### Functional
- Smooth page transition animation when switching sections via bottom nav
- Offline badge visible in header when disconnected
- All buttons/links meet 44px minimum touch target
- Theme colors applied consistently to all new components

### Non-Functional
- Animations < 300ms (perceived performance)
- No layout shifts during transitions
- No new dependencies
- CSS-only animations (in index.css)

## Architecture

```
Polish Touchpoints:
  index.css -> page transition keyframes + utility classes
  header.tsx -> offline badge (via useOnlineStatus consumed in App.tsx, passed as prop)
  All Phase 3 components -> theme variable audit
  All interactive elements -> touch target audit
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `src/index.css` | Add page transition animations, badge glow keyframe, offline badge styles |

### Files to REVIEW (audit only, minimal changes)
| File | Audit Focus |
|------|-------------|
| `src/components/layout/bottom-nav.tsx` | Touch targets >= 44px, theme colors |
| `src/components/layout/menu-drawer.tsx` | Touch targets, theme colors |
| `src/components/home/*.tsx` | Theme variable consistency |
| `src/components/budget/*.tsx` | Theme variable consistency |
| `src/components/progress/*.tsx` | Theme variable consistency |
| `src/components/onboarding/*.tsx` | Theme variable consistency |

## File Ownership (EXCLUSIVE)

This phase owns:
- `src/index.css` (MODIFY -- add animation utilities only)

All other files are owned by their respective phases. Phase 07 may make MINIMAL fixes (1-2 lines) to components created in earlier phases if theme/touch-target issues are found. Document any cross-phase fixes.

## Implementation Steps

### Step 1: Add page transition animations to index.css

```css
/* Page transition animations */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes page-exit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.page-transition-enter {
  animation: page-enter 200ms ease-out;
}

/* Badge unlock celebration */
@keyframes badge-glow {
  0% { box-shadow: 0 0 0 0 var(--theme-primary); }
  50% { box-shadow: 0 0 12px 4px var(--theme-primary); }
  100% { box-shadow: 0 0 0 0 var(--theme-primary); }
}

.badge-unlocked {
  animation: badge-glow 1s ease-out;
}

/* Offline badge pulse */
@keyframes offline-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.offline-badge {
  animation: offline-pulse 2s infinite;
}

/* Bottom nav active indicator slide */
@keyframes nav-indicator {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.nav-active-indicator {
  animation: nav-indicator 200ms ease-out;
}
```

### Step 2: Integrate offline badge

The `useOnlineStatus` hook (Phase 01) returns a boolean. Consume it in `App.tsx` (owned by Phase 03, already complete) and pass to Navbar.

**Cross-phase fix needed:** Add `isOnline` prop to Navbar in `header.tsx` (owned by Phase 02, already complete).

Minimal change to header.tsx:
```typescript
// Add to NavbarProps
isOnline?: boolean;

// Add to mobile header section
{isOnline === false && (
  <span className="offline-badge text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
    Offline
  </span>
)}
```

Minimal change to App.tsx:
```typescript
import { useOnlineStatus } from "@/hooks/use-online-status";
const isOnline = useOnlineStatus();
// Pass to Navbar
<Navbar ... isOnline={isOnline} />
```

### Step 3: Apply page-transition-enter to PageRouter

Wrap page content in PageRouter with transition class. Each page switch triggers re-mount with animation.

Add to the `<div>` wrapping `<PageRouter>` in App.tsx:
```tsx
<div key={state.page} className="page-transition-enter max-w-[920px] mx-auto px-3 sm:px-2 pt-2 pb-20 md:pb-0">
  <PageRouter ... />
</div>
```

The `key={state.page}` forces React to remount the div on page change, triggering the CSS animation.

### Step 4: Touch target audit

Check all interactive elements in new Phase 3 components:

**Bottom nav items:** Must be >= 44px height. Current `h-16` (64px) is fine; each item gets `flex-1` so width depends on screen. Min touch area = 64px height, adequate.

**Menu drawer items:** Each list item should have `min-h-[44px]` and `py-3` padding.

**Budget form inputs:** Ensure all form fields have `h-10` (40px) minimum. Increase to `h-11` (44px) if needed.

**Quick action cards:** Ensure `min-h-[44px]` on each card.

**Onboarding buttons:** Already `h-11` (44px). Good.

Document findings and make fixes directly in the components.

### Step 5: Theme variable consistency audit

Verify all new components use `var(--theme-*)` tokens instead of hardcoded colors:

| Token | Usage |
|-------|-------|
| `var(--theme-primary)` | Active states, primary buttons, progress bars |
| `var(--theme-surface)` | Card backgrounds |
| `var(--theme-border)` | Card borders |
| `var(--theme-bg)` | Page background |
| `var(--theme-primary-light)` | Hover states, subtle backgrounds |
| `var(--theme-accent)` | Highlights |

Check for hardcoded hex colors that should be theme variables.

### Step 6: Final responsive testing checklist

Test at these breakpoints:
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 428px (iPhone 14 Pro Max)
- [ ] 768px (iPad / md breakpoint -- bottom nav hides)
- [ ] 1024px (Desktop)

Verify:
- [ ] Bottom nav visible < 768px, hidden >= 768px
- [ ] Header tabs visible >= 768px, hidden < 768px
- [ ] Content doesn't overlap with bottom nav
- [ ] Menu drawer opens/closes correctly
- [ ] All text readable without horizontal scroll
- [ ] Vietnamese long labels don't overflow

### Step 7: Integration smoke test

Run through the full user journey:
1. First visit: onboarding wizard (5 steps)
2. Complete onboarding -> lands on Home
3. Home: progress ring, quick actions, daily tip
4. Navigate via bottom nav: Planning, Guests, Tools
5. Menu -> Cards, Handbook, Website
6. Planning -> Budget tab -> add expense
7. Toggle offline mode -> badge appears
8. Switch theme -> all components update

### Step 8: Build and lint verification

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run preview
```

Verify:
- Zero TypeScript errors
- Zero lint errors (warnings acceptable)
- Build size reasonable (< 500KB gzipped)
- Preview loads correctly

## Todo List

- [ ] Add page transition keyframes to index.css
- [ ] Add badge-glow animation to index.css
- [ ] Add offline-badge animation to index.css
- [ ] Add nav-active-indicator animation to index.css
- [ ] Wire useOnlineStatus into App.tsx -> Navbar
- [ ] Add page-transition-enter to PageRouter wrapper
- [ ] Touch target audit: bottom-nav, menu-drawer, budget form
- [ ] Theme variable audit: all Phase 3 components
- [ ] Responsive testing: 375px, 390px, 428px, 768px, 1024px
- [ ] Integration smoke test: full user journey
- [ ] Final build verification

## Success Criteria

- Page transitions are smooth and < 300ms
- Offline badge appears/disappears correctly
- All touch targets >= 44px
- All new components use theme variables (no hardcoded colors)
- Build passes with zero errors
- Full user journey works end-to-end
- App loads under 3s on 4G connection

## Conflict Prevention

- **index.css**: Only add new animation keyframes and utility classes. Do not modify existing styles.
- Cross-phase fixes (header.tsx, App.tsx) are minimal (adding 1 prop, 2-3 lines). Document each fix.
- No structural changes to any Phase 1-6 files.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Page transition causes layout shift | Med | Use `translateY(8px)` not `translateX` to avoid width recalculation |
| key={state.page} causes unnecessary remounts | Low | Lightweight pages; React handles this efficiently |
| Touch target fixes cascade style changes | Low | Use `min-h-[44px]` which is additive only |
| Cross-phase fixes introduce bugs | Med | Minimal changes (1-3 lines); test affected flows |

## Security Considerations

- No new data handling
- Offline badge is visual only; no security implications
- CSS animations have no security surface

## Next Steps

After Phase 07 completes:
- Update `docs/development-roadmap.md` with Phase 3 status
- Update `docs/project-changelog.md` with all changes
- Update `docs/codebase-summary.md` with new components
- Update `docs/system-architecture.md` with navigation architecture
- Deploy to Vercel and verify production
- Run Lighthouse audit for PWA score
