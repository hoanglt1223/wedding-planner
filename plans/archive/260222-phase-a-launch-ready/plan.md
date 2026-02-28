---
title: "Phase A: Launch-Ready Vietnamese Wedding Planner"
description: "Mobile fixes, PWA, SEO, landing page, onboarding, zodiac card sharing, and share-via-link to reach 100 real couples"
status: pending
priority: P1
effort: 22h
branch: master
tags: [launch, mobile, pwa, seo, landing, onboarding, sharing]
created: 2026-02-22
---

# Phase A: Launch-Ready

**Goal:** Transform the working prototype into a launch-ready app optimized for Vietnamese couples on mobile. Target: 100 real users via social sharing.

**Strategy:** Free-first, no paywall, no auth. Client-side localStorage. Distribute via Zalo/Facebook sharing and word-of-mouth.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 01 | Mobile Responsive Fixes | 2h | pending | [phase-01](./phase-01-mobile-responsive-fixes.md) |
| 02 | PWA Setup | 3h | pending | [phase-02](./phase-02-pwa-setup.md) |
| 03 | Meta Tags & SEO Foundation | 2h | pending | [phase-03](./phase-03-meta-tags-seo.md) |
| 04 | Landing Page | 4h | pending | [phase-04](./phase-04-landing-page.md) |
| 05 | Onboarding Flow | 4h | pending | [phase-05](./phase-05-onboarding-flow.md) |
| 06 | Shareable Zodiac Card | 4h | pending | [phase-06](./phase-06-shareable-zodiac-card.md) |
| 07 | Share-via-Link | 3h | pending | [phase-07](./phase-07-share-via-link.md) |

## Dependencies

```
Phase 01 (mobile) ──> Phase 02 (PWA) ──> Phase 03 (SEO)
                                              │
Phase 04 (landing) ──> Phase 05 (onboarding) ─┘
Phase 06 (zodiac card) ── standalone
Phase 07 (share link) ── needs Phase 03 for OG tags
```

## Key Research References

- [PWA + Sharing Research](./research/researcher-01-pwa-and-sharing.md)
- [Mobile UX + Landing Research](./research/researcher-02-mobile-ux-and-landing.md)
- [Mobile Audit Scout](./scout/scout-01-mobile-audit.md)

## Critical Constraints

- Max 200 lines/file. Split new components as needed.
- English variable names, Vietnamese UI strings with diacritics.
- No new npm dependencies unless strictly required (html2canvas, vite-plugin-pwa, lz-string).
- All state stays in localStorage via `useWeddingStore` (STORAGE_KEY: `wp_v11`).
- Deploy target: Vercel (HTTPS, edge CDN).

## Success Metric

100 real Vietnamese couples actively using the app within 4 weeks of launch.
