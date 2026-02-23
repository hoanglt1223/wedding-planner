---
title: "Full English Mode Data & Wiring"
description: "Create ~15 .en.ts data files, expand i18n, wire lang prop, fix locale formatting for complete English mode"
status: completed
priority: P2
effort: 6h
branch: master
tags: [i18n, english, translation, data]
created: 2026-02-23
completed: 2026-02-23
---

# Full English Mode — Implementation Plan

## Context
- Brainstorm: `plans/260223-english-mode-data-brainstorm/brainstorm-summary.md`
- Audience: Viet Kieu couples (overseas Vietnamese, prefer English UI)
- Architecture: Dual `.en.ts` data files, conditional imports based on `state.lang`
- Content style: Culturally annotated with preserved Vietnamese terms in parentheses

## Phases

| # | Phase | Files | Status | Est. |
|---|-------|-------|--------|------|
| 1 | [Foundation](phase-01-foundation-resolver-utils.md) | 3 modified | Completed | 30m |
| 2 | [Wedding Steps EN Data](phase-02-wedding-steps-english.md) | 11 new | Completed | 1.5h |
| 3 | [Astrology EN Data](phase-03-astrology-english.md) | 3 new | Completed | 1h |
| 4 | [Other Data Files](phase-04-other-data-english.md) | 3 new | Completed | 30m |
| 5 | [Component Wiring](phase-05-component-wiring.md) | ~25 modified | Completed | 1.5h |
| 6 | [API English Support](phase-06-api-english.md) | 2 modified | Completed | 1h |

## Dependencies
- Phase 1 must complete first (resolver + utils used by all others)
- Phases 2-4 are independent data files (parallelizable)
- Phase 5 depends on Phases 1-4 (wires data into components)
- Phase 6 independent of Phases 2-5

## Key Files
- `src/data/resolve-data.ts` — New barrel file for lang-aware data getters
- `src/lib/format.ts` — Add `getLocale()` helper
- `src/lib/i18n.ts` — Expand from 6 to ~80+ translation keys
- `src/data/*.en.ts` — 15 new English data files
- `src/App.tsx` — Thread lang to all child components
- `api/ai/chat.ts` + `api/astrology-reading.ts` — Lang-aware system prompts

## Total: ~15 new files + ~25 modified files
