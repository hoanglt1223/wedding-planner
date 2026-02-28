# Phase 02: Navigation Architecture -- Bottom Nav + Layout

## Parallelization Info

- **Group:** A (runs in parallel with Phase 01)
- **Depends on:** Nothing
- **Blocks:** Phase 03 (Section Page Containers)
- **No file conflicts with Phase 01**

## Context Links

- [Mobile Nav Research](research/researcher-02-mobile-nav-patterns.md)
- [Brainstorm Summary](../260228-phase3-engagement-polish-brainstorm/brainstorm-summary.md)
- [Current header.tsx](../../src/components/layout/header.tsx) -- ~208 lines, scrollable tabs
- [Current page-definitions.ts](../../src/data/page-definitions.ts) -- 8 pages, flat list
- [Code Standards](../../docs/code-standards.md)

## Overview

- **Priority:** CRITICAL (foundation for all nav changes)
- **Status:** complete
- **Effort:** 4h
- **Description:** Create mobile bottom nav bar (5 sections), restructure header to minimal bar, build menu drawer for overflow items, define new nav section mapping.

## Key Insights

- Current header has 8 horizontal tabs that require scrolling on mobile -- poor discoverability
- Bottom nav limited to 5 items (Material Design / HIG best practice)
- Vietnamese labels are longer; use icons + short labels, stack layout
- Bottom nav: `fixed bottom-0 md:hidden` | Desktop: keep header tabs (simpler than sidebar for v1)
- Touch targets must be >= 44px (WCAG 2.1 AAA)
- `state.page` already drives routing; nav just calls `store.setPage()`
- Need nav "sections" concept: each section maps to 1+ existing pages

## Requirements

### Functional
- 5-item bottom nav on mobile: Home, Planning, Guests, Tools, Menu
- Menu opens a drawer/sheet with overflow items (Website, Themes, Language, Region, Handbook, Cards, About)
- Header shrinks to: app name + countdown + share + offline badge placeholder
- Desktop (>=768px): hide bottom nav, show header with all tabs (like current)
- Active section highlighted with color + indicator
- Smooth haptic-free transitions (web-only)

### Non-Functional
- Bottom nav height: 64px (h-16), touch targets >= 44px
- Body bottom padding to prevent content overlap behind fixed nav
- z-index: 40 (below modals z-50, above content)
- i18n: all labels use `t(key, lang)` pattern
- Vietnamese short labels: Trang chủ, Kế hoạch, Khách mời, Công cụ, Menu

## Architecture

```
New Navigation System:
  BottomNav (mobile, fixed bottom, md:hidden)
    -> 5 NavItem buttons (icon + label)
    -> Click Home/Planning/Guests/Tools -> store.setPage(sectionDefaultPage)
    -> Click Menu -> open MenuDrawer

  MenuDrawer (Sheet component from shadcn)
    -> Website, Handbook, Cards, Theme, Language, Region, Reset
    -> Each item -> store.setPage() + close drawer

  Header (simplified for mobile, full tabs for desktop)
    -> Mobile: app name + countdown + share
    -> Desktop (md:+): existing tab nav + all controls

Nav Section Mapping (nav-sections.ts):
  home     -> "home" (new page)
  planning -> "planning" (existing, default tab)
  guests   -> "guests" (new section page with RSVP/Photos/Gifts tabs)
  tools    -> "tools" (new section page with AI/Astrology/Tasks tabs)
  menu     -> opens drawer (no page change)
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `src/components/layout/header.tsx` | Remove tab nav from mobile view; keep for desktop. Simplify mobile to minimal bar. |
| `src/data/page-definitions.ts` | Add section concept, add `home` page def, add icon/shortLabel fields to PageDef |

### Files to CREATE
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/layout/bottom-nav.tsx` | Fixed bottom nav bar with 5 items | ~120 |
| `src/components/layout/menu-drawer.tsx` | Overflow menu as Sheet/Drawer | ~120 |
| `src/data/nav-sections.ts` | Section -> page mapping, section definitions | ~60 |

