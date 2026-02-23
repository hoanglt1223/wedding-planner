# Phase 1: Foundation — Data Resolver & Locale Utils

## Context
- Parent: [plan.md](plan.md)
- Docs: `docs/code-standards.md`, `docs/system-architecture.md`
- Brainstorm: `plans/260223-english-mode-data-brainstorm/brainstorm-summary.md`

## Overview
- **Priority:** P0 — Blocks all other phases
- **Status:** Completed
- **Description:** Create data resolver barrel, locale helper, expand i18n translations
- **Completed:** 2026-02-23

## Key Insights
- Current i18n.ts has only 6 nav label translations
- `lang` prop only threaded to Navbar and Footer — all other components need it
- All `vi-VN` locale formatting hardcoded in 8+ files
- `format.ts` exists with `formatMoney()` using `vi-VN` — add `getLocale()` here

## Requirements
### Functional
- `getLocale(lang)` returns `"en-US"` or `"vi-VN"`
- `resolve-data.ts` exports lang-aware getters for all data: steps, budget, prompts, astrology, ideas
- i18n.ts expanded with all UI strings from components (~80+ keys)

### Non-Functional
- No type changes to existing interfaces
- Max 200 lines per file
- Existing Vietnamese behavior unchanged when lang="vi"

## Architecture
```
src/lib/format.ts      — Add getLocale(lang) + getCurrencySymbol(lang)
src/lib/i18n.ts        — Expand TRANSLATIONS map (~80+ keys)
src/data/resolve-data.ts — Barrel: conditional imports for all data
```

## Related Code Files
### Modify
- `src/lib/format.ts` — Add `getLocale()` and `getCurrencySymbol()`
- `src/lib/i18n.ts` — Expand translations map

### Create
- `src/data/resolve-data.ts` — Data resolver barrel

## Implementation Steps

### 1. Update `src/lib/format.ts`
Add locale helper functions:
```typescript
export function getLocale(lang: string): string {
  return lang === "en" ? "en-US" : "vi-VN";
}

export function getCurrencySymbol(lang: string): string {
  return lang === "en" ? "VND " : "";
}

// Update existing formatMoney to accept optional lang parameter
export function formatMoney(n: number, lang = "vi"): string {
  const locale = getLocale(lang);
  return new Intl.NumberFormat(locale).format(n) + (lang === "vi" ? "đ" : " VND");
}
```

### 2. Create `src/data/resolve-data.ts`
Barrel file with conditional imports. Pattern:
```typescript
import { WEDDING_STEPS } from "./wedding-steps";
import { WEDDING_STEPS_EN } from "./wedding-steps.en";
import { BUDGET_CATEGORIES } from "./budget-categories";
import { BUDGET_CATEGORIES_EN } from "./budget-categories.en";
// ... all data imports

export function getWeddingSteps(lang: string) {
  return lang === "en" ? WEDDING_STEPS_EN : WEDDING_STEPS;
}
export function getBudgetCategories(lang: string) { ... }
export function getAiPrompts(lang: string) { ... }
export function getZodiacProfiles(lang: string) { ... }
export function getElementProfiles(lang: string) { ... }
export function getYearlyForecasts(lang: string) { ... }
export function getIdeas(lang: string) { ... }
```

Note: Also create `src/data/wedding-steps.en.ts` aggregator (parallel to `wedding-steps.ts`) that imports all individual step EN files.

### 3. Expand `src/lib/i18n.ts`
Add all UI string translations. Organize by component area. Key categories:

**Onboarding (~15 keys):**
- "Kế Hoạch Đám Cưới" → "Wedding Planner"
- "Nhập thông tin cơ bản để bắt đầu" → "Enter basic info to get started"
- "Tên cô dâu" → "Bride's name"
- "Tên chú rể" → "Groom's name"
- "Ngày cưới (tùy chọn)" → "Wedding date (optional)"
- "Tiếp Tục →" → "Continue →"
- "Bắt Đầu Lên Kế Hoạch! 🎉" → "Start Planning! 🎉"
- "Xem thử với dữ liệu mẫu →" → "Try with sample data →"
- etc.

**Budget Panel (~12 keys):**
- "💰 Ngân Sách" → "💰 Budget"
- "Thiết lập ngân sách cưới" → "Set wedding budget"
- "Tổng:" → "Total:"
- "Còn:" → "Remaining:"
- "Đã chi:" → "Spent:"
- etc.

**Guest Panel (~15 keys):**
- "👥 Khách Mời" → "👥 Guests"
- "Trai:" → "Groom:"
- "Gái:" → "Bride:"
- "Họ tên" → "Full name"
- "SĐT" → "Phone"
- etc.

**AI Panel (~10 keys):**
- "🤖 AI Hỗ Trợ" → "🤖 AI Assistant"
- "⚡ Gợi Ý Nhanh" → "⚡ Quick Suggestions"
- "✍️ Hỏi Tùy Chỉnh" → "✍️ Custom Question"
- "Nhập câu hỏi..." → "Type your question..."
- "🚀 Gửi" → "🚀 Send"
- "⏳ Đang xử lý..." → "⏳ Processing..."
- etc.

**Print Panel (~15 keys):**
- "SỔ TAY ĐÁM CƯỚI" → "WEDDING HANDBOOK"
- "In Sổ Tay" → "Print Handbook"
- "Ý nghĩa" → "Meaning"
- "BẮT BUỘC" → "REQUIRED"
- "TÙY CHỌN" → "OPTIONAL"
- etc.

**Astrology Page (~10 keys):**
- "🔮 Tử Vi Khoa Học" → "🔮 Vietnamese Astrology"
- Tab labels: "💑 Hợp Tuổi" → "💑 Compatibility"
- etc.

**Event Timeline (~5 keys):**
- "Đã qua" → "Passed"
- "Hôm nay!" → "Today!"
- "Còn X ngày" → "X days left"
- etc.

**Landing Page (~6 keys):**
- "Kế Hoạch Đám Cưới" → "Wedding Planner"
- "Miễn phí 100%" → "100% Free"
- "Bắt Đầu Ngay →" → "Get Started →"
- etc.

**Misc (~10 keys):**
- Various buttons, tooltips, empty states

If i18n.ts exceeds 200 lines, split into `src/lib/i18n-translations.ts` (data) and `src/lib/i18n.ts` (functions).

## Todo
- [x] Add `getLocale()` and `getCurrencySymbol()` to format.ts
- [x] Update `formatMoney()` to accept optional lang param
- [x] Create `src/data/resolve-data.ts` barrel with all getters
- [x] Create `src/data/wedding-steps.en.ts` aggregator
- [x] Expand i18n.ts with ~80+ translation keys
- [x] Split i18n if exceeds 200 lines
- [x] Verify TypeScript compilation passes

## Success Criteria
- `getLocale("en")` returns `"en-US"`, `getLocale("vi")` returns `"vi-VN"`
- All data resolver functions exist and return correct type
- `t("any-key", "en")` returns English string for all defined keys
- `npm run build` passes without errors

## Risk Assessment
- i18n.ts may exceed 200 lines → split into data + function files
- resolve-data.ts imports will fail until Phase 2-4 files created → use try/catch or create stub exports

## Security Considerations
- No security impact — pure data/utility changes

## Next Steps
- Phase 2-4: Create all .en.ts data files (can proceed in parallel)
- Phase 5: Wire resolve-data into components
