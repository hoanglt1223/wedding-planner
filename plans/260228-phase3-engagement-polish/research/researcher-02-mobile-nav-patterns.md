# Mobile Bottom Navigation Patterns Research

**Status:** Complete | **Date:** 2026-02-28 | **Author:** Researcher

## Executive Summary

Bottom navigation is standard UX for mobile apps (nav ≤768px), sidebar for desktop. Current wedding planner uses horizontal tab nav — needs adaptive layout. shadcn/ui lacks native BottomNav; build custom with Radix Dialog/Tabs primitives + Tailwind CSS v4.

## 1. Bottom Navigation Implementation (React SPA)

### Pattern Overview
- **Mobile (<768px):** Fixed bottom nav bar (primary nav only, max 5 items)
- **Tablet/Desktop (≥768px):** Sidebar or top nav with all features
- **Hash routing:** Update `window.location.hash` on nav click; listen via `hashchange` event
- **State sync:** Current page stored in `WeddingState.page` (already implemented)

### Best Practice Architecture
```
NavContainer (responsive wrapper)
├─ BottomNav (mobile only, fixed, z-40)
│  └─ NavItem (icon + label, click → store.setPage())
└─ SidebarNav (desktop only, or hide bottom nav at 768px)
```

**Key:** Use CSS media queries with Tailwind `md:` breakpoint (768px) to toggle visibility:
- Bottom nav: `fixed bottom-0 left-0 right-0 md:hidden`
- Sidebar: `hidden md:flex` (or keep top nav intact)

## 2. shadcn/ui Component Strategy

### Finding: No Native BottomNav Component
shadcn/ui provides: Tabs, Sidebar, Menubar, but no dedicated BottomNav.

### Recommended Approach
**Build custom BottomNav using shadcn primitives:**

1. **Use Radix Tabs** (via shadcn `<Tabs>` component):
   - Radix handles ARIA/keyboard for tab navigation
   - Set `orientation="horizontal"` (default), style with Tailwind
   - Align items at bottom visually only

2. **Or build from scratch with Radix Menubar/Dialog:**
   - More control over layout, animation
   - Lighter than Tabs for simple icon-based nav

3. **Styling with Tailwind CSS v4 (CSS-first):**
   - No `tailwind.config.js` needed
   - Define custom spacing/colors as CSS variables (already in use via theme tokens)
   - Build flex-based layout: `flex items-center justify-around`

### Component Structure (Pseudo)
```tsx
<div className="fixed bottom-0 inset-x-0 border-t bg-surface md:hidden">
  <nav className="flex justify-around h-16">
    {PAGES.map(page => (
      <button
        key={page.id}
        onClick={() => store.setPage(page.id)}
        className={cn("flex-1 flex flex-col items-center justify-center gap-0.5",
          activePage === page.id ? "text-primary" : "text-muted-foreground"
        )}
      >
        <span className="text-xl">{page.icon}</span>
        <span className="text-xs truncate">{page.label}</span>
      </button>
    ))}
  </nav>
</div>
```

## 3. Responsive Breakpoints

### Tailwind v4 Breakpoints (Default)
- `sm: 640px` — small phones
- `md: 768px` — tablets, desktop (toggle point for nav)
- `lg: 1024px` — desktop
- `xl: 1280px` — large desktop

### Current App Layout
- Content: `max-w-[920px] mx-auto` (at `lg` level)
- Header: Full width, sticky
- Footer: Full width

### Strategy
**Keep existing header; add bottom nav that hides at `md:768px`:**
- Add bottom padding/margin to body to prevent content overlap
- Bottom nav fixed, `z-40` (below modals but above content)
- Header stays unchanged; works for both mobile + desktop

## 4. Animation Patterns

### Recommended (Smooth, Performant)
1. **Page transition slide:**
   - Exit current page: fade + slide-left/right
   - Enter new page: fade + slide-left/right (opposite direction)
   - Use Framer Motion or CSS transitions (no library = Tailwind `transition-all`)

