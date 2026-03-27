# Phase 5: Wire into AstrologyPage

## Context
- [astrology-page.tsx](../../src/pages/astrology-page.tsx) — tab host, ~115 lines currently

## Overview
- **Priority:** P1
- **Status:** pending
- Add new tab entry and render the TabWeddingDate component

## Requirements

### Functional
- Add `{ id: "wedding-date", label: "📅 Ngay Cuoi" }` to TAB_IDS array
- Position: first in the tab list (highest user priority for this feature)
- Render `TabWeddingDate` when active, passing brideYear, groomYear, weddingYear, lang
- Default active tab stays "compatibility" (existing behavior)

### Non-functional
- No change to file structure, just add import + 2 lines

## Related Code Files
- **Modify:** `src/pages/astrology-page.tsx`

## Implementation Steps

1. Add import: `import { TabWeddingDate } from "@/components/astrology/tab-wedding-date";`
2. Add to TAB_IDS at index 0: `{ id: "wedding-date", label: "📅 Ngay Cuoi" }`
3. Add render: `{activeTab === "wedding-date" && <TabWeddingDate brideYear={brideYear} groomYear={groomYear} weddingYear={weddingYear} lang={lang} />}`
4. Pass `info` prop if needed for birth dates (TabWeddingDate may need full birth dates not just years for more precise scoring)

## Todo
- [ ] Add import for TabWeddingDate
- [ ] Add tab entry to TAB_IDS
- [ ] Add conditional render in tab content area

## Success Criteria
- New tab visible in astrology page tab bar
- Tab scrolls horizontally with others
- Component renders when tab clicked
- No regressions on existing tabs

## Risk Assessment
- **Very low** — additive change, no existing code modified
- Tab bar may get crowded with 7 tabs — already uses horizontal scroll (`overflow-x-auto`)
