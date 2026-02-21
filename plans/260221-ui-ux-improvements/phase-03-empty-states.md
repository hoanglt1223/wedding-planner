# Phase 3: Empty States

## Context Links
- [UI/UX Audit — Issue #5](../reports/260221-ui-ux-audit-brainstorm.md)
- [SaaS Nav Patterns — Empty state design](research/researcher-01-saas-nav-patterns.md)
- [Scout Report](scout/scout-codebase-report.md)

## Parallelization
- **Parallel-safe** — Runs after Phase 1. No shared files with Phase 2, 4, 5.

## Overview
- **Priority:** Critical
- **Status:** Pending
- **Effort:** 1.5h

Add proper empty state designs to Guest, Budget, Notes, and Vendor panels. Each empty state follows the 3-layer pattern: icon/illustration + action headline + CTA button. Vietnamese text with proper diacritics.

## Key Insights

Current empty states:
- `guest-panel.tsx` (179 lines): No explicit empty state — shows add form + stats bar even with 0 guests
- `budget-panel.tsx` (121 lines): No empty state — shows 0d budget input + all categories at 0%
- `notes-panel.tsx` (30 lines): Just a textarea with placeholder — no guidance
- `vendor-panel.tsx` (125 lines): Line 120: `"Chua co vendor nao."` — minimal text, no CTA, no icon

Research pattern (from SaaS audit):
- Centered container, `py-16 px-4 text-center`
- Icon in `w-24 h-24 rounded-2xl bg-muted` box
- Headline: action-framed ("Them khach moi dau tien" not "Khong co khach")
- Single primary CTA button
- Optional subtitle: 1 line max

## Requirements

### Functional
1. Guest panel: when `guests.length === 0`, show empty state with guest icon + "Them khach moi dau tien" + primary button that focuses name input
2. Budget panel: when `budget === 0`, show empty state with money icon + "Thiet lap ngan sach" + preset buttons inline
3. Notes panel: when `notes === ""`, add visual empty state above textarea with notepad icon + guidance text
4. Vendor panel: replace `"Chua co vendor nao."` with proper 3-layer empty state

### Non-functional
- Consistent styling across all 4 panels
- Vietnamese text with correct diacritics
- Empty states should not add more than ~30 lines per file (keep under 200 line limit)

## Architecture

**Empty state component pattern:**
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
    <span className="text-3xl">ICON</span>
  </div>
  <h3 className="text-base font-semibold mb-1">Action headline</h3>
  <p className="text-sm text-muted-foreground max-w-xs mb-4">Subtitle</p>
  <Button size="sm">CTA</Button>
</div>
```

Consider extracting a shared `EmptyState` component if patterns are identical. File: `src/components/ui/empty-state.tsx` (~30 lines). But only if 3+ panels use exact same structure. YAGNI: might be easier to inline each since content differs.

**Decision:** Inline empty states per panel — each has unique icon, text, CTA behavior. Extracting a wrapper adds indirection for minimal DRY gain.

## Related Code Files

### Files to modify (EXCLUSIVE to this phase)
| File | Current Lines | Action |
|------|--------------|--------|
| `src/components/guests/guest-panel.tsx` | 179 | Add empty state when guests.length === 0 |
| `src/components/budget/budget-panel.tsx` | 121 | Add empty state when budget === 0 |
| `src/components/notes/notes-panel.tsx` | 30 | Add visual enhancement for empty state |
| `src/components/vendors/vendor-panel.tsx` | 125 | Replace minimal "Chua co" text with proper empty state |

### Files NOT touched
- All layout files (Phase 1, 2)
- All cards/AI/ideas files (Phase 4)
- Footer, astrology, grids (Phase 5)

## Implementation Steps

### Step 1: Guest panel empty state (`guest-panel.tsx`)
1. Wrap the stats bar + form + table section in a condition: `{guests.length > 0 ? (...existing...) : (...empty state...)}`
2. But keep the add form visible even in empty state (user needs it to add first guest)
3. Better approach: show empty state BELOW the form when `guests.length === 0`:
   ```tsx
   {guests.length === 0 && (
     <div className="flex flex-col items-center py-10 text-center">
       <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
         <span className="text-3xl">👥</span>
       </div>
       <h3 className="text-base font-semibold mb-1">Thêm khách mời đầu tiên</h3>
       <p className="text-sm text-muted-foreground max-w-xs">
         Nhập tên khách ở form bên trên để bắt đầu danh sách mời
       </p>
     </div>
   )}
   ```
4. Remove stats bar display when 0 guests (the "Trai: 0 | Gai: 0 | Ban: 0" is meaningless)
5. Estimated addition: ~15 lines. Total: ~194. OK.

### Step 2: Budget panel empty state (`budget-panel.tsx`)
1. When `budget === 0`, show empty state above the categories:
   ```tsx
   {budget === 0 && (
     <div className="flex flex-col items-center py-8 text-center">
       <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
         <span className="text-3xl">💰</span>
       </div>
       <h3 className="text-base font-semibold mb-1">Thiết lập ngân sách cưới</h3>
       <p className="text-sm text-muted-foreground max-w-xs mb-3">
         Chọn mức ngân sách để xem phân bổ chi phí hợp lý
       </p>
     </div>
   )}
   ```
2. Keep preset buttons always visible (they serve as the CTA)
3. Hide category breakdown when budget is 0 (no value showing 0d everywhere)
4. Estimated addition: ~12 lines, removal of ~10 lines (hidden categories). Net ~122.

### Step 3: Notes panel enhancement (`notes-panel.tsx`)
1. When `notes === ""`, add a visual nudge above the textarea:
   ```tsx
   {!notes && (
     <div className="flex items-center gap-3 py-4 px-3 rounded-lg bg-muted/50 mb-2">
       <span className="text-2xl">📝</span>
       <div>
         <p className="text-sm font-medium">Ghi chú cho ngày cưới</p>
         <p className="text-xs text-muted-foreground">Việc cần làm, ý tưởng, liên hệ...</p>
       </div>
     </div>
   )}
   ```
2. Keep textarea always visible (it IS the primary interaction)
3. Estimated addition: ~10 lines. Total: ~40. Well under limit.

### Step 4: Vendor panel empty state (`vendor-panel.tsx`)
1. Replace line 119-121 `"Chua co vendor nao."` with:
   ```tsx
   {vendors.length === 0 && (
     <div className="flex flex-col items-center py-10 text-center">
       <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
         <span className="text-3xl">🗺️</span>
       </div>
       <h3 className="text-base font-semibold mb-1">Thêm nhà cung cấp đầu tiên</h3>
       <p className="text-sm text-muted-foreground max-w-xs">
         Lưu thông tin nhà hàng, studio, trang trí để so sánh và liên hệ
       </p>
     </div>
   )}
   ```
2. Fix diacritics: the existing `"Chua co vendor nao."` should have been `"Chưa có vendor nào."` — but we're replacing it entirely
3. Estimated change: +12 lines, -1 line. Total: ~136.

## Todo List
- [ ] Add guest panel empty state (below form, hide stats when 0)
- [ ] Add budget panel empty state (above categories, hide categories when budget=0)
- [ ] Add notes panel visual nudge when empty
- [ ] Replace vendor panel minimal text with proper empty state
- [ ] Ensure all Vietnamese text uses proper diacritics
- [ ] Verify all files stay under 200 lines
- [ ] Run `npm run build` to verify no compile errors

## Success Criteria
- Each panel shows a meaningful empty state on first visit
- Empty states use action-oriented headlines (not "No data")
- Vietnamese text has proper diacritics throughout
- Add forms remain accessible (not hidden behind empty state)
- All files under 200 lines

## Conflict Prevention
- This phase ONLY touches: `guest-panel.tsx`, `budget-panel.tsx`, `notes-panel.tsx`, `vendor-panel.tsx`
- These files have zero overlap with Phase 1 layout, Phase 2 tab bar, Phase 4 page panels, Phase 5 card grids

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| `guest-panel.tsx` at 179 lines, additions push over 200 | Medium | Offset by hiding stats bar when 0 guests (~4 lines saved) |
| Empty state blocks access to add form | High | Keep form always visible, empty state is supplementary |
| Budget categories hidden when 0 — user can't see what to budget for | Low | Presets are visible, clicking one reveals categories |

## Next Steps
- After implementation, verify empty states match the visual language of the new navbar (Phase 1)
- Consider adding first-time tooltip hints in a future iteration (YAGNI for now)