## File Ownership (EXCLUSIVE)

This phase owns:
- `src/components/layout/bottom-nav.tsx` (NEW)
- `src/components/layout/menu-drawer.tsx` (NEW)
- `src/components/layout/header.tsx` (MODIFY)
- `src/data/page-definitions.ts` (MODIFY)
- `src/data/nav-sections.ts` (NEW)

No other phase may touch these files.

## Implementation Steps

### Step 1: Update page-definitions.ts

Add icon and shortLabel fields. Add `home` page. Keep backward compat.

```typescript
export interface PageDef {
  id: string;
  label: string;       // Full label (existing, used for desktop tabs)
  icon: string;        // Emoji icon for bottom nav
  shortLabel?: string; // Short label for bottom nav (i18n key)
}

export const PAGES: PageDef[] = [
  { id: "home", label: "🏠 Trang Chủ", icon: "🏠", shortLabel: "Trang chủ" },
  { id: "planning", label: "💒 Kế Hoạch", icon: "💒", shortLabel: "Kế hoạch" },
  { id: "astrology", label: "🔮 Tử Vi", icon: "🔮" },
  { id: "cards", label: "🖼️ Thiệp", icon: "🖼️" },
  { id: "ai", label: "🤖 AI", icon: "🤖" },
  { id: "handbook", label: "📖 Sổ Tay", icon: "📖" },
  { id: "ideas", label: "💡 Ý Tưởng", icon: "💡" },
  { id: "tasks", label: "📋 Công Việc", icon: "📋" },
  { id: "website", label: "🌐 Website", icon: "🌐" },
  { id: "guests", label: "👥 Khách Mời", icon: "👥", shortLabel: "Khách mời" },
  { id: "tools", label: "🔧 Công Cụ", icon: "🔧", shortLabel: "Công cụ" },
];

export const DEFAULT_PAGE = "home";
```

### Step 2: Create nav-sections.ts

```typescript
export interface NavSection {
  id: string;
  icon: string;
  labelVi: string;
  labelEn: string;
  type: "page" | "drawer";
  defaultPage?: string; // page to navigate to on click
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "home", icon: "🏠", labelVi: "Trang chủ", labelEn: "Home", type: "page", defaultPage: "home" },
  { id: "planning", icon: "💒", labelVi: "Kế hoạch", labelEn: "Plan", type: "page", defaultPage: "planning" },
  { id: "guests", icon: "👥", labelVi: "Khách mời", labelEn: "Guests", type: "page", defaultPage: "guests" },
  { id: "tools", icon: "🔧", labelVi: "Công cụ", labelEn: "Tools", type: "page", defaultPage: "tools" },
  { id: "menu", icon: "☰", labelVi: "Menu", labelEn: "Menu", type: "drawer" },
];

// Which existing pages belong to which section (for active state highlighting)
export const PAGE_TO_SECTION: Record<string, string> = {
  home: "home",
  planning: "planning",
  guests: "guests",
  tools: "tools",
  astrology: "tools",
  ai: "tools",
  tasks: "tools",
  cards: "menu",
  handbook: "menu",
  ideas: "menu",
  website: "menu",
};

// Items shown in the Menu drawer
export const MENU_ITEMS = [
  { pageId: "website", icon: "🌐", labelVi: "Website", labelEn: "Website" },
  { pageId: "cards", icon: "🖼️", labelVi: "Thiệp", labelEn: "Cards" },
  { pageId: "handbook", icon: "📖", labelVi: "Sổ Tay", labelEn: "Handbook" },
  { pageId: "ideas", icon: "💡", labelVi: "Ý Tưởng", labelEn: "Ideas" },
];
```

### Step 3: Create bottom-nav.tsx

`src/components/layout/bottom-nav.tsx` (~120 lines):

