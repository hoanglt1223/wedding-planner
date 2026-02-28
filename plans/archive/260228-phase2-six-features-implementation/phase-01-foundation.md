---
phase: "01"
title: "Foundation — Shared Infrastructure"
status: complete
priority: P1
effort: 1-2 days
completed: 2026-02-28
---

# Phase 01: Foundation — Shared Infrastructure

## Context Links
- [plan.md](./plan.md)
- [brainstorm-summary.md](../260227-phase2-features-brainstorm/brainstorm-summary.md)
- [Current types](../../src/types/wedding.ts)
- [Current store](../../src/hooks/use-wedding-store.ts)
- [Current schema](../../src/db/schema.ts)
- [Current migration](../../src/lib/migrate-state.ts)

## Parallelization Info
- **Group:** Sequential (must complete before all others)
- **Dependencies:** None
- **Blocks:** Phases 02, 03, 04, 05, 06, 07

## Overview
Foundation phase modifies ALL shared files that multiple features touch. After this phase, Phases 02-07 can run fully in parallel because they only create new files in their own directories.

---

## 1. New Types (`src/types/wedding.ts`)

Add these interfaces **after** the existing `RsvpSettings` interface:

```typescript
// --- Phase 2 types ---

export interface TimelineEntry {
  id: number;
  time: string;           // "HH:mm" format, e.g. "10:00"
  title: string;
  location?: string;
  responsible?: string;
  notes?: string;
  category: "ceremony" | "reception" | "prep" | "other";
}

export interface GiftEntry {
  id: number;
  guestId?: number;       // links to Guest.id
  guestName: string;
  type: "cash" | "gift";
  amount?: number;        // VND for cash, estimated value for gifts
  description?: string;
  side: "groom" | "bride" | "other";
  tableGroup?: string;
  thankYouSent: boolean;
}

export interface WebsiteSettings {
  enabled: boolean;
  slug: string;           // URL slug, e.g. "minh-linh"
  sections: {
    story: boolean;
    timeline: boolean;
    gallery: boolean;
    venue: boolean;
    rsvp: boolean;
  };
  heroImage?: string;     // URL to hero image
  customMessage?: string; // Custom welcome text
  storyText?: string;     // "Our story" text for website
}

export interface PhotoWallSettings {
  enabled: boolean;
  maxPhotos: number;       // per-wedding limit, default 100
  autoApprove: boolean;    // default true
}

export interface TaskBoardSettings {
  enabled: boolean;
  categories: string[];    // e.g. ["Trang trí", "Lễ vật", "Hậu cần"]
}

export interface ReminderPreference {
  id: string;              // matches reminder definition id
  dismissed: boolean;
}
```

Update `WeddingState` interface — add after `rsvpSettings`:

```typescript
export interface WeddingState {
  // ... existing fields ...
  rsvpSettings: RsvpSettings;

  // Phase 2 additions
  timelineEntries: TimelineEntry[];
  timelineIdCounter: number;
  gifts: GiftEntry[];
  giftIdCounter: number;
  websiteSettings: WebsiteSettings;
  photoWallSettings: PhotoWallSettings;
  taskBoardSettings: TaskBoardSettings;
  dismissedReminders: string[];  // array of reminder IDs
}
```

---

## 2. DEFAULT_STATE Update (`src/data/backgrounds.ts`)

Add new fields to `DEFAULT_STATE`:

```typescript
export const DEFAULT_STATE: WeddingState = {
  // ... all existing fields stay unchanged ...

  // Phase 2 additions
  timelineEntries: [],
  timelineIdCounter: 0,
  gifts: [],
  giftIdCounter: 0,
  websiteSettings: {
    enabled: false,
    slug: "",
    sections: { story: true, timeline: true, gallery: true, venue: true, rsvp: true },
    heroImage: "",
    customMessage: "",
    storyText: "",
  },
  photoWallSettings: {
    enabled: false,
    maxPhotos: 100,
    autoApprove: true,
  },
  taskBoardSettings: {
    enabled: false,
    categories: [],
  },
  dismissedReminders: [],
};
```

---

## 3. State Migration (`src/lib/migrate-state.ts`)

