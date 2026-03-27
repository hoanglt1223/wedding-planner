# Phase 6: i18n Support

## Context
- [i18n.ts](../../src/lib/i18n.ts) — `t(key, lang)` lookup
- [i18n-translations.ts](../../src/lib/i18n-translations.ts) — translation dictionary
- All existing tabs use inline `lang === "en" ? ... : ...` for small strings, `t()` for tab labels

## Overview
- **Priority:** P2
- **Status:** pending
- Add English translations for all user-facing strings in the new tab

## Requirements

### Functional
- Tab label: "📅 Ngay Cuoi" / "📅 Wedding Date"
- All section headers, legends, warnings bilingual
- Gio Hoang Dao hour labels in both languages
- Day quality descriptions bilingual
- Recommendation sentences bilingual

### Non-functional
- Follow existing pattern: inline ternary for component-local strings, `t()` for shared strings

## Related Code Files
- **Modify:** `src/lib/i18n-translations.ts` — add entries for tab label
- **Modify:** All Phase 3-4 components — ensure `lang` prop threaded and used

## Implementation Steps

1. Add translation entry: `"📅 Ngay Cuoi": { vi: "📅 Ngay Cuoi", en: "📅 Wedding Date" }`
2. In each component, use `lang === "en" ? englishText : vietnameseText` pattern for:
   - Calendar weekday headers (already T2-CN for Vietnamese; Mon-Sun for English)
   - Month names
   - Legend labels
   - Section headers in detail panel
   - Warning messages
   - Hour period labels
   - Recommendation text
3. Pass `lang` from tab-wedding-date.tsx down to calendar and detail sub-components

## Todo
- [ ] Add tab label to i18n-translations.ts
- [ ] Bilingual weekday/month headers in calendar
- [ ] Bilingual legend labels
- [ ] Bilingual detail panel sections
- [ ] Bilingual Gio Hoang Dao labels
- [ ] Bilingual warning messages

## Success Criteria
- Switching lang to "en" renders all strings in English
- No hardcoded Vietnamese strings without English fallback
- Tab label translates via `t()` function

## Risk Assessment
- **Low** — purely additive string work
- Main risk: missing a string — do a final grep for Vietnamese chars in new files
