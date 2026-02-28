# Phase 3 Brainstorm: Engagement + Polish

## Problem Statement

App has 10+ features with inconsistent navigation (header icons + tabs + page routing). Adding more features without fixing nav compounds confusion. Vietnamese couples on phones need instant access to the right tool. Current UX feels like "desktop squeezed into mobile."

## Goals

1. **Increase engagement** — daily return visits, deeper feature usage
2. **Polish UX** — mobile-first redesign, professional feel, clear information architecture

## Constraints

- Vercel Hobby plan: 8/12 endpoints used, no cron, 100GB bandwidth
- Solo developer: minimize ops overhead, favor frontend-only features
- Vietnamese market first: VND currency, cultural relevance
- No paid services: free tiers only (Neon, Upstash, Vercel Blob, ZhipuAI)

---

## Agreed Strategy: 3 Phases

### Phase 3A: Navigation Redesign + PWA Shell

**Priority:** CRITICAL — foundation for all subsequent features

**Navigation Structure:**
```
Bottom Nav (mobile): Home | Planning | Guests | Tools | Menu
```

| Section | Contains | Notes |
|---------|----------|-------|
| **Home** | Dashboard: countdown, progress ring, quick actions, recent activity, daily tip | New page, replaces current planning page as default |
| **Planning** | Checklist (ceremony steps) · Timeline · Budget | Tabbed within, budget is new feature |
| **Guests** | RSVP dashboard · Photo wall · Gift tracker | Group all guest-facing features |
| **Tools** | AI chat · Astrology · Task board | Utility features |
| **Menu** | Website settings · Themes · Language · Region · Handbook · Cards · About | Overflow/settings drawer |

**PWA Requirements:**
- Web app manifest with Vietnamese app name and icons
- Service worker: cache-first for static assets, network-first for API
- iOS install prompt (already exists, improve it)
- Offline shell showing cached data with "offline" badge
- Add to home screen support

**Implementation Notes:**
- Zero new endpoints. Pure frontend restructure.
- Hash routes stay the same (no breaking changes)
- Current header shrinks to minimal bar (app name + theme color)
- Desktop: bottom nav becomes left sidebar
- Touch targets ≥ 44px everywhere
- Transitions between sections (slide left/right)

**Estimated scope:** ~20 files modified, ~10 new components

---

### Phase 3B: Budget & Expense Tracker

**Priority:** HIGH — #1 engagement driver in wedding planners globally

**Slots into:** Planning tab (3rd sub-tab after Checklist and Timeline)

**Data Model:**
- Extend `WeddingState` with `expenseLog: ExpenseEntry[]`
- `ExpenseEntry`: { id, category, description, amount, vendorName, date, paid, receiptUrl? }
- State migration v15 → v16
- Reuse existing `budget`, `budgetOverrides`, `expenses` fields

**UI Components:**
1. **Budget Overview** — total budget vs. spent, remaining, progress bar
2. **Category Breakdown** — per-ceremony-step budgets with spent/remaining
3. **Expense Log** — sortable list with add/edit/delete
4. **Quick Add** — floating action button for fast entry
5. **Summary Cards** — total paid / unpaid / overbudget alerts

**Vietnamese Context:**
- Default categories matching ceremony steps (Lễ Dạm Ngõ, Lễ Ăn Hỏi, etc.)
- VND formatting with proper thousands separators
- Common Vietnamese wedding expense presets (photography, catering, venue, ao dai, etc.)

**Implementation Notes:**
- Zero new endpoints. All localStorage.
- CSV export reuses gift-csv-export pattern
- No charts in v1 (YAGNI) — just numbers and progress bars

**Estimated scope:** ~8 new files, ~2 modified

---

### Phase 3C: Onboarding + Progress Gamification

**Priority:** MEDIUM — reduces bounce, increases completion

**Onboarding Wizard (first visit):**
1. Welcome screen (app intro, Vietnamese wedding illustration)
2. Couple names input
3. Wedding date picker
4. Region selector (North/Central/South)
5. Budget input (optional, with Vietnamese presets)
6. "Get Started!" → land on Home dashboard

**Progress System:**
- Overall % across all sections (weighted)
- Per-section completion rings on Home dashboard
- Milestone badges (stored in state):
  - "Đặt Ngày" — wedding date set
  - "Danh Sách Khách" — 10+ guests added
  - "Ngân Sách" — budget configured
  - "Phong Bì" — first gift logged
  - "Trang Web" — website published
  - "100 Ngày" — 100 days to wedding
  - "Hoàn Thành" — all checklist items done
- Daily tip carousel (content from existing handbook data)

**Implementation Notes:**
- Zero new endpoints
- Onboarding state: `onboardingComplete: boolean` already exists in WeddingState
- Badge definitions as static data file
- Tips generated from existing wedding-steps content

**Estimated scope:** ~10 new files, ~3 modified

---

## What Was Cut

| Feature | Reason |
|---------|--------|
| Seating chart | Drag-and-drop complexity too high for solo dev, low engagement vs. effort |
| Real-time collab | Needs WebSockets, Vercel doesn't support on Hobby |
| Email/SMS notifications | Costs money, needs cron (not on Hobby) |
| PDF export | Low engagement, complex rendering |
| Vendor marketplace | Way too ambitious for solo |

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Nav redesign breaks muscle memory | Med | Keep hash routes, add transition animation to guide eyes |
| PWA SW caching stale data | High | Network-first for /api/*, cache-first for static only |
| Budget scope creep | Med | MVP: log + totals only. No charts, no receipt photos in v1 |
| Too much work for solo dev | High | Each phase independently shippable. Ship 3A, validate, then 3B |

## Dependency Graph

```
3A (Nav + PWA)  ←— MUST be first
    ↓
3B (Budget)  ←— slots into Planning tab from 3A
3C (Onboarding) ←— uses Home dashboard from 3A
```

3B and 3C are independent of each other, can be done in parallel or either order after 3A.

## Success Metrics

- **3A:** Time-to-first-action on mobile < 3 taps, Lighthouse PWA score > 90
- **3B:** Budget page becomes top-2 visited page (measure via existing analytics)
- **3C:** Onboarding completion rate > 70%, daily return rate increase
