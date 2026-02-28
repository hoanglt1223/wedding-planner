# Research Report: Task Board, Wedding Website, Countdown Features

**Date:** 2026-02-27
**Topics:** Collaborative Task Board, Wedding Website Structure, Smart Countdown+Reminders

---

## Topic 1: Collaborative Task Board (Token-Based Access)

### Findings
- **Token Pattern:** Unique tokens serve as share links for invitation/access without user auth (TasksBoard, Tasks apps use this model)
- **Permission Model:** Role-based access common (assignee, viewer, admin) with comment threads + file sharing
- **Shared List UX:** Real-time collaboration with assignment tracking, due dates, subtasks, visual progress via boards or lists
- **Family Task Delegation:** Morningmate pattern: create tasks in project feeds, assign, set due dates, use subtasks for delegation

### Best Practices
- **Status Workflow:** Pending → In-Progress → Done (simple 3-state for non-technical users)
- **UI Preference:** List view for weddings (scannable, fast); kanban secondary (visual overkill for families)
- **Real-time Updates:** Poll-based or WebSocket; debounced POST for state sync (matches wedding planner arch)
- **Ephemeral Access:** Redis-backed token store with TTL (10-min share link expiry pattern common)

### Recommendation
Implement token endpoint `/api/share` returning ephemeral Redis link + task board snapshot. Fetch tasks client-side; status updates POST to sync endpoint with token validation.

---

## Topic 2: Wedding Website / Public Landing Page

### Wedding Website Sections (General)
Standard structure across Zola/The Knot 2026:
- **Home/Hero** – Couple photo, wedding date, location
- **Story** – How they met
- **Schedule** – Ceremony + Reception timeline
- **RSVP Form** – Guest response collection
- **Registry** – Links to stores (Zola, Amazon, Target)
- **Gallery** – Photos (pre/post-wedding)
- **FAQ/Details** – Venue, accommodation, parking, dietary info
- **Contact** – Email or form

**Vietnamese Additions:** Tea ceremony details, gift customs (hong bao), regional ceremonial highlights, traditional attire specs.

### Slug Generation (Vietnamese Diacritics)
- **NFD Normalization:** `str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')` removes diacritics
- **Libraries:** `@vnodesign/slugify` (lightweight, Vietnamese-aware), `slug` package with locale support
- **Example:** "Hải Đăng" → "hai-dang" (removes circumflex, grave, macron)

### API Design for Public Data
```
GET /api/weddings/:slug
Returns: { couple: {name, photo}, date, venue, schedule[], registries[], story }
Status: Public (no auth) + CDN-friendly (immutable slug + created_at)
```

### OG Meta Tags on Hash Routes (SPA Challenge)
**Core Problem:** Social bots can't render JS; they read static HTML only.

**Solutions (by priority):**
1. **Prerender.io / Netlify Prerender** – Pre-render hash routes to static HTML at build time
2. **Hybrid Clean Routes:** Use `/wedding/:slug` instead of `#/shared/:slug` for public pages (hash routes don't share)
3. **Server-Side Meta Injection:** Vercel Edge Functions inject OG tags before sending to bot-detecting clients
4. **Fallback:** Use React Helmet for clients (won't help social preview, but improves browser history)

**Limitation:** Hash routes fundamentally fail social sharing. Recommend clean URL structure for public wedding pages.

---

## Topic 3: Smart Countdown + Reminders

### Countdown Widget UX
- **Display Format:** Days-only for long-term (6mo+), Days+Hours for final week, show post-wedding message after
- **Save State:** localStorage persists countdown display on revisit
- **Visual:** Large, bold typography; color gradient from green → orange → red as date approaches

### Milestone-Based Reminders (PWA)
- **Trigger Model:** Checklist-driven (tie reminders to WeddingStep completion)
- **Example:** When ceremony step marked pending → reminder "3 weeks: send invitations"
- **Browser Notifications API:** Request permission once; schedule via `new Notification()` + Service Worker for persistent notifications
- **PWA Install:** Prompt on landing page; enables home screen widget + offline access

### Implementation Details
- **Service Worker:** Handle notification clicks (open app, navigate to step)
- **Notification Timing:** Firebase Cloud Messaging (FCM) or simple alert() for desktop (no server push without FCM)
- **Desktop Fallback:** Use browser tab title badge or toast notifications (shadcn Toast component)
- **Storage:** Persist reminder preferences to DB (user_sessions.reminders JSON)

### Recommendation
- Start with toast-based reminders (low friction, no permission)
- Add PWA notifications as v2 (requires browser permission dialog)
- Tie reminders to ceremony steps via checklist progress

---

## Key Decisions for Wedding Planner

| Feature | Approach | Rationale |
|---------|----------|-----------|
| **Task Board Sharing** | Token-based Redis links (10-min TTL) | Simple, no auth overhead, family-friendly |
| **Public Wedding Page** | Clean `/wedding/:slug` (not hash) | Enables OG meta tags for social sharing |
| **Slug Generation** | `@vnodesign/slugify` library | Handles Vietnamese diacritics natively |
| **Countdown Display** | Days+Hours, localStorage persistence | Matches UI/UX of wedding countdown widgets |
| **Reminders** | Toast-based v1, PWA notifications v2 | Progressive enhancement, respects browser permissions |

---

## Unresolved Questions

- Should wedding website allow guest comments/RSVP editing post-submission?
- PWA notification server: Firebase FCM vs simple scheduled notifications in browser tab?
- Does public wedding page need visit analytics? (privacy implications for couples)

---

**Sources:**
- [Shareable Task List Apps 2025](https://www.getduudo.com/blog/top-10-shared-task-list-apps-for-2025)
- [Zola vs The Knot 2026](https://wegic.ai/blog/zola-vs-the-knot-wedding-website.html)
- [SPA OG Meta Tags Solutions](https://dev.to/dmitryame/updating-seo-og-meta-tags-in-single-page-apps-on-the-fly-5bcg)
- [Vietnamese Slug Converter](https://codepen.io/trongthanh/pen/KZQKxr)
- [PWA Notifications & Push API](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Re-engageable_Notifications_Push)
