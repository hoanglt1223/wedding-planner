# Phase 03: Section Page Containers

## Parallelization Info

- **Group:** B (sequential -- must run after Phase 01 + 02 complete)
- **Depends on:** Phase 01 (install-prompt import), Phase 02 (BottomNav, MenuDrawer, nav-sections, updated page-definitions)
- **Blocks:** Phase 04, 05, 06, 07

## Context Links

- [Current App.tsx](../../src/App.tsx) -- 130 lines, Navbar + PageRouter + Footer
- [Current page-router.tsx](../../src/pages/page-router.tsx) -- 107 lines, switch on state.page
- [Current planning-page.tsx](../../src/pages/planning-page.tsx) -- 44 lines
- [Phase 02 nav-sections.ts](phase-02-navigation-architecture.md) -- section mapping

## Overview

- **Priority:** CRITICAL (integration layer connecting nav to content)
- **Status:** complete
- **Effort:** 5h
- **Description:** Create section container pages (Home, Guests, Tools), update PageRouter for new sections, wire BottomNav + MenuDrawer into App.tsx, modify Planning page to show Budget tab, update Footer.

## Key Insights

- Home page is initially a placeholder (Phase 04 fills it with dashboard widgets)
- Guests page groups: RSVP dashboard, Photo wall, Gift tracker as tabs
- Tools page groups: AI chat, Astrology, Task board as tabs
- Planning page keeps existing structure; Budget tab added in Phase 05
- PageRouter needs 3 new cases: "home", "guests", "tools"
- App.tsx becomes the orchestration point: header(minimal) + PageRouter + BottomNav + MenuDrawer + Footer

## Requirements

### Functional
- Home page renders placeholder with "Dashboard coming soon" (Phase 04 fills content)
- Guests page renders tabbed view: RSVP | Photos | Gifts
- Tools page renders tabbed view: AI | Astrology | Tasks
- Planning page unchanged (Phase 05 adds budget sub-tab)
- BottomNav appears at bottom on mobile
- MenuDrawer accessible from bottom nav "Menu" item
- Footer appears above bottom nav (with proper spacing)
- Default page on load: "home" (changed from "planning")

### Non-Functional
- All new pages < 200 lines
- Bottom padding on content area: `pb-20` to clear fixed bottom nav
- Lazy-load heavy sub-pages within sections

## Architecture

```
App.tsx (orchestrator)
  -> Navbar (header, simplified mobile)
  -> PageRouter (expanded with 3 new pages)
     -> home    -> HomePage (placeholder, Phase 04 fills)
     -> guests  -> GuestsPage (tabbed: RSVP, Photos, Gifts)
     -> tools   -> ToolsPage (tabbed: AI, Astrology, Tasks)
     -> planning -> PlanningPage (unchanged)
     -> ... (existing pages stay)
  -> Footer (with bottom margin for nav)
  -> BottomNav (fixed bottom, mobile only)
  -> MenuDrawer (sheet, controlled by state)
  -> InstallPrompt (from Phase 01)
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `src/App.tsx` | Add BottomNav, MenuDrawer, update import from install-prompt, add pb-20 on mobile, pass menu state |
| `src/pages/page-router.tsx` | Add cases for "home", "guests", "tools" |
| `src/pages/planning-page.tsx` | No changes in this phase (Phase 05 adds budget) |
| `src/components/layout/footer.tsx` | Add `mb-16 md:mb-0` to clear bottom nav |

### Files to CREATE
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/pages/home-page.tsx` | Home dashboard placeholder | ~40 |
| `src/pages/guests-page.tsx` | Tabbed container: RSVP, Photos, Gifts | ~120 |
| `src/pages/tools-page.tsx` | Tabbed container: AI, Astrology, Tasks | ~100 |

## File Ownership (EXCLUSIVE)

This phase owns:
- `src/App.tsx` (MODIFY)
- `src/pages/page-router.tsx` (MODIFY)
- `src/pages/home-page.tsx` (NEW)
- `src/pages/guests-page.tsx` (NEW)
- `src/pages/tools-page.tsx` (NEW)
- `src/pages/planning-page.tsx` (MODIFY -- only in this phase, Phase 05 does NOT touch it)
- `src/components/layout/footer.tsx` (MODIFY)

No other phase may touch these files.

## Implementation Steps

### Step 1: Create home-page.tsx (placeholder)

`src/pages/home-page.tsx` (~40 lines):

```typescript
import { t } from "@/lib/i18n";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface HomePageProps {
  state: WeddingState;
  store: WeddingStore;
  progress: { done: number; total: number; pct: number };
}

export function HomePage({ state, progress }: HomePageProps) {
  const lang = state.lang;
  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <div className="text-4xl mb-2">💒</div>
        <h1 className="text-xl font-bold">{t("Trang Chủ", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("Tổng quan kế hoạch cưới", lang)}
        </p>
        <p className="text-sm mt-2">{progress.pct}% {t("hoàn thành", lang)}</p>
      </div>
    </div>
  );
}
```

Phase 04 will replace the placeholder content with dashboard widgets.

### Step 2: Create guests-page.tsx (tabbed)

`src/pages/guests-page.tsx` (~120 lines):

- Tab bar at top: RSVP | Photos | Gifts
- Track active sub-tab in local `useState(0)`
- Tab 0: Import and render existing `GuestDashboard` component (from `src/components/guests/`)
- Tab 1: Import and render existing `PhotoGalleryDashboard` (from `src/components/photo-wall/`)
- Tab 2: Lazy-load existing `GiftPage` (from `src/pages/gift-page.tsx`)
- Use shadcn Tabs component for tab bar
- Accept same props as PageRouter passes
- All tab labels bilingual

