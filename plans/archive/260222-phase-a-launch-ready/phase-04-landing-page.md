# Phase 04: Landing Page

## Context Links
- [Parent Plan](./plan.md)
- [Mobile UX Research](./research/researcher-02-mobile-ux-and-landing.md)
- [Code Standards](../../docs/code-standards.md)

## Overview
- **Date:** 2026-02-22
- **Priority:** P1
- **Status:** pending
- **Effort:** 4h
- **Description:** Create a compelling Vietnamese-first landing page at "/" route. Current app moves to "/app" (hash-based). Hero + feature grid + social proof + CTA. Mobile-first design.

## Key Insights
- Landing must convey value in <5 seconds. Vietnamese couples currently use pen/paper/Excel.
- Hero message: "Free tool replacing Excel for your wedding". Show 8-step ceremony as killer feature.
- Mobile-first: 70%+ traffic will be mobile from Zalo/Facebook shares.
- No auth, no paywall. CTA = "Bat Dau Ngay" (Start Now) linking to /app (onboarding).
- Warm color palette matching existing theme system (red/gold Vietnamese wedding colors).

## Requirements
**Functional:**
- "/" route shows landing page (new visitors)
- "/app" route shows the planner app (current App.tsx)
- CTA button navigates to "/app"
- Responsive: looks great on 375px mobile through 1440px desktop

**Non-functional:**
- First Contentful Paint < 1.5s (no heavy images, use CSS gradients + emoji)
- Zero external API calls on landing page
- Under 200 lines total across all landing components

## Architecture
```
Hash-based routing in main.tsx:
  "/" ──> LandingPage
  "/app" ──> App (existing)

src/pages/
  landing-page.tsx        (new, ~80 lines, main layout)
src/components/landing/
  landing-hero.tsx         (new, ~60 lines)
  landing-features.tsx     (new, ~60 lines)
  landing-footer.tsx       (new, ~40 lines)
```

## Related Code Files
**Modify:**
- `src/main.tsx` -- add hash router to switch between landing and app
- `src/App.tsx` -- no changes (stays as-is, rendered at /app)

**Create:**
- `src/pages/landing-page.tsx` -- landing page shell
- `src/components/landing/landing-hero.tsx` -- hero section with CTA
- `src/components/landing/landing-features.tsx` -- feature grid (4-6 cards)
- `src/components/landing/landing-footer.tsx` -- minimal footer with credits

## Implementation Steps

1. **Update main.tsx for routing:** Replace direct `<App />` render with a simple hash-based router:
   ```tsx
   function Root() {
     const [route, setRoute] = useState(window.location.hash);
     useEffect(() => {
       const handler = () => setRoute(window.location.hash);
       window.addEventListener('hashchange', handler);
       return () => window.removeEventListener('hashchange', handler);
     }, []);
     if (route === '#/app' || route.startsWith('#/app')) return <App />;
     return <LandingPage />;
   }
   ```
   This avoids adding react-router dependency. Hash routing works with Vercel SPA fallback.

2. **Create landing-hero.tsx:** Vietnamese-first hero section.
   - Gradient background: `bg-gradient-to-br from-red-50 to-amber-50`
   - Headline: "Ke Hoach Dam Cuoi Hoan Hao" (with diacritics)
   - Subheadline: "Mien phi 100% | Nghi le 8 buoc | Ngan sach | Khach moi | Tu vi"
   - CTA button: `<a href="#/app">` styled as large Button with `h-12 px-8 text-lg`
   - Decorative: wedding emoji + subtle CSS animation (pulse on CTA)
   - Secondary text: "Khong can dang ky. Du lieu luu tren dien thoai cua ban."

3. **Create landing-features.tsx:** 2-column grid on mobile, 3-column on desktop.
   - Features array (6 items): Ceremony Guide, Budget Tracker, Guest List, Astrology, Invitations, AI Assistant
   - Each card: emoji icon + Vietnamese title + 1-line description
   - Use existing shadcn Card component
   - Tailwind: `grid grid-cols-2 md:grid-cols-3 gap-3`

4. **Create landing-footer.tsx:** Minimal footer.
   - "Made with love for Vietnamese couples"
   - Version + year
   - Link back to CTA

5. **Create landing-page.tsx:** Compose all sections:
   ```tsx
   export function LandingPage() {
     return (
       <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-amber-50">
         <LandingHero />
         <LandingFeatures />
         <LandingFooter />
       </div>
     );
   }
   ```

6. **Verify:** Run `npm run build`. Navigate to `/` (landing) and `#/app` (planner). Test on 375px mobile viewport.

## Todo List
- [ ] Update main.tsx with hash-based router
- [ ] Create landing-hero.tsx with CTA
- [ ] Create landing-features.tsx with 6 feature cards
- [ ] Create landing-footer.tsx
- [ ] Create landing-page.tsx composing sections
- [ ] Test routing: "/" shows landing, "#/app" shows planner
- [ ] Test mobile layout at 375px
- [ ] Test desktop layout at 1440px
- [ ] Verify build passes

## Success Criteria
- Landing page loads in <1.5s (no external images)
- CTA navigates to app without page reload
- All text is Vietnamese with proper diacritics
- Responsive from 375px to 1440px
- Under 200 lines total across all new files

## Risk Assessment
- **Medium:** Hash routing may conflict if user bookmarks `/#/app`. Mitigation: hash router is intentionally simple; no deep linking needed for MVP.
- **Low:** Landing page fonts depend on Google Fonts already loaded in index.html.

## Security Considerations
- No user input on landing page. No API calls. Pure static content.
- CTA uses `<a href>` not `window.location` to avoid XSS vectors.

## Next Steps
Phase 05 (Onboarding) adds a wizard at the start of "/app" route, building on the landing-to-app transition.
