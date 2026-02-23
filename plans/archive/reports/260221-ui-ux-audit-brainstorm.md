# UI/UX Audit — Wedding Planner SaaS/B2B
**Date:** 2026-02-21
**Status:** Brainstorm complete, pending implementation plan

## Problem Statement
App has 14 features shipped but UI/UX not polished for SaaS/B2B audience. Key issues: navigation confusion, wasted screen real estate, inconsistent visual identity, hidden features, poor mobile experience.

## Prioritized Issues (10 items, Critical + High)

### Critical (#1-5)

**#1 — Header wastes prime real estate**
- Current: 120px red banner + "Chuc mung ngay cuoi!" on every page
- Fix: Compact 48px navbar. Move title left, progress inline right. Keep countdown but smaller.
- Impact: Reclaims ~70px vertical space on every page

**#2 — Two tab levels look identical**
- Current: Top nav (pages) and sub-tabs (steps) same pill style, no visual hierarchy
- Fix: Top nav = underline/segment style. Sub-tabs = pills inside page content area. Clear separation.
- Impact: Users instantly understand page vs section

**#3 — Sub-tab overflow hidden**
- Current: Chi Phi, Khach Moi, Ghi Chu, Vendor behind tiny `>` arrow
- Fix: Either scrollable with visible gradient fade + dots indicator, or reorganize into sidebar/dropdown on desktop
- Impact: Feature discovery — users find Budget/Guest/Notes/Vendor

**#4 — Mobile nav cuts off Y Tuong**
- Current: 390px viewport hides last tab, no scroll indicator
- Fix: Horizontal scroll with fade indicator, or collapsible hamburger for 6+ items
- Impact: Mobile users can access all pages

**#5 — No onboarding or empty states**
- Current: Empty guest list = just a form. No guidance.
- Fix: Empty state illustrations + "Get started" prompts. First-time tooltip hints.
- Impact: SaaS onboarding — reduce churn at first visit

### High Priority (#6-10)

**#6 — Inconsistent page backgrounds**
- Current: Ke Hoach=cream, AI=dark-slate, Y Tuong=purple, Thiep=white
- Fix: Unified light bg with accent sections. Or unified dark mode. Pick one identity.
- Impact: App feels like one product, not 6 different tools

**#7 — Progress only visible on Ke Hoach**
- Current: 4 stat cards + green bar only on planning page
- Fix: Compact progress indicator in navbar (always visible). Show % + countdown.
- Impact: Motivation — users see progress from any page

**#8 — Footer hides Theme + Language**
- Current: "vn Vi" and "Theme" as tiny footer text
- Fix: Move to Settings page or gear icon in navbar. Or floating action button.
- Impact: Users discover customization features

**#9 — Thiep page overwhelming (30 cards)**
- Current: 10 cards x 3 ceremonies = 30 cards in a massive grid
- Fix: Show 3-4 cards per ceremony, "Xem them" expand. Or carousel. Add "select favorite" to save preferred design.
- Impact: Less overwhelming, actionable (pick your card)

**#10 — Tu Vi page mostly empty**
- Current: 2 inputs + empty space. Feels unfinished.
- Fix: Add visual richness — zodiac icons, animated result cards, better form layout. Show sample analysis to entice input.
- Impact: SaaS credibility — every page should feel polished

## Recommended Approach

### Option A: Incremental Polish (Recommended)
- Fix issues one by one, deploy continuously
- Start with #1 (header) + #2 (nav hierarchy) — biggest visual impact
- Then #3-4 (discoverability) + #6 (consistency)
- Then #5,7-10 (UX improvements)
- ~3-5 implementation phases
- **Pro:** Low risk, ship improvements fast
- **Con:** Slower total timeline

### Option B: Full Redesign
- Redesign all layouts at once, ship as v2
- New design system (consistent colors, spacing, components)
- **Pro:** Consistent result
- **Con:** Big bang risk, long dev time before any value shipped

### Recommendation: **Option A** — incremental. Ship header + nav fix first, gather feedback, iterate.

## Success Metrics
- Feature discovery: users navigate to Chi Phi/Khach Moi within first session
- Mobile usability: all tabs accessible on 390px viewport
- Visual consistency: all pages share same bg/layout framework
- First impression: new user understands app purpose within 5 seconds

## Next Steps
Create implementation plan with phases prioritizing highest-impact, lowest-effort fixes first.