### Step 3: Create tools-page.tsx (tabbed)

`src/pages/tools-page.tsx` (~100 lines):

- Tab bar: AI | Astrology | Tasks
- Tab 0: Existing `AiPanel`
- Tab 1: Existing `AstrologyPage`
- Tab 2: Lazy-load existing `TaskBoardDashboard`
- Use shadcn Tabs component
- Accept same props as PageRouter passes

### Step 4: Update page-router.tsx

Add 3 new cases to the switch:
```typescript
case "home":
  return <HomePage state={state} store={store} progress={progress} />;
case "guests":
  return <GuestsPage state={state} store={store} userId={userId} />;
case "tools":
  return <ToolsPage state={state} store={store} onGoAI={onGoAI} userId={userId} />;
```

Keep all existing cases intact (planning, astrology, cards, ai, handbook, ideas, tasks, website). These are still accessible via Menu drawer and desktop header tabs.

### Step 5: Update App.tsx

Major changes:
1. Import `BottomNav` from `@/components/layout/bottom-nav`
2. Import `MenuDrawer` from `@/components/layout/menu-drawer`
3. Import `InstallPrompt` from `@/components/pwa/install-prompt` (replaces ios-install-prompt)
4. Add `menuOpen` state: `const [menuOpen, setMenuOpen] = useState(false)`
5. Add `pb-20 md:pb-0` to main content container for bottom nav clearance
6. Render BottomNav after Footer
7. Render MenuDrawer controlled by `menuOpen` state
8. Pass all necessary props (activePage, onPageChange, lang, region, theme, etc.)

Structure:
```tsx
<div className="min-h-screen" style={themeVars}>
  <Navbar ... /> {/* simplified on mobile */}
  <div className="max-w-[920px] mx-auto px-3 sm:px-2 pt-2 pb-20 md:pb-0">
    <PageRouter ... />
  </div>
  <Footer ... />
  <BottomNav
    activePage={state.page}
    onPageChange={store.setPage}
    onMenuOpen={() => setMenuOpen(true)}
    lang={state.lang}
  />
  <MenuDrawer
    open={menuOpen}
    onOpenChange={setMenuOpen}
    lang={state.lang}
    onPageChange={(page) => { store.setPage(page); setMenuOpen(false); }}
    region={state.region}
    onSetRegion={store.setRegion}
    onSetLang={store.setLang}
    activeTheme={state.themeId || DEFAULT_THEME_ID}
    onSelectTheme={store.setTheme}
  />
  <InstallPrompt lang={state.lang} />
  <SaveToast visible={showSave} />
</div>
```

### Step 6: Update footer.tsx

Add bottom margin to clear fixed bottom nav:
```tsx
<footer className="mt-4 mb-20 md:mb-0 border-t border-amber-100">
```

### Step 7: Verify and test

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Test:
- Mobile: bottom nav visible, 5 items work, menu drawer opens
- Desktop: bottom nav hidden, header tabs visible
- Navigate between all sections
- Existing pages (planning, astrology, etc.) still work via desktop tabs or menu

## Todo List

- [ ] Create `home-page.tsx` placeholder
- [ ] Create `guests-page.tsx` with tabbed RSVP/Photos/Gifts
- [ ] Create `tools-page.tsx` with tabbed AI/Astrology/Tasks
- [ ] Update `page-router.tsx` with 3 new cases
- [ ] Update `App.tsx` with BottomNav, MenuDrawer, InstallPrompt
- [ ] Update `footer.tsx` with bottom margin
- [ ] Check if shadcn Tabs component exists; install if needed
- [ ] Verify tsc --noEmit
- [ ] Verify npm run build
- [ ] Test mobile nav flow
- [ ] Test desktop nav flow

## Success Criteria

- All 5 bottom nav sections navigable on mobile
- Menu drawer shows overflow items and settings
- Guests page shows 3 tabs with existing components
- Tools page shows 3 tabs with existing components
- Home page renders placeholder
- Desktop layout unchanged (header tabs still work)
- No TypeScript errors, lint passes, build succeeds

## Conflict Prevention

- **App.tsx**: This is the most integration-heavy file. Phase 03 is the ONLY phase that touches it.
- **page-router.tsx**: Only Phase 03 adds new cases. Existing cases untouched.
- **footer.tsx**: Only add margin class. Do not change content or structure.
- **planning-page.tsx**: Phase 05 budget lives inside the existing tab system (PanelRouter), not in planning-page.tsx directly. If Phase 05 needs to add a budget tab, it does so via `tab-navigation.tsx` and `panel-router.tsx` which are NOT owned by Phase 03.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| shadcn Tabs component missing | Med | Check for `src/components/ui/tabs.tsx`; install via `npx shadcn@latest add tabs` |
| Import cycle between pages | Low | Lazy-load heavy components; keep section pages as thin wrappers |
| Bottom nav overlaps content | Med | `pb-20 md:pb-0` padding + test on real device |
| Default page change breaks existing users | Med | State migration not needed; `DEFAULT_PAGE` change only affects new sessions. Existing users keep their last `state.page`. |

## Security Considerations

- No new API calls or data persistence
- MenuDrawer Reset Data keeps existing double-confirm pattern
- No sensitive data exposed in new components

## Next Steps

- Phase 04 fills `HomePage` with dashboard widgets (progress ring, quick actions, daily tips)
- Phase 05 adds expense tracker components (accessible via Planning > Budget tab)
- Phase 06 revamps onboarding wizard to land on Home page
