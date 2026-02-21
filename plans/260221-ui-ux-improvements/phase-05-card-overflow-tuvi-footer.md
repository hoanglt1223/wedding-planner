# Phase 5: Card Overflow + Tu Vi + Footer

## Context Links
- [UI/UX Audit — Issues #8, #9, #10](../reports/260221-ui-ux-audit-brainstorm.md)
- [Scout Report](scout/scout-codebase-report.md)

## Parallelization
- **Parallel-safe** — Runs after Phase 1. No shared files with Phase 2, 3, 4.

## Overview
- **Priority:** High
- **Status:** Pending
- **Effort:** 1.5h

Three independent sub-tasks grouped by file ownership:
1. **Issue #9 — Card overflow:** 30 cards (10 per ceremony x 3) is overwhelming. Show 3-4 per ceremony with "Xem them" expand button.
2. **Issue #10 — Tu Vi empty space:** Astrology page feels unfinished. Add visual richness (zodiac icons, better layout, sample preview).
3. **Issue #8 — Footer settings:** Theme picker and language toggle hidden as tiny footer text. Move to gear icon or make more discoverable.

## Key Insights

**Card overflow (background-grid.tsx, invitation-grid.tsx):**
- Each grid renders 10 backgrounds in a `grid-cols-2 sm:grid-cols-3 md:grid-cols-5` layout
- x3 ceremonies = 30 background cards + 30 invitation cards = 60 total card previews on the page
- Fix: show first 4, add "Xem them X mau" button to expand. Use `useState` toggle.

**Tu Vi (astrology-page.tsx):**
- Currently: 2 year inputs + empty space when no data entered
- Empty state (line 74-77): plain `"Nhap nam sinh..."` text, no visual
- Tab navigation uses inline hardcoded pills with `bg-purple-700` (inconsistent with app theme)
- Fix: add zodiac illustration to empty state, use theme-consistent tab colors

**Footer (footer.tsx, theme-picker.tsx):**
- Footer: 32 lines, bottom bar with copyright + theme + lang
- Theme picker: 49 lines, dropdown popup
- Both are tiny text, easy to miss
- Fix: make theme/lang controls more prominent. Options: (a) icons instead of text, (b) settings gear popover, (c) slightly larger touch targets

## Requirements

### Functional — Card Overflow
1. `background-grid.tsx`: show first 4 cards by default, "Xem them" button to reveal rest
2. `invitation-grid.tsx`: same pattern — first 4 cards, expand button
3. Expand button text: `"Xem them 6 mau nua"` (show 6 more designs)
4. Collapse button: `"Thu gon"` to re-hide

### Functional — Tu Vi
1. Better empty state: zodiac-themed icon + descriptive text + visual nudge
2. Tab styling: replace `bg-purple-700` with theme-consistent color (use `bg-primary text-primary-foreground` or softer pill style)
3. Add subtle decorative elements (zodiac symbols, decorative divider)

### Functional — Footer
1. Increase touch target size for theme and lang buttons (min 32px height)
2. Add icons: palette icon for theme, globe icon for language
3. Optional: wrap in a settings popover behind a gear icon
4. Keep copyright text

### Non-functional
- Card expand/collapse should animate (smooth height transition or fade)
- Footer controls accessible on mobile (touch-friendly)
- All Vietnamese text with proper diacritics

## Architecture

**Card overflow pattern:**
```tsx
const [expanded, setExpanded] = useState(false);
const visible = expanded ? backgrounds : backgrounds.slice(0, 4);

return (
  <>
    <div className="grid ...">{visible.map(...)}</div>
    {backgrounds.length > 4 && (
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Thu gon" : `Xem them ${backgrounds.length - 4} mau nua`}
      </button>
    )}
  </>
);
```

## Related Code Files

### Files to modify (EXCLUSIVE to this phase)
| File | Current Lines | Action |
|------|--------------|--------|
| `src/components/cards/background-grid.tsx` | 63 | Add expand/collapse for card overflow |
| `src/components/cards/invitation-grid.tsx` | 96 | Add expand/collapse for card overflow |
| `src/pages/astrology-page.tsx` | 112 | Improve empty state, fix tab colors |
| `src/components/layout/footer.tsx` | 32 | Improve theme/lang button visibility |
| `src/components/layout/theme-picker.tsx` | 49 | Add icon, increase touch target |

### Files NOT touched
- `header.tsx`, `topbar.tsx`, `App.tsx` (Phase 1)
- `scrollable-tab-bar.tsx`, `tab-navigation.tsx` (Phase 2)
- Guest/budget/notes/vendor panels (Phase 3)
- AI/ideas/cards-panel/rsvp/photo-board (Phase 4)

## Implementation Steps

### Step 1: Background grid expand/collapse (`background-grid.tsx`)
1. Add `useState(false)` for `expanded`
2. Slice backgrounds: `const visible = expanded ? backgrounds : backgrounds.slice(0, 4)`
3. Render `visible.map(...)` instead of `backgrounds.map(...)`
4. Add expand/collapse button below grid:
   ```tsx
   {backgrounds.length > 4 && (
     <button
       onClick={() => setExpanded(!expanded)}
       className="mt-2 w-full py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
     >
       {expanded ? "Thu gọn ↑" : `Xem thêm ${backgrounds.length - 4} mẫu nữa ↓`}
     </button>
   )}
   ```
5. Import `useState` from React
6. Estimated addition: ~12 lines. Total: ~75. Under limit.

### Step 2: Invitation grid expand/collapse (`invitation-grid.tsx`)
1. Same pattern as Step 1
2. Add `useState(false)` for `expanded`
3. Slice + button
4. Estimated addition: ~12 lines. Total: ~108. Under limit.

### Step 3: Tu Vi empty state improvement (`astrology-page.tsx`)
1. Replace lines 74-77 (plain text empty state) with visual empty state:
   ```tsx
   <div className="flex flex-col items-center py-12 text-center">
     <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mb-4">
       <span className="text-4xl">🔮</span>
     </div>
     <h3 className="text-base font-semibold mb-1">Khám phá tử vi đôi bạn</h3>
     <p className="text-sm text-muted-foreground max-w-xs">
       Nhập năm sinh của cô dâu và chú rể để xem phân tích ngũ hành, hợp tuổi, và phong thủy
     </p>
   </div>
   ```
2. Fix tab colors (lines 86-89): replace `bg-purple-700` with `bg-primary text-primary-foreground`
3. Replace `hover:bg-purple-50 hover:text-purple-700` with `hover:bg-muted hover:text-foreground`
4. Add decorative divider between inputs and tabs:
   ```tsx
   <div className="flex items-center gap-2 text-muted-foreground/40">
     <div className="h-px flex-1 bg-border" />
     <span className="text-xs">☯</span>
     <div className="h-px flex-1 bg-border" />
   </div>
   ```
5. Estimated changes: +15 lines, -3 lines. Total: ~124. Under limit.

### Step 4: Footer improvements (`footer.tsx`)
1. Replace text-only theme/lang buttons with icon+text:
   - Lang button: `🌐 Tiếng Việt` / `🌐 English` (larger, `h-8 px-3 rounded-lg bg-muted hover:bg-muted/80`)
   - Theme button trigger: `🎨 Giao diện` (larger, same style)
2. Increase overall footer height slightly: `h-14` instead of `h-12`
3. Add `gap-2` between controls
4. Estimated changes: ~5 line modifications. Total stays ~32.

### Step 5: Theme picker improvements (`theme-picker.tsx`)
1. Update trigger button: add color swatch preview next to text
   ```tsx
   <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors">
     <span className="w-3 h-3 rounded-full border border-border" style={{ background: currentTheme.primary }} />
     <span>Giao diện</span>
   </button>
   ```
2. Need to pass current theme color or find it from `THEMES` + `activeTheme`
3. Add `currentTheme` lookup: `const current = THEMES.find(t => t.id === activeTheme)`
4. Estimated changes: ~8 lines modified. Total stays ~49.

## Todo List
- [ ] Add expand/collapse to `background-grid.tsx` (show 4, expand to 10)
- [ ] Add expand/collapse to `invitation-grid.tsx` (show 4, expand to 10)
- [ ] Improve Tu Vi empty state with visual design
- [ ] Fix Tu Vi tab colors from purple to theme-consistent
- [ ] Add decorative divider in Tu Vi page
- [ ] Improve footer button visibility with icons + larger targets
- [ ] Add color swatch preview to theme picker trigger
- [ ] Ensure all Vietnamese text uses proper diacritics
- [ ] Verify all files stay under 200 lines
- [ ] Run `npm run build` to verify no compile errors

## Success Criteria
- Cards page shows 4 cards per section by default (not 10 x 3 = 30)
- Expand/collapse works with clear "Xem them"/"Thu gon" buttons
- Tu Vi empty state has visual illustration, not plain text
- Tu Vi tabs use theme colors, not hardcoded purple
- Footer controls are touch-friendly (min 32px height) with icons
- Theme picker shows current color swatch

## Conflict Prevention
- This phase ONLY touches: `background-grid.tsx`, `invitation-grid.tsx`, `astrology-page.tsx`, `footer.tsx`, `theme-picker.tsx`
- `cards-panel.tsx` (Phase 4) imports `BackgroundGrid` and `InvitationGrid` — but Phase 4 only changes wrapper divs/classes, not the grid component props. No conflict.
- `astrology-page.tsx` uses inline tab buttons (not `ScrollableTabBar`), so no conflict with Phase 2's changes to `scrollable-tab-bar.tsx`
- `App.tsx` renders `Footer` — but Phase 1 only changes Header/Topbar/Navbar section, not Footer rendering. No conflict.

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Expand/collapse adds state to previously stateless components | Low | Simple boolean state, no side effects |
| Tu Vi tab color change might clash with existing astrology sub-components | Low | Sub-components don't reference purple — they use standard card styles |
| Footer layout changes on mobile | Low | Flex-wrap handles overflow, test on 390px |
| `invitation-grid.tsx` at 96 + 12 = 108 lines | Info | Well under 200 limit |

## Next Steps
- After all phases complete, full visual regression check across all pages
- Consider carousel alternative for cards if expand/collapse feels clunky (future iteration)
- Tu Vi page may benefit from animated zodiac wheel in future (YAGNI for now)