Add `V15_KEY = "wp_v15"` and v14->v15 migration:

```typescript
const V15_KEY = "wp_v15";

export function migrateState(): void {
  if (localStorage.getItem(V15_KEY)) return;

  // v14->v15: add Phase 2 fields
  const v14Raw = localStorage.getItem(V14_KEY);
  if (v14Raw) {
    try {
      const v14 = JSON.parse(v14Raw);
      const v15 = {
        ...v14,
        timelineEntries: v14.timelineEntries ?? [],
        timelineIdCounter: v14.timelineIdCounter ?? 0,
        gifts: v14.gifts ?? [],
        giftIdCounter: v14.giftIdCounter ?? 0,
        websiteSettings: v14.websiteSettings ?? {
          enabled: false, slug: "", sections: { story: true, timeline: true, gallery: true, venue: true, rsvp: true },
          heroImage: "", customMessage: "", storyText: "",
        },
        photoWallSettings: v14.photoWallSettings ?? { enabled: false, maxPhotos: 100, autoApprove: true },
        taskBoardSettings: v14.taskBoardSettings ?? { enabled: false, categories: [] },
        dismissedReminders: v14.dismissedReminders ?? [],
      };
      localStorage.setItem(V15_KEY, JSON.stringify(v15));
    } catch { /* corrupt */ }
    return;
  }

  // ... rest of existing migration chain unchanged ...
}
```

Update `STORAGE_KEY` in `src/hooks/use-wedding-store.ts` from `"wp_v14"` to `"wp_v15"`.

---

## 4. Store Methods (`src/hooks/use-wedding-store.ts`)

Add these new callback methods inside `useWeddingStore()`:

### Timeline methods
```typescript
const addTimelineEntry = useCallback((entry: Omit<TimelineEntry, "id">) => {
  setState((prev) => ({
    ...prev,
    timelineIdCounter: prev.timelineIdCounter + 1,
    timelineEntries: [...prev.timelineEntries, { ...entry, id: prev.timelineIdCounter + 1 }],
  }));
}, [setState]);

const updateTimelineEntry = useCallback((id: number, updates: Partial<TimelineEntry>) => {
  setState((prev) => ({
    ...prev,
    timelineEntries: prev.timelineEntries.map((e) => e.id === id ? { ...e, ...updates } : e),
  }));
}, [setState]);

const removeTimelineEntry = useCallback((id: number) => {
  setState((prev) => ({
    ...prev,
    timelineEntries: prev.timelineEntries.filter((e) => e.id !== id),
  }));
}, [setState]);

const setTimelineEntries = useCallback((entries: TimelineEntry[]) => {
  setState((prev) => ({ ...prev, timelineEntries: entries }));
}, [setState]);
```

### Gift methods
```typescript
const addGift = useCallback((gift: Omit<GiftEntry, "id">) => {
  setState((prev) => ({
    ...prev,
    giftIdCounter: prev.giftIdCounter + 1,
    gifts: [...prev.gifts, { ...gift, id: prev.giftIdCounter + 1 }],
  }));
}, [setState]);

const updateGift = useCallback((id: number, updates: Partial<GiftEntry>) => {
  setState((prev) => ({
    ...prev,
    gifts: prev.gifts.map((g) => g.id === id ? { ...g, ...updates } : g),
  }));
}, [setState]);

const removeGift = useCallback((id: number) => {
  setState((prev) => ({
    ...prev,
    gifts: prev.gifts.filter((g) => g.id !== id),
  }));
}, [setState]);
```

### Website methods
```typescript
const setWebsiteSettings = useCallback((settings: Partial<WebsiteSettings>) => {
  setState((prev) => ({
    ...prev,
    websiteSettings: { ...(prev.websiteSettings || DEFAULT_STATE.websiteSettings), ...settings },
  }));
}, [setState]);
```

### Photo Wall methods
```typescript
const setPhotoWallSettings = useCallback((settings: Partial<PhotoWallSettings>) => {
  setState((prev) => ({
    ...prev,
    photoWallSettings: { ...(prev.photoWallSettings || DEFAULT_STATE.photoWallSettings), ...settings },
  }));
}, [setState]);
```

