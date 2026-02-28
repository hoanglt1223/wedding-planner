# Code Review Report - Phase 3: Engagement + Polish

**Date:** 2026-02-28
**Reviewer:** code-reviewer
**Scope:** 7 phases -- PWA, navigation, section pages, home dashboard, budget tracker, onboarding, polish
**Build Status:** PASS (tsc + vite build successful, PWA service worker generated)
**Lint Status:** 2 new errors from Phase 3 files; 18 pre-existing

---

## Overall Assessment

Solid implementation. Well-decomposed component architecture, bilingual data files in place, theme variables used consistently, CSV export has formula injection prevention. The 200-line limit is respected in all files except `header.tsx` (226 lines). State migration from v15 to v16 is correct and backwards-compatible. Zero new API endpoints added (constraint met).

**Key concerns:** A logic bug in the planning section progress calculator always shows 100% once any checklist item is checked. Several i18n translation keys are missing, causing Vietnamese text to display in English mode. The reminders component (`reminders.tsx`) has no i18n support at all.

---

## Critical Issues

None. No security vulnerabilities, no data loss risks, no breaking API changes.

---

## High Priority

### H1. Planning section progress always shows 100% after first check
**File:** `src/lib/progress-calculator.ts` line 69
**Problem:** `const checkTotal = Math.max(checkedCount, 1)` sets `total = checkedCount`, so `percentage = checkedCount/checkedCount = 100%` always. The total should come from `getWeddingSteps()` counting actual checkable items, same as `useWeddingStore.getProgress()`.
**Impact:** Home page section progress bar for "Planning" is misleading. Users see 100% after checking one item.
**Fix:** Import and use the same total-counting logic from `getProgress()` in `use-wedding-store.ts`:
```ts
const allSteps = getWeddingSteps(lang);
let checkTotal = 0;
for (const step of allSteps) {
  for (const ceremony of step.ceremonies) {
    checkTotal += ceremony.steps.filter(s => s.checkable).length;
  }
}
```

### H2. Missing i18n translation keys (budget/expense tracker)
**Files:** `src/components/budget/*.tsx`
**Problem:** These t() keys have no entry in `src/lib/i18n-translations.ts`:
- `"Tổng quan ngân sách"`, `"Ngân sách:"`, `"Vượt ngân sách:"`, `"Còn lại:"`
- `"Danh sách chi phí"`, `"Hạng mục"`, `"Chưa có chi phí nào"`
- `"Cập nhật"`, `"Số tiền (VND)"`

Since `t()` falls back to the Vietnamese key, English-mode users see Vietnamese text for these strings.
**Fix:** Add all missing keys to `src/lib/i18n-translations.ts` with English translations.

### H3. Reminders component has no i18n at all
**File:** `src/components/layout/reminders.tsx`
**Problem:** All strings are hardcoded Vietnamese: `"Dạm ngõ"`, `"Đám hỏi"`, `"Ngày cưới"`, `"Book nhà hàng & studio"`, `"Gửi thiệp mời"`, `"Thử váy & vest"`, `"Xác nhận vendor"`, `"Tổng duyệt"`, `"Chuẩn bị lễ vật"`, `"Nhắc nhở"`, `"Không có nhắc nhở nào."`, `"Hôm nay!"`.
**Impact:** English-mode users see Vietnamese reminder labels and tooltip text.
**Fix:** Accept `lang` prop, use `t()` for all user-facing strings.

---

## Medium Priority

### M1. `header.tsx` exceeds 200-line limit (226 lines)
**File:** `src/components/layout/header.tsx`
**Standard:** Code standards require max 200 lines per file.
**Fix:** Extract `ShareButton` into a separate file `src/components/layout/share-button.tsx` (~30 lines). This brings `header.tsx` below 200.

### M2. Lint error: `setShow(true)` inside useEffect in PWA install prompt
**File:** `src/components/pwa/install-prompt.tsx` line 32
**Problem:** `if (isIos()) setShow(true)` triggers `react-hooks/set-state-in-effect` lint error. The iOS check is synchronous inside the effect body.
**Fix:** Move the iOS check to the `useState` initializer:
```ts
const [show, setShow] = useState(() => {
  if (isStandalone()) return false;
  if (localStorage.getItem("pwa_install_dismissed")) return false;
  return isIos();
});
```
Then only keep the `beforeinstallprompt` listener in the effect.

### M3. Lint error: `as any[]` in vite.config.ts
**File:** `vite.config.ts` line 30
**Problem:** `...(VitePWA({...}) as any[])` triggers `@typescript-eslint/no-explicit-any`.
**Fix:** Use `as Plugin[]` instead:
```ts
import type { Plugin } from "vite";
...(VitePWA({...}) as Plugin[]),
```

