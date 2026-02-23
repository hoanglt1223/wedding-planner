---
title: "Phase 1: Astrology Expansion — Personal Astrology"
description: "Add personal zodiac profiles, birth date/hour input, AI readings via OpenAI, and migrate data model to v12"
status: completed
priority: P1
effort: 18h
branch: master
tags: [astrology, personal, ai, openai, migration, phase-1]
created: 2026-02-23
completed: 2026-02-23
---

# Phase 1: Astrology Expansion — Personal Astrology

## Summary

Expand astrology page from couple-only analysis to include personal zodiac profiles, yearly forecasts, lucky attributes, and AI-powered readings. Migrate data model from v11 to v12 with full birth date/hour/gender fields.

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Data Model Migration (v11 -> v12) | completed | 2h | [phase-01](./phase-01-data-model-migration.md) |
| 2 | Birth Input Form Upgrade | completed | 2h | [phase-02](./phase-02-birth-input-form.md) |
| 3 | Static Content Data Files | completed | 3h | [phase-03](./phase-03-static-content-data.md) |
| 4 | Personal Tab UI | completed | 3h | [phase-04](./phase-04-personal-tab-ui.md) |
| 5 | AI Reading API Endpoint | completed | 3h | [phase-05](./phase-05-ai-reading-api.md) |
| 6 | AI Reading Frontend | completed | 2h | [phase-06](./phase-06-ai-reading-frontend.md) |
| 7 | Existing Tabs Update | completed | 3h | [phase-07](./phase-07-existing-tabs-update.md) |

## Dependencies

- Phase 1 (migration) must complete before all other phases
- Phase 2 (form) should follow Phase 1
- Phase 3 (data) is independent, can run in parallel with Phase 2
- Phase 4 (personal tab) depends on Phases 2 + 3
- Phase 5 (API) is independent, can run in parallel with Phase 4
- Phase 6 (AI frontend) depends on Phases 4 + 5
- Phase 7 (existing tabs) depends on Phase 1

## Key Decisions

- **Model:** gpt-4o-mini — 16x cheaper than gpt-4o, sufficient Vietnamese quality
- **Cache:** Upstash Redis, TTL 300 days per unique birth data + year combo
- **Rate limit:** 5 req/IP/day via @upstash/ratelimit sliding window
- **Birth hour:** Optional, graceful degradation — basic features without it
- **Gender:** New explicit field, replaces hardcoded "female"/"male" in feng shui

## New Dependencies (npm)

- `openai` — OpenAI SDK v4
- `@upstash/ratelimit` — Rate limiting for AI endpoint

## New Env Vars

- `OPENAI_API_KEY` — OpenAI API key (add to Vercel + .env.local)

## Research Reports

- [Zodiac Personality Content](./research/researcher-01-zodiac-personality-content.md)
- [OpenAI Integration](./research/researcher-02-openai-integration.md)
- [Brainstorm Report](../260223-astrology-expansion-brainstorm/brainstorm-report.md)