### Task Board methods
```typescript
const setTaskBoardSettings = useCallback((settings: Partial<TaskBoardSettings>) => {
  setState((prev) => ({
    ...prev,
    taskBoardSettings: { ...(prev.taskBoardSettings || DEFAULT_STATE.taskBoardSettings), ...settings },
  }));
}, [setState]);
```

### Reminder methods
```typescript
const dismissReminder = useCallback((reminderId: string) => {
  setState((prev) => ({
    ...prev,
    dismissedReminders: [...(prev.dismissedReminders || []), reminderId],
  }));
}, [setState]);
```

**Return object** — add all new methods to the return statement:

```typescript
return {
  // ... all existing ...
  addTimelineEntry, updateTimelineEntry, removeTimelineEntry, setTimelineEntries,
  addGift, updateGift, removeGift,
  setWebsiteSettings,
  setPhotoWallSettings,
  setTaskBoardSettings,
  dismissReminder,
};
```

---

## 5. DB Schema (`src/db/schema.ts`)

Add two new tables:

```typescript
export const weddingPhotos = pgTable("wedding_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  uploaderName: text("uploader_name"),
  blobUrl: text("blob_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  tableGroup: text("table_group"),
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("wedding_photos_user_id_idx").on(table.userId),
]);

export const weddingTasks = pgTable("wedding_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  assigneeName: text("assignee_name"),
  assigneeToken: text("assignee_token").unique(),
  dueDate: text("due_date"),
  category: text("category"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("wedding_tasks_user_id_idx").on(table.userId),
  index("wedding_tasks_assignee_token_idx").on(table.assigneeToken),
]);
```

After adding schema, run:
```bash
npm run db:generate
npm run db:migrate
```

---

## 6. Routes (`src/main.tsx`)

Add lazy imports and route cases:

```typescript
const WeddingWebsitePage = lazy(() => import('./pages/wedding-website-page.tsx'));
const PhotoUploadPage = lazy(() => import('./pages/photo-upload-page.tsx'));
const TaskLandingPage = lazy(() => import('./pages/task-landing-page.tsx'));
```

Add route matching in `Root()` function before the `return <LandingPage />`:

```typescript
if (hash.startsWith('#/w/')) {
  const slug = hash.slice('#/w/'.length).split('/')[0];
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WeddingWebsitePage slug={slug} />
    </Suspense>
  );
}
if (hash.startsWith('#/photos/')) {
  const photoToken = hash.slice('#/photos/'.length).split('/')[0];
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhotoUploadPage token={photoToken} />
    </Suspense>
  );
}
if (hash.startsWith('#/tasks/')) {
  const taskToken = hash.slice('#/tasks/'.length).split('/')[0];
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskLandingPage token={taskToken} />
    </Suspense>
  );
}
```

---

## 7. Planning Page Integration

### EXTRA_TABS (`src/data/backgrounds.ts`)

Add new tabs for timeline and gifts:

```typescript
export const EXTRA_TABS = [
  "💰 Chi Phí",
  "👥 Khách Mời",
  "📝 Ghi Chú",
  "🗺️ Vendor",
  "📅 Ngày Tốt",
  "⏱️ Lịch Trình",   // NEW — timeline
  "🎁 Phong Bì",     // NEW — gifts
] as const;
```

### PanelRouter (`src/components/wedding/panel-router.tsx`)

Add lazy imports at top:

```typescript
import { lazy, Suspense } from "react";
const TimelinePage = lazy(() => import("@/pages/timeline-page"));
const GiftPage = lazy(() => import("@/pages/gift-page"));
```

Add two new tab cases after the calendar tab (stepCount + 4):

```typescript
if (tab === stepCount + 5) {
  return (
    <Suspense fallback={null}>
      <TimelinePage state={state} store={store} />
    </Suspense>
  );
}

if (tab === stepCount + 6) {
  return (
    <Suspense fallback={null}>
      <GiftPage state={state} store={store} />
    </Suspense>
  );
}
```

### PageRouter (`src/pages/page-router.tsx`)

No changes needed — timeline and gifts live inside the planning page as sub-tabs, not as separate top-level pages.

---

