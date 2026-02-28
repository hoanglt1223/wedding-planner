# Phase 2 Feature Brainstorm Summary

**Date:** Feb 27, 2026
**Goal:** Functional gaps + Engagement/retention
**Target Users:** Full ecosystem (couple, family, guests, vendors)

---

## Agreed Features (Priority Order)

### Phase 2.0: Countdown + Smart Reminders
**Effort:** Low (1-2 days) | **Impact:** High engagement

- Visual countdown widget on planning page (days/hours to wedding date)
- Smart reminder system tied to existing checklist
  - 30 days out: confirm vendors, finalize guest list
  - 14 days out: seating chart, timeline review
  - 7 days out: final vendor confirmations, emergency kit
  - 1 day out: rehearsal reminders
- Milestone celebrations (50% checklist done, all vendors booked, etc.)
- Can evolve into push notifications when PWA is added

**Data model:** Minimal — uses existing `info.date` + `checkedItems` + new reminder definitions

---

### Phase 2.1: Wedding Day Timeline
**Effort:** Medium (2-3 days) | **Impact:** High (serves all users)

- Minute-by-minute schedule for the wedding day itself
- Distinct from planning checklist — this is the **event program**
- Each entry: time, event name, location, responsible person(s), notes
- Couple creates/edits, family & guests can view via shared link
- Vietnamese wedding time-sensitive (auspicious hours tie-in)
- Pre-populated templates based on enabled ceremony steps
- Drag-to-reorder or manual time editing

**Data model:** New `TimelineEntry[]` in WeddingState
```ts
interface TimelineEntry {
  id: number;
  time: string;       // "10:00"
  title: string;
  location?: string;
  responsible?: string;
  notes?: string;
  category: "ceremony" | "reception" | "prep" | "other";
}
```

---

### Phase 2.2: Wedding Website (Public Landing Page)
**Effort:** Medium (2-3 days) | **Impact:** Very High (viral growth + professionalism)

- Public shareable page at `#/w/:slug`
- Slug derived from couple names (e.g., `minh-linh`)
- Assembles existing data: couple info, theme, venue, timeline, photos, RSVP link
- Sections: Hero (names + date + countdown), Story, Timeline, Gallery, Venue/Map, RSVP CTA
- Themed using couple's chosen app theme
- Mobile-first responsive design
- SEO: meta tags via serverless function (dynamic OG images would be stretch goal)

**Architecture:**
- New hash route `#/w/:slug` in main.tsx router
- API endpoint `GET /api/website?slug=X` fetches couple's public data from DB
- Couple toggles website on/off in settings, customizes which sections to show
- Public data is a subset of WeddingState (no budget, no vendor details)

**Data model:** New fields in WeddingState or RsvpSettings
```ts
interface WebsiteSettings {
  enabled: boolean;
  slug: string;
  sections: {
    story: boolean;
    timeline: boolean;
    gallery: boolean;
    venue: boolean;
    rsvp: boolean;
  };
  heroImage?: string;
  customMessage?: string;
}
```

---

### Phase 2.3: Gift / Cash Tracker (Phong Bì Manager)
**Effort:** Low-Medium (1-2 days) | **Impact:** Medium (culturally relevant)

- Track cash gifts (phong bì) and physical gifts per guest
- Columns: guest name, amount/item, side (bride/groom), table, thank-you sent
- Summary: total cash, by side, by table group
- Thank-you note tracking (checkbox per guest)
- CSV export for records
- Vietnamese cultural fit: phong bì is standard practice

**Data model:** New `GiftEntry[]` in WeddingState
```ts
interface GiftEntry {
  id: number;
  guestId?: number;    // link to Guest
  guestName: string;
  type: "cash" | "gift";
  amount?: number;
  description?: string;
  side: string;
  thankYouSent: boolean;
}
```

---

### Phase 2.4: Guest Photo Wall
**Effort:** Medium-High (3-4 days) | **Impact:** High (engagement + memories)

- Guests upload photos during/after wedding via unique link or QR code
- QR code at each table → upload page (no app install needed)
- Masonry gallery view for couple + guests
- Moderation: couple can approve/hide photos
- Storage: Vercel Blob (1GB free tier, $0.15/GB/mo beyond)
- Download all as zip (post-wedding)

**Architecture:**
- `POST /api/photos/upload` — multipart form, stores to Vercel Blob
- `GET /api/photos/list?weddingId=X` — paginated photo list
- `PATCH /api/photos/:id` — approve/hide (couple only)
- Guest upload page: `#/photos/:token` (token per table or global)
- Couple view: new "Photos" tab or within Cards panel

**Data model:** New DB table
```sql
CREATE TABLE wedding_photos (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,        -- couple's userId
  uploader_name TEXT,
  blob_url TEXT NOT NULL,
  thumbnail_url TEXT,
  table_group TEXT,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Phase 2.5: Collaborative Task Board
**Effort:** High (4-5 days) | **Impact:** Very High (family engagement)

- Couple creates tasks and assigns to family members
- Each family member gets unique token-based link (reuse RSVP pattern)
- Task properties: title, description, assignee, due date, status, category
- Family members view their tasks and check them off
- Couple sees full board with everyone's progress
- Optional: notification when task is completed

**Architecture:**
- New DB table `wedding_tasks` (server-side, not localStorage)
- API: CRUD for tasks, token-based access for family members
- Couple view: kanban or list view grouped by assignee/status
- Family view: filtered task list for that person
- Route: `#/tasks/:token` for family members

**Data model:**
```sql
CREATE TABLE wedding_tasks (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_name TEXT,
  assignee_token TEXT UNIQUE,
  due_date DATE,
  category TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Implementation order | Countdown → Timeline → Website → Gift → Photo → Tasks | Dependencies flow: timeline feeds into website; complexity escalates gradually |
| Website URL | Hash route `#/w/:slug` | Simplest, works with current SPA architecture, no infra changes |
| Image storage | Vercel Blob | Already on Vercel, simplest integration, 1GB free tier sufficient for MVP |
| Task Board auth | Token-based (RSVP pattern) | Proven pattern, no user accounts needed, low friction for family |

## Architecture Considerations

- **State migration:** WeddingState will need v14 → v15 migration for new fields (timelineEntries, websiteSettings, gifts)
- **DB tables:** 2 new tables needed (wedding_photos, wedding_tasks)
- **API endpoints:** ~8-10 new serverless functions across all features
- **Vercel Hobby plan:** Currently 12 serverless functions; may approach limits. Monitor.
- **Performance:** Photo wall is the heaviest feature (image uploads/downloads). Consider lazy loading + thumbnails.

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Vercel Blob costs at scale | Medium | Set per-wedding photo limits (e.g., 100 photos), compress on upload |
| Serverless function count | Low | Consolidate endpoints (already done for admin) |
| WeddingState bloat | Medium | Timeline + gifts add arrays; keep in localStorage but sync to DB |
| Task Board complexity | High | MVP: simple list view, no real-time. Add polish later |
| Photo moderation burden | Low | Default approved=true, couple hides inappropriate ones |

## Success Metrics

- **Countdown:** Daily active users increase (users open app to check countdown)
- **Timeline:** >50% of users create a timeline with 5+ entries
- **Website:** >30% of users enable public wedding website
- **Gift Tracker:** Used by >40% of users post-wedding
- **Photo Wall:** >10 photos uploaded per wedding on average
- **Task Board:** >3 family members engaged per wedding

## Next Steps

1. Create detailed implementation plan for Phase 2.0 (Countdown + Reminders)
2. Design data migration strategy (v14 → v15)
3. Scaffold API endpoints incrementally per phase
