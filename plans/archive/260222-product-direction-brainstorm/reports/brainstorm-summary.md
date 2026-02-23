# Product Direction Brainstorm Summary

**Date:** 2026-02-22
**Status:** Agreed

## Problem Statement

Vietnamese couples currently plan weddings with pen & paper or Excel spreadsheets. Western tools (The Knot, Zola) don't understand Vietnamese wedding culture — 8-ceremony flow, regional gift customs, zodiac compatibility, lunar calendar. No dedicated Vietnamese wedding planning tool exists.

## Product Vision

**"The Canva for Vietnamese Weddings"** — a culturally-aware, beautiful, shareable wedding planning tool that replaces spreadsheets with an app that *thinks* in Vietnamese wedding traditions.

## Target Users

- **Primary:** Vietnamese couples planning their wedding
- **Secondary:** Professional wedding planners managing multiple clients
- **Future:** Overseas Vietnamese (Việt Kiều) planning weddings in Vietnam

## Competitive Moat

1. **Deep cultural knowledge** — 8-step ceremony flow, regional customs (North/Central/South), taboos
2. **Astrology integration** — Chinese zodiac compatibility, feng shui, lunar calendar (unique hook)
3. **AI with Vietnamese expertise** — ZhipuAI trained on Vietnamese wedding traditions
4. **Privacy-first** — all data stays in browser, no account required (trust factor)
5. **Blue ocean** — no direct competitor in Vietnamese market

## Business Model (Agreed)

- **Phase 1:** Free-first, no paywall. Build audience and validate product-market fit.
- **Phase 2:** Freemium SaaS — free = 1 wedding, paid = unlimited (targets planners managing clients)
- **Payment:** SePay (VietQR) for Vietnamese market

## Architecture Decision

- **Stay client-side** for now (localStorage, JSON export/import)
- Backend (Neon PostgreSQL, Upstash Redis) activated in Phase C for auth/sync/multi-device
- Avoid premature backend complexity; focus on features and UX

## Growth Strategy

- **Distribution:** Social media (Facebook groups, TikTok), word of mouth, vendor partnerships
- **Viral loop:** Shareable invitation links → every invitation = free marketing
- **SEO:** Vietnamese wedding tradition content built into app
- **Killer feature:** 8-step ceremony guide (cultural authority)

## Recommended Phased Approach

### Phase A: Launch-Ready (4-6 weeks)

**Goal:** Ship a polished, mobile-friendly app couples can start using immediately.

**Priorities:**
1. **Mobile experience** — responsive design, touch-friendly. Vietnamese users are 80%+ mobile.
2. **Landing page** — Vietnamese wedding imagery, clear value prop, CTA to start planning
3. **Shareable zodiac card** — screenshot-friendly compatibility result for Zalo/FB sharing
4. **Share via link** — generate read-only URL of wedding plan (short-lived serverless endpoint)
5. **PWA support** — install to home screen, offline access
6. **Polish existing features** — fix UX rough edges, improve onboarding flow

**Success metric:** 100 real couples using the app

### Phase B: Growth Features (6-12 weeks)

**Goal:** Add features that drive viral growth and organic discovery.

**Priorities:**
1. **Digital invitation builder** — beautiful shareable invitation link + guest RSVP form (viral loop)
2. **Vietnamese wedding blog/tips** — SEO content baked into the app
3. **Vendor directory** — partnerships with photographers, venues, MC services
4. **Countdown widget** — shareable wedding countdown for social media profiles
5. **Photo gallery sharing** — share pre-wedding photos via link

**Success metric:** 1000 active users, 50% from organic/referral

### Phase C: Monetization (when 1000+ active users)

**Goal:** Sustainable revenue via freemium SaaS.

**Priorities:**
1. **Auth + cloud sync** — Neon PostgreSQL backend, user accounts, cross-device
2. **Freemium gate** — free = 1 wedding, paid = unlimited + collaboration + priority AI
3. **SePay integration** — VietQR payment for Vietnamese market
4. **Pro accounts** — wedding planner dashboard, client management
5. **Data export** — PDF reports, beautiful printable formats

**Success metric:** 5% conversion rate to paid, break even on infrastructure costs

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low mobile quality kills adoption | High | Prioritize mobile-first in Phase A |
| No viral loop = slow growth | High | Invitation builder in Phase B is key |
| Client-side freemium easily bypassed | Medium | Don't enforce paywall client-side; use convenience (sync, backup) as paid incentive |
| AI costs scale with users | Medium | Rate-limit free tier; cache common prompts |
| Competition copies cultural content | Low | Execution speed + community = moat |

## Key Insights

1. **Content ≠ distribution.** The 8-step guide is great content, but it needs to be wrapped in shareable, screenshot-friendly formats to spread.
2. **Shareability drives growth.** Every invitation sent, every zodiac card screenshotted, every countdown widget shared = free marketing.
3. **Mobile-first is non-negotiable.** Skip desktop polish; Vietnamese market is phone-first.
4. **Don't build backend until you have users.** Premature infrastructure = wasted effort. Validate with localStorage first.
5. **Wedding planners are the paid tier.** Couples use free forever; planners managing 10+ weddings/year will pay for unlimited.

## Next Steps

1. Create detailed implementation plan for Phase A (launch-ready)
2. Audit current mobile experience — identify gaps
3. Design landing page wireframe
4. Implement shareable zodiac card feature
5. Add PWA manifest + service worker