## 8. Dependencies (`package.json`)

Add:
```json
{
  "dependencies": {
    "@vercel/blob": "^0.27.0"
  }
}
```

Run: `npm install @vercel/blob`

---

## 9. i18n Translations (`src/lib/i18n-translations.ts`)

Add ALL keys needed by ALL 6 features:

```typescript
// Nav labels for new pages
"📋 Công Việc": { vi: "📋 Công Việc", en: "📋 Tasks" },
"🌐 Website": { vi: "🌐 Website", en: "🌐 Website" },

// Countdown & Reminders
"⏱️ Đếm Ngược": { vi: "⏱️ Đếm Ngược", en: "⏱️ Countdown" },
"ngày": { vi: "ngày", en: "days" },
"giờ": { vi: "giờ", en: "hours" },
"phút": { vi: "phút", en: "minutes" },
"giây": { vi: "giây", en: "seconds" },
"Đám cưới đã qua!": { vi: "Đám cưới đã qua!", en: "Wedding has passed!" },
"Chưa chọn ngày cưới": { vi: "Chưa chọn ngày cưới", en: "No wedding date set" },
"Nhắc nhở": { vi: "Nhắc nhở", en: "Reminders" },
"Bỏ qua": { vi: "Bỏ qua", en: "Dismiss" },
"Mốc quan trọng": { vi: "Mốc quan trọng", en: "Milestones" },

// Timeline
"⏱️ Lịch Trình": { vi: "⏱️ Lịch Trình", en: "⏱️ Timeline" },
"Lịch trình ngày cưới": { vi: "Lịch trình ngày cưới", en: "Wedding Day Timeline" },
"Thêm mục": { vi: "Thêm mục", en: "Add Entry" },
"Tạo từ mẫu": { vi: "Tạo từ mẫu", en: "Generate from Template" },
"Chưa có lịch trình": { vi: "Chưa có lịch trình", en: "No timeline entries yet" },
"Nghi lễ": { vi: "Nghi lễ", en: "Ceremony" },
"Tiệc": { vi: "Tiệc", en: "Reception" },
"Chuẩn bị": { vi: "Chuẩn bị", en: "Preparation" },
"Khác": { vi: "Khác", en: "Other" },
"Sắp xếp lại": { vi: "Sắp xếp lại", en: "Reorder" },

// Gift tracker
"🎁 Phong Bì": { vi: "🎁 Phong Bì", en: "🎁 Gifts" },
"Quản lý phong bì": { vi: "Quản lý phong bì", en: "Gift Manager" },
"Tiền mặt": { vi: "Tiền mặt", en: "Cash" },
"Quà tặng": { vi: "Quà tặng", en: "Gift" },
"Số tiền": { vi: "Số tiền", en: "Amount" },
"Bên": { vi: "Bên", en: "Side" },
"Đã cảm ơn": { vi: "Đã cảm ơn", en: "Thanked" },
"Chưa cảm ơn": { vi: "Chưa cảm ơn", en: "Not thanked" },
"Tổng tiền mặt": { vi: "Tổng tiền mặt", en: "Total Cash" },
"Tổng quà": { vi: "Tổng quà", en: "Total Gifts" },
"Xuất CSV phong bì": { vi: "Xuất CSV phong bì", en: "Export Gift CSV" },

// Photo wall
"📸 Ảnh Cưới": { vi: "📸 Ảnh Cưới", en: "📸 Photos" },
"Tường ảnh cưới": { vi: "Tường ảnh cưới", en: "Wedding Photo Wall" },
"Tải ảnh lên": { vi: "Tải ảnh lên", en: "Upload Photo" },
"Đang tải ảnh...": { vi: "Đang tải ảnh...", en: "Uploading photo..." },
"Duyệt ảnh": { vi: "Duyệt ảnh", en: "Moderate" },
"Ẩn ảnh": { vi: "Ẩn ảnh", en: "Hide Photo" },
"Hiện ảnh": { vi: "Hiện ảnh", en: "Show Photo" },
"Tải tất cả": { vi: "Tải tất cả", en: "Download All" },
"Tạo QR code ảnh": { vi: "Tạo QR code ảnh", en: "Generate Photo QR" },
"Tên của bạn": { vi: "Tên của bạn", en: "Your Name" },
"Chọn ảnh": { vi: "Chọn ảnh", en: "Choose Photo" },
"ảnh": { vi: "ảnh", en: "photos" },

// Task board
"📋 Công Việc": { vi: "📋 Công Việc", en: "📋 Tasks" },
"Bảng công việc": { vi: "Bảng công việc", en: "Task Board" },
"Thêm công việc": { vi: "Thêm công việc", en: "Add Task" },
"Người phụ trách": { vi: "Người phụ trách", en: "Assignee" },
"Hạn chót": { vi: "Hạn chót", en: "Due Date" },
"Chờ làm": { vi: "Chờ làm", en: "Pending" },
"Đang làm": { vi: "Đang làm", en: "In Progress" },
"Hoàn thành": { vi: "Hoàn thành", en: "Completed" },
"Tạo link cho thành viên": { vi: "Tạo link cho thành viên", en: "Generate Member Links" },
"Chưa có công việc": { vi: "Chưa có công việc", en: "No tasks yet" },
"Danh mục": { vi: "Danh mục", en: "Category" },

// Wedding website
"🌐 Website Cưới": { vi: "🌐 Website Cưới", en: "🌐 Wedding Website" },
"Trang web đám cưới": { vi: "Trang web đám cưới", en: "Wedding Website" },
"Bật website": { vi: "Bật website", en: "Enable Website" },
"Tắt website": { vi: "Tắt website", en: "Disable Website" },
"Đường dẫn": { vi: "Đường dẫn", en: "URL Slug" },
"Hiển thị phần": { vi: "Hiển thị phần", en: "Show Section" },
"Câu chuyện": { vi: "Câu chuyện", en: "Story" },
"Địa điểm & Bản đồ": { vi: "Địa điểm & Bản đồ", en: "Venue & Map" },
"Bộ sưu tập ảnh": { vi: "Bộ sưu tập ảnh", en: "Gallery" },
"Xem trước": { vi: "Xem trước", en: "Preview" },
"Link website": { vi: "Link website", en: "Website Link" },
"Lời chào mừng": { vi: "Lời chào mừng", en: "Welcome Message" },
```

