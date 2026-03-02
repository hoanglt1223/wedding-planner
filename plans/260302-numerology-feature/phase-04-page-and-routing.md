# Phase 4: Page & Routing

## Context Links

- Parent plan: [plan.md](plan.md)
- Depends on: [Phase 3](phase-03-ui-components.md)
- Reference: `src/pages/astrology-page.tsx` (page pattern)
- Reference: `src/pages/page-router.tsx` (route switch)
- Reference: `src/data/nav-sections.ts` (navigation config)

## Overview

- **Priority**: P1 (feature not accessible without routing)
- **Status**: complete
- **Description**: Create the main NumerologyPage, wire it into PageRouter, and add navigation menu entry.

## Key Insights

- Page mirrors `astrology-page.tsx` structure: header, input form (optional names), tab nav, tab content
- Full-name inputs stored in page-level `useState` (not WeddingState)
- Falls back to `info.bride`/`info.groom` when full names empty
- Route key: `"numerology"` added to `state.page` switch
- Nav entry: add to `MENU_ITEMS` in `nav-sections.ts` (drawer menu item)
- `PAGE_TO_SECTION` mapping: `numerology: "menu"`

## Requirements

### Functional
- New `NumerologyPage` component with tab navigation
- Optional full-name inputs (bride + groom) at top of page
- 5 tabs: Ho so, Tuong hop, Ngay cuoi, Du bao, May man
- Accessible via PageRouter when `state.page === "numerology"`
- Menu drawer entry with icon and label

### Non-functional
- Page under 200 lines
- Lazy loading NOT needed (small bundle, same as astrology)

## Architecture

### File: `src/pages/numerology-page.tsx` (~120 lines)

```typescript
interface NumerologyPageProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string | number | null) => void;
}

const TAB_IDS = [
  { id: "profile", label: "🔢 Ho So" },
  { id: "compatibility", label: "💑 Tuong Hop" },
  { id: "wedding", label: "📅 Ngay Cuoi" },
  { id: "forecast", label: "🔮 Du Bao" },
  { id: "lucky", label: "🍀 May Man" },
];
```

Page manages:
- `activeTab` state
- `brideFullName` / `groomFullName` state (optional name inputs)
- Computes `NumerologyProfile` for each person
- Passes computed data to active tab

### Modifications to Existing Files

**`src/pages/page-router.tsx`** — Add case:
```typescript
case "numerology":
  return (
    <NumerologyPage
      info={state.info}
      onUpdateInfo={store.updateInfo}
    />
  );
```

**`src/data/nav-sections.ts`** — Add to `MENU_ITEMS`:
```typescript
{ pageId: "numerology", icon: "🔢", labelVi: "Than So Hoc", labelEn: "Numerology" },
```

**`src/data/nav-sections.ts`** — Add to `PAGE_TO_SECTION`:
```typescript
numerology: "menu",
```

## Related Code Files

### Files to Create
- `src/pages/numerology-page.tsx`

### Files to Modify
- `src/pages/page-router.tsx` — add switch case + import
- `src/data/nav-sections.ts` — add menu item + page mapping

## Implementation Steps

1. Create `src/pages/numerology-page.tsx`
2. Implement page structure:
   - Header: title "Than So Hoc" with subtitle
   - Optional full-name input section (two text inputs, collapsible)
   - Tab navigation bar (horizontal scroll, same CSS as astrology)
   - Tab content switch
3. Compute profiles with `useMemo`:
   ```typescript
   const brideProfile = useMemo(() =>
     calcFullProfile(info.brideBirthDate, brideFullName || info.bride),
     [info.brideBirthDate, brideFullName, info.bride]
   );
   ```
4. Guard: if no birth dates, show empty state (same pattern as astrology)
5. Pass props to each tab component
6. Edit `src/pages/page-router.tsx`:
   - Add import: `import { NumerologyPage } from "./numerology-page";`
   - Add case `"numerology"` in switch statement
7. Edit `src/data/nav-sections.ts`:
   - Add entry to `MENU_ITEMS` array (after "Astrology" entry)
   - Add `numerology: "menu"` to `PAGE_TO_SECTION`

## Todo List

- [ ] Create `src/pages/numerology-page.tsx`
- [ ] Implement header, name inputs, tab nav, tab switching
- [ ] Add useMemo for profile calculations
- [ ] Add empty state when no birth dates
- [ ] Add NumerologyPage import + case to page-router.tsx
- [ ] Add menu item to nav-sections.ts MENU_ITEMS
- [ ] Add PAGE_TO_SECTION mapping
- [ ] Test navigation from menu drawer
- [ ] Run `npm run build`

## Success Criteria

- Clicking "Than So Hoc" in menu drawer navigates to numerology page
- Tab switching works across all 5 tabs
- Full-name inputs are optional and fall back to CoupleInfo names
- Empty state shown when birth dates missing
- Page under 200 lines

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Profile recalculation on every render | Performance | useMemo with correct deps |
| Tab state lost on page switch | UX annoyance | Acceptable, same as astrology page |

## Security Considerations

- No new API endpoints or state mutations
- Full names stored in component state only, not persisted

## Next Steps

- Phase 5: AI integration for deep numerology reading