### M4. `DEFAULT_STATE.page` is `"planning"` but `DEFAULT_PAGE` is `"home"`
**Files:** `src/data/backgrounds.ts` line 77, `src/data/page-definitions.ts` line 22
**Problem:** After onboarding completes, a fresh user's persisted state has `page: "planning"` from `DEFAULT_STATE`, not `"home"`. The new home dashboard won't be the first thing users see after onboarding.
**Fix:** Change `DEFAULT_STATE.page` to `"home"` to match the new nav architecture, or set `page: "home"` in the `handleComplete` callback of onboarding.

### M5. No delete confirmation for expense removal
**File:** `src/components/budget/expense-list.tsx` line 109
**Problem:** The delete button (`onRemove(entry.id)`) has no confirmation dialog. Accidental taps on mobile will immediately delete expense entries with no undo.
**Fix:** Add a two-tap confirm pattern (similar to the reset button in `footer.tsx`) or a brief "undo" toast.

---

## Low Priority

### L1. `budget-category-row.tsx` exists but not referenced from `category-breakdown.tsx`
Both `budget-category-row.tsx` (70 lines) and `category-breakdown.tsx` (69 lines) render per-category progress bars. The row component may be dead code or was intended to replace inline rendering.
**Action:** Verify if `budget-category-row.tsx` is used anywhere; if not, remove it.

### L2. Quick actions links "tools" page for AI Chat
**File:** `src/components/home/quick-actions.tsx` line 9
The AI Chat quick action navigates to `"tools"` page (which opens the AI tab), but the icon is `"🤖"` which may confuse users expecting the tools section.
**Minor:** Consider using `page: "ai"` for direct navigation, or adjust the icon.

### L3. Duplicate REGIONS constant definitions
**Files:** `src/components/layout/menu-drawer.tsx` lines 18-22, `src/components/onboarding/onboarding-date-region.tsx` lines 4-8
Both define local `REGIONS` arrays. The canonical source is `src/data/regions.ts` (already imported in `region-selector.tsx`).
**Fix:** Import from `src/data/regions.ts` for DRY compliance.

---

## Positive Observations

1. **CSV formula injection prevention** in `expense-tracker.tsx` -- correct regex `/^[=+\-@]/` with single-quote prefix. Handles commas, quotes, and newlines. BOM included for Excel compatibility.
2. **Expense CRUD operations** use defensive fallbacks (`prev.expenseLog || []`) throughout the store, preventing crashes if state is partially migrated.
3. **Component decomposition** is excellent -- budget tracker split across 8 files averaging ~80 lines each. Onboarding wizard split across 6 files.
4. **PWA configuration** is well-structured: manifest external (`manifest: false` in VitePWA), Workbox navigateFallback with API denylist, API caching with NetworkFirst strategy and 5s timeout.
5. **Mobile nav accessibility**: all touch targets meet 44px minimum (`min-h-[44px]`), safe area inset bottom padding applied, backdrop blur for readability.
6. **Theme consistency**: all new components use `var(--theme-*)` CSS variables. No hardcoded colors for interactive/themed elements.
7. **State migration** v15->v16 follows established pattern, uses nullish coalescing for backwards compatibility, and wraps in try-catch for corrupt data.
8. **Page transition animation** via CSS `key={state.page}` forces remount with smooth fade-in.

---

## Metrics

| Metric | Value |
|--------|-------|
| Files reviewed | 45+ |
| New/modified source files | ~40 |
| Build | PASS |
| Lint (Phase 3 specific) | 2 errors (M2, M3) |
| Lint (pre-existing) | 18 errors |
| Files > 200 lines | 1 (`header.tsx` at 226) |
| i18n coverage | ~85% (missing keys in budget, reminders) |
| New API endpoints | 0 (constraint met) |
| Type safety | Strong (strict mode, no new `any` besides vite config) |

---

## Recommended Actions (Priority Order)

1. **Fix** planning progress calculator bug (H1) -- incorrect percentage shown to users
2. **Add** missing i18n translation keys for budget/expense tracker (H2)
3. **Add** i18n support to reminders component (H3)
4. **Extract** ShareButton from header.tsx to meet 200-line limit (M1)
5. **Fix** install-prompt lint error by moving iOS check to initializer (M2)
6. **Update** `DEFAULT_STATE.page` to `"home"` to match new nav (M4)
7. **Add** delete confirmation for expense removal (M5)

---

## Unresolved Questions

1. Is `budget-category-row.tsx` intended to be used? It appears orphaned.
2. Should the Home page be the default after onboarding? Currently lands on Planning due to `DEFAULT_STATE.page`.