---

## 10. Page Definitions & PageRouter

### `src/data/page-definitions.ts`

Add two new top-level pages for Task Board and Website:

```typescript
export const PAGES: PageDef[] = [
  { id: "planning", label: "💒 Kế Hoạch" },
  { id: "astrology", label: "🔮 Tử Vi" },
  { id: "cards", label: "🖼️ Thiệp" },
  { id: "ai", label: "🤖 AI" },
  { id: "handbook", label: "📖 Sổ Tay" },
  { id: "ideas", label: "💡 Ý Tưởng" },
  { id: "tasks", label: "📋 Công Việc" },     // NEW
  { id: "website", label: "🌐 Website" },      // NEW
];
```

### `src/pages/page-router.tsx`

Add lazy imports and new cases:

```typescript
const TaskBoardDashboard = lazy(() => import("@/components/tasks/task-board-dashboard"));
const WebsiteSettingsPanel = lazy(() => import("@/components/website/website-settings-panel"));
```

Add cases in switch:

```typescript
case "tasks":
  return (
    <Suspense fallback={null}>
      <TaskBoardDashboard state={state} store={store} userId={userId} />
    </Suspense>
  );

case "website":
  return (
    <Suspense fallback={null}>
      <WebsiteSettingsPanel state={state} store={store} />
    </Suspense>
  );
```

These render placeholder lazy components that Phase 06 and Phase 07 will create.