- Fixed at bottom, `md:hidden`
- Renders 5 `NavSection` items as buttons
- Active state: compare `PAGE_TO_SECTION[activePage]` with section.id
- Click handler: if `type === "page"` -> `onPageChange(defaultPage)`, if `type === "drawer"` -> `onMenuOpen()`
- Active indicator: colored dot or border-top-2 on active
- Height: `h-16`, items stacked (icon above label)
- Safe area: `pb-safe` for iOS notch (env(safe-area-inset-bottom))
- `z-40` stacking

### Step 4: Create menu-drawer.tsx

`src/components/layout/menu-drawer.tsx` (~120 lines):

- Uses shadcn `Sheet` component (bottom sheet on mobile)
- Lists MENU_ITEMS as navigation buttons
- Includes: Theme picker, Language toggle, Region selector, Reset data
- Each nav item: icon + label, click -> `onPageChange(pageId)` + close sheet
- Settings section: divider + theme/lang/region/reset controls
- Accept props: `open`, `onOpenChange`, `lang`, `onPageChange`, `onSetLang`, `onSetRegion`, `region`, `activeTheme`, `onSelectTheme`

Check if Sheet component exists; if not, install: `npx shadcn@latest add sheet`

### Step 5: Modify header.tsx

Restructure header for responsive design:

**Mobile (<md):**
- App name "Wedding" + countdown badge + share button (compact)
- Remove: tab navigation, progress bar, region selector, language toggle, reminders bell
- Those controls move to bottom-nav and menu-drawer

**Desktop (>=md):**
- Keep existing tab navigation intact
- Keep all controls (progress, countdown, share, region, language, reminders)

Key changes:
- Wrap tab nav in `hidden md:flex` container
- Wrap region/language/progress in `hidden md:flex` container
- Mobile header becomes: `<span>Wedding</span> + <countdown> + <share>`
- Remove `PAGES` import usage for mobile; desktop keeps it

### Step 6: Verify TypeScript compilation

```bash
npx tsc --noEmit
npm run lint
```

## Todo List

- [ ] Update PageDef interface with icon/shortLabel fields
- [ ] Add `home`, `guests`, `tools` page defs
- [ ] Create `nav-sections.ts` with section mapping
- [ ] Install shadcn Sheet component if missing
- [ ] Create `bottom-nav.tsx` (5 items, fixed bottom)
- [ ] Create `menu-drawer.tsx` (Sheet with overflow items)
- [ ] Modify `header.tsx` to hide tabs on mobile, keep for desktop
- [ ] Verify tsc --noEmit passes
- [ ] Verify lint passes

## Success Criteria

- Bottom nav visible on mobile (<768px), hidden on desktop
- Tapping Home/Planning/Guests/Tools navigates correctly
- Tapping Menu opens drawer with overflow items + settings
- Desktop shows full header with tabs (unchanged behavior)
- Active section highlighted in bottom nav
- All labels bilingual (vi/en)
- Touch targets >= 44px

## Conflict Prevention

- **header.tsx**: Only change responsive visibility classes. Do not change props interface (Phase 03 may need current props).
- **page-definitions.ts**: Only add new fields and new page defs. Do not remove existing pages or change existing `id` values.
- Phase 03 will wire BottomNav and MenuDrawer into App.tsx; this phase only creates the components.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| shadcn Sheet not installed | Low | Check `src/components/ui/sheet.tsx` exists; install if missing |
| Vietnamese labels overflow bottom nav | Med | Use `text-2xs` (already in index.css) + truncate class |
| Desktop layout regression | Med | Header changes wrapped in `md:` breakpoints; no mobile changes leak to desktop |
| PAGE_TO_SECTION mapping incomplete | Low | Default to "menu" for unmapped pages |

## Security Considerations

- No API calls, no data persistence changes
- Menu drawer handles Reset Data -- keep existing confirmation flow (double-click pattern)

## Next Steps

- Phase 03 integrates BottomNav + MenuDrawer into App.tsx
- Phase 03 creates the actual page containers (home-page, guests-page, tools-page)
- Phase 07 adds slide transitions between nav sections