2. **Bottom nav item highlight:**
   - Active item: underline + color change + subtle scale
   - Inactive: muted color, no underline
   - Transition duration: 200ms

3. **Haptic feedback (iOS/Android):**
   - Call `navigator.vibrate([50])` on nav click (returns bool if supported)
   - Warn users it's iOS-only; Android supports more reliably
   - Web API: no external library needed

### Minimal Tailwind Animation (No Framer Motion)
```css
/* In index.css or per-component */
@layer utilities {
  .nav-item-active {
    @apply border-b-2 border-primary text-primary;
  }
  .page-enter {
    animation: slideInRight 300ms ease-out;
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
}
```

## 5. Information Architecture (Wedding Apps)

### Competitive Analysis: TheKnot, Zola, WeddingWire
**Common Primary Nav Items (5-6 max):**
1. **Planning/Checklist** — Tasks, timeline, vendor tracking
2. **Guests/RSVP** — Guest list, invitations, responses
3. **Budget** — Expenses, vendors, cost tracking
4. **Inspiration/Ideas** — Pinterest-style, lookbooks, color palettes
5. **Profile/Details** — Couple info, preferences, settings

**Secondary Nav (Settings, Help):** Overflow menu or separate panel

### Current Wedding Planner Pages
```
Current: planning, astrology, cards, ai, handbook, ideas, tasks, website
Mapped to IA:
  - planning → Planning/Checklist (primary)
  - ideas → Inspiration (primary)
  - ai → AI Assistant (primary or overflow)
  - tasks → Checklist sub-page (primary or secondary)
  - astrology → Fun feature (secondary or overflow)
  - cards → Cards/Print (secondary)
  - handbook → Print/Reference (secondary)
  - website → Settings (secondary)
```

### Recommended Bottom Nav (5 items)
1. **📋 Planning** — Core planning page
2. **💡 Ideas** — Inspiration, color, lookbooks
3. **🤖 Assistant** — AI consultation
4. **📊 Tasks** — Task board (or combine with Planning)
5. **⚙️ More** — Overflow menu (astrology, cards, handbook, settings)

**Alternative (6 items):**
Add Astrology as primary nav item (wedding-specific USP).

## 6. Vietnamese Text Considerations

### Challenge
Vietnamese labels are longer than English:
- English: "Planning" (8 chars)
- Vietnamese: "Lên kế hoạch" (11 chars)
- Astrology: "Chiêm tinh học" (14 chars)

### Solutions
1. **Icons only + tooltip:** Use icon + hover label on desktop, tap-to-reveal on mobile
2. **Truncate label:** CSS `truncate` + tooltip on hover
3. **Abbreviated labels:** Use shorter Vietnamese phrases + icon
4. **Stack layout:** Icon above label (current app style) — works better for longer text

## 7. Implementation Checklist

- [ ] Create `BottomNav` component (responsive, md:hidden)
- [ ] Define `PAGES` constant with icon, label (en + vi)
- [ ] Hook nav click to `store.setPage()` (hash sync automatic)
- [ ] Add CSS animations for page transitions
- [ ] Test responsive at 640px, 768px, 1024px
- [ ] Add haptic feedback on nav click (optional)
- [ ] Test Vietnamese text rendering (no overflow)
- [ ] Accessibility: ARIA labels, keyboard navigation

---

## References & Standards

- **Radix UI Tabs:** https://www.radix-ui.com/docs/primitives/components/tabs
- **Material Design Bottom Navigation:** https://material.io/components/bottom-navigation
- **Human Interface Guidelines (iOS):** Tab bar typically max 5 items
- **Web Vitals:** Keep animations <300ms for perceived performance

## Unresolved Questions

1. Should `tasks` be combined with `planning` tab or separate?
2. Should `astrology` stay primary nav or move to overflow?
3. Preferred page transition animation (fade, slide, zoom)?
4. Accept haptic feedback or keep pure web (no native APIs)?