---

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/types/wedding.ts` | EDIT — add 7 new interfaces, extend WeddingState |
| `src/data/backgrounds.ts` | EDIT — extend DEFAULT_STATE, add 2 EXTRA_TABS |
| `src/lib/migrate-state.ts` | EDIT — add v14->v15 migration |
| `src/db/schema.ts` | EDIT — add 2 new tables |
| `src/hooks/use-wedding-store.ts` | EDIT — change key to wp_v15, add 11 new methods |
| `src/main.tsx` | EDIT — add 3 lazy routes |
| `src/lib/i18n-translations.ts` | EDIT — add ~70 translation keys |
| `src/components/wedding/panel-router.tsx` | EDIT — add 2 tab routes |
| `src/data/page-definitions.ts` | EDIT — add 2 new page entries (tasks, website) |
| `src/pages/page-router.tsx` | EDIT — add 2 lazy cases (tasks, website) |
| `package.json` | EDIT — add @vercel/blob |

---

## Implementation Steps

1. Add all new interfaces and extend `WeddingState` in `src/types/wedding.ts`
2. Update `DEFAULT_STATE` in `src/data/backgrounds.ts` with all new Phase 2 fields
3. Add `EXTRA_TABS` entries for timeline and gifts in `src/data/backgrounds.ts`
4. Add v14->v15 migration in `src/lib/migrate-state.ts`
5. Update `STORAGE_KEY` to `"wp_v15"` in `src/hooks/use-wedding-store.ts`
6. Add all 11 new store methods and update the return object in `use-wedding-store.ts`
7. Add `weddingPhotos` and `weddingTasks` tables to `src/db/schema.ts`
8. Run `npm run db:generate && npm run db:migrate`
9. Add 3 lazy-loaded route entries to `src/main.tsx`
10. Add 2 panel routes for timeline/gifts in `panel-router.tsx`
11. Add 2 new pages to `src/data/page-definitions.ts` (tasks, website)
12. Add 2 lazy cases to `src/pages/page-router.tsx` (tasks, website)
13. Add all ~70 new i18n keys to `src/lib/i18n-translations.ts`
14. Run `npm install @vercel/blob`
15. Run `npm run build` to verify no compile errors
16. Run `npm run lint` to verify linting passes

---

## Todo List

- [ ] Add 7 new interfaces to `src/types/wedding.ts`
- [ ] Extend `WeddingState` with 8 new fields
- [ ] Update `DEFAULT_STATE` with Phase 2 defaults
- [ ] Add timeline + gift EXTRA_TABS
- [ ] Add v14->v15 migration
- [ ] Update STORAGE_KEY to wp_v15
- [ ] Add 11 store methods (4 timeline, 3 gift, 1 website, 1 photowall, 1 taskboard, 1 reminder)
- [ ] Add `weddingPhotos` DB table
- [ ] Add `weddingTasks` DB table
- [ ] Run DB migration
- [ ] Add 3 lazy hash routes to main.tsx
- [ ] Add 2 panel router cases (timeline, gifts)
- [ ] Add 2 pages to page-definitions.ts (tasks, website)
- [ ] Add 2 lazy cases to page-router.tsx (tasks, website)
- [ ] Add ~70 i18n translation keys
- [ ] Install `@vercel/blob`
- [ ] Build check passes
- [ ] Lint check passes

## Success Criteria

- `npm run build` succeeds with zero errors
- All new types are importable from `@/types/wedding`
- STORAGE_KEY is `"wp_v15"` and migration handles v14 data
- DB migration creates `wedding_photos` and `wedding_tasks` tables
- Routes `#/w/:slug`, `#/photos/:token`, `#/tasks/:token` render placeholder lazy pages
- All i18n keys return correct vi/en values via `t()`
- No file conflicts with Phases 02-07 (they only create new files)

## Conflict Prevention

This phase is the ONLY phase that edits shared files. Phases 02-07 are blocked until this completes. After completion, no phase may edit any file listed in the ownership table above.

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Type changes break existing code | Medium | Only ADD new fields; never remove/rename existing |
| Migration corrupts localStorage | Low | Defensive coding with fallback defaults |
| DB migration fails | Low | Test locally with `db:studio` before deploying |
| Store file exceeds 200-line limit | Medium | Extract Phase 2 methods into a separate `use-wedding-store-phase2.ts` helper and import |

## Security Considerations

- No new API endpoints in this phase (those come in Phase 05/06/07)
- DB tables include `userId` for data isolation
- Token columns are unique-indexed to prevent collisions

## Next Steps

After Phase 01 completes, Phases 02-07 can start in parallel. Each creates only new files within their exclusive directories.
