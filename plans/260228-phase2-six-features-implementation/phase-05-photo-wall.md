---
phase: "05"
title: "Guest Photo Wall"
status: complete
priority: P2
effort: 3-4 days
completed: 2026-02-28
---

# Phase 05: Guest Photo Wall

## Context Links
- [plan.md](./plan.md)
- [phase-01-foundation.md](./phase-01-foundation.md)
- [researcher-01 report](../260227-phase2-features-brainstorm/research/researcher-01-vercel-blob-photo-wall.md)

## Parallelization Info
- **Group:** Parallel (02-07)
- **Dependencies:** Phase 01 (DB schema `wedding_photos`, routes, photo wall settings, i18n)
- **Can run with:** Phases 02, 03, 04, 06, 07
- **No file conflicts** — creates files in `src/components/photo-wall/`, `src/pages/`, `api/photos/`

## Overview
Guest photo upload via QR code/link + couple's masonry gallery with moderation. Storage via Vercel Blob. Two views: guest upload page (`#/photos/:token`) and couple's gallery dashboard within the app.

## Key Insights
- Vercel Blob: client-side direct upload via `createPutUrl` pattern (minimal server load)
- Per-wedding photo limit: 100 photos (configurable in photoWallSettings)
- Auto-approve by default; couple can hide photos
- Guest upload page: no auth, token-based access
- Token generated per-couple (not per-table in MVP) — stored in Redis with 24h TTL
- DB table `wedding_photos` stores metadata; Blob stores actual images
- Thumbnail generation: browser-side resize before upload (canvas API, no Sharp dependency)
- Masonry layout: CSS Grid with `auto-rows` (no npm dependency)

## Requirements

### Functional
- **Guest upload page** (`#/photos/:token`):
  - Name input (optional), file picker, upload button
  - Shows upload progress, success confirmation
  - Max 5MB per photo, JPEG/PNG/WebP only
  - Client-side resize to max 1920px width before upload
- **Couple gallery dashboard**:
  - Masonry grid of all photos
  - Moderation: hide/show individual photos
  - Photo count and storage indicator
  - QR code generation for upload link
  - Download all as zip (stretch goal — v2)
- **API endpoints**:
  - `POST /api/photos/upload` — generate presigned URL + save metadata
  - `GET /api/photos/list` — paginated list for couple
  - `PATCH /api/photos/moderate` — toggle approved status

### Non-Functional
- Max file size: 5MB per upload (enforced client + server)
- Max 100 photos per wedding (configurable)
- Rate limit: 10 uploads per minute per token
- All files < 200 lines

## Architecture

```
Guest view: #/photos/:token
  └── PhotoUploadPage (src/pages/photo-upload-page.tsx)
        └── photo-upload-form.tsx

Couple view: standalone page or cards panel sub-tab
  └── PhotoGalleryDashboard (src/components/photo-wall/photo-gallery-dashboard.tsx)
        ├── photo-masonry-grid.tsx    — masonry layout
        ├── photo-card.tsx            — single photo with moderate button
        ├── photo-qr-generator.tsx    — QR code for upload link
        └── photo-upload-link.tsx     — manage upload token

API:
  └── api/photos.ts                  — single handler routing GET/POST/PATCH
```

## Related Code Files (Full Paths)

**Reads (does NOT edit):**
- `D:\Projects\wedding-planner\src\types\wedding.ts` — `PhotoWallSettings`, `WeddingState`
- `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` — `setPhotoWallSettings()`
- `D:\Projects\wedding-planner\src\db\schema.ts` — `weddingPhotos` table
- `D:\Projects\wedding-planner\src\db\index.ts` — `createDb()`
- `D:\Projects\wedding-planner\src\lib\redis.ts` — `createRedis()`
- `D:\Projects\wedding-planner\src\lib\i18n.ts` — `t()`

**CREATES (exclusive):**
- `D:\Projects\wedding-planner\src\pages\photo-upload-page.tsx`
- `D:\Projects\wedding-planner\src\components\photo-wall\photo-upload-form.tsx`
- `D:\Projects\wedding-planner\src\components\photo-wall\photo-gallery-dashboard.tsx`
- `D:\Projects\wedding-planner\src\components\photo-wall\photo-masonry-grid.tsx`
- `D:\Projects\wedding-planner\src\components\photo-wall\photo-card.tsx`
- `D:\Projects\wedding-planner\src\components\photo-wall\photo-qr-generator.tsx`
- `D:\Projects\wedding-planner\src\components\photo-wall\photo-upload-link.tsx`
- `D:\Projects\wedding-planner\src\lib\photo-api.ts`
- `D:\Projects\wedding-planner\src\lib\image-resize.ts`
- `D:\Projects\wedding-planner\api\photos.ts`

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/pages/photo-upload-page.tsx` | CREATE — default export, lazy-loaded from main.tsx |
| `src/components/photo-wall/photo-upload-form.tsx` | CREATE |
| `src/components/photo-wall/photo-gallery-dashboard.tsx` | CREATE |
| `src/components/photo-wall/photo-masonry-grid.tsx` | CREATE |
| `src/components/photo-wall/photo-card.tsx` | CREATE |
| `src/components/photo-wall/photo-qr-generator.tsx` | CREATE |
| `src/components/photo-wall/photo-upload-link.tsx` | CREATE |
| `src/lib/photo-api.ts` | CREATE — client-side API helpers |
| `src/lib/image-resize.ts` | CREATE — canvas-based resize utility |
| `api/photos.ts` | CREATE — serverless handler |

## Implementation Steps

### 1. Create `src/lib/image-resize.ts`

Browser-side image resize utility:
```typescript
export async function resizeImage(file: File, maxWidth: number = 1920): Promise<Blob> {
  // Create Image from file
  // If width <= maxWidth, return original
  // Draw to canvas at reduced size
  // Export as JPEG (quality 0.85) or WebP
  // Return Blob
}
```
Max ~50 lines.

### 2. Create `api/photos.ts`

Single serverless handler routing by method:
```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  // Rate limiting per token/userId

  // POST /api/photos?action=get-upload-url
  //   - Validate token from Redis
  //   - Check photo count < maxPhotos
  //   - Generate Vercel Blob presigned URL via createPutUrl()
  //   - Return { uploadUrl, blobPathname }

  // POST /api/photos?action=confirm
  //   - After client uploads to Blob, confirm metadata
  //   - Insert into wedding_photos table
  //   - Return { id, blobUrl }

  // GET /api/photos?userId=X
  //   - Fetch photos by userId, paginated (limit/cursor)
  //   - Return { photos: [], nextCursor }

  // PATCH /api/photos?action=moderate
  //   - Toggle approved status
  //   - Body: { photoId, approved: boolean, userId }
  //   - Validate userId matches photo.userId
  //   - Return { ok: true }

  // POST /api/photos?action=create-token
  //   - Generate upload token, store in Redis with 24h TTL
  //   - Body: { userId }
  //   - Return { token }
}
```
Max ~180 lines (may need to split into `api/photos/upload.ts`, `api/photos/list.ts`, `api/photos/moderate.ts` if > 200 lines).

### 3. Create `src/lib/photo-api.ts`

Client API helpers:
```typescript
export async function getUploadUrl(token: string, filename: string): Promise<{ uploadUrl: string; blobPathname: string }>;
export async function confirmUpload(token: string, blobUrl: string, uploaderName: string): Promise<{ id: string }>;
export async function fetchPhotos(userId: string, cursor?: string): Promise<{ photos: PhotoMeta[]; nextCursor?: string }>;
export async function moderatePhoto(userId: string, photoId: string, approved: boolean): Promise<void>;
export async function createPhotoToken(userId: string): Promise<string>;
```
Max ~80 lines.

### 4. Create `src/pages/photo-upload-page.tsx`

Guest-facing upload page (default export, lazy-loaded):
```typescript
export default function PhotoUploadPage({ token }: { token: string }) {
  // Validate token via API
  // Show upload form
  // Handle upload: resize -> get presigned URL -> upload to Blob -> confirm
  // Success/error states
}
```
Max ~80 lines.

### 5. Create `src/components/photo-wall/photo-upload-form.tsx`

- File input (accept: image/jpeg, image/png, image/webp)
- Optional name input
- Upload progress bar
- Max 5MB validation (client-side)
- Preview before upload
- Max ~100 lines

### 6. Create `src/components/photo-wall/photo-gallery-dashboard.tsx`

Couple's dashboard container:
- Fetch photos via `fetchPhotos(userId)`
- Toggle between grid view and moderation view
- Photo count display
- "Generate QR" button
- Max ~100 lines

### 7. Create `src/components/photo-wall/photo-masonry-grid.tsx`

CSS Grid masonry:
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
grid-auto-rows: 10px;
```
- Lazy load images with `loading="lazy"`
- Click to expand (lightbox overlay)
- Max ~80 lines

### 8. Create `src/components/photo-wall/photo-card.tsx`

Single photo:
- Image with lazy loading
- Uploader name + timestamp overlay
- Moderate button (hide/show) — only visible to couple
- Max ~50 lines

### 9. Create `src/components/photo-wall/photo-qr-generator.tsx`

- Generate QR code for `{origin}/#/photos/{token}` using existing `qrcode` library
- Download QR as PNG
- Display URL for manual sharing
- Reuse pattern from `src/components/guests/rsvp-qr-modal.tsx`
- Max ~60 lines

### 10. Create `src/components/photo-wall/photo-upload-link.tsx`

Token management:
- "Enable Photo Wall" toggle -> creates token via API
- Display current upload link
- Copy link button
- Regenerate token button
- Max ~60 lines

## Todo List

- [ ] Create `src/lib/image-resize.ts` (canvas resize utility)
- [ ] Create `api/photos.ts` (serverless handler with 5 actions)
- [ ] Create `src/lib/photo-api.ts` (client API helpers)
- [ ] Create `src/pages/photo-upload-page.tsx` (guest upload page)
- [ ] Create `src/components/photo-wall/photo-upload-form.tsx`
- [ ] Create `src/components/photo-wall/photo-gallery-dashboard.tsx`
- [ ] Create `src/components/photo-wall/photo-masonry-grid.tsx`
- [ ] Create `src/components/photo-wall/photo-card.tsx`
- [ ] Create `src/components/photo-wall/photo-qr-generator.tsx`
- [ ] Create `src/components/photo-wall/photo-upload-link.tsx`
- [ ] Test: guest upload flow end-to-end (resize -> upload -> confirm)
- [ ] Test: couple gallery loads photos
- [ ] Test: moderation (hide/show) works
- [ ] Test: QR code generates and links correctly
- [ ] Test: rate limiting works
- [ ] Test: file size validation works
- [ ] Build check passes

## Success Criteria

- Guest can upload photo via `#/photos/:token` link
- Photos resize to max 1920px before upload
- Photos stored in Vercel Blob, metadata in PostgreSQL
- Couple sees masonry gallery of all photos
- Moderation (hide/show) toggles photo visibility
- QR code generates correct upload link
- Rate limiting prevents abuse (10 uploads/min)
- Max 100 photos per wedding enforced
- All files < 200 lines

## Conflict Prevention

- Only creates files in `src/components/photo-wall/`, `src/pages/`, `src/lib/`, `api/`
- Route in main.tsx already added by Phase 01
- DB table already created by Phase 01
- No shared file edits

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Vercel Blob costs at scale | Medium | Per-wedding 100 photo limit; client-side resize reduces storage |
| Presigned URL abuse | Medium | Token validation + rate limiting + photo count check |
| Large gallery performance | Low | Lazy loading + `loading="lazy"` on images |
| CORS issues with Blob upload | Medium | Vercel Blob handles CORS natively for createPutUrl |

## Security Considerations
- Token-based access: upload tokens stored in Redis with 24h TTL
- Rate limiting: 10 uploads/min per token
- File type validation: server-side MIME check (image/jpeg, image/png, image/webp)
- File size: 5MB max enforced server-side (Blob PUT options)
- Photo moderation: only couple (matching userId) can toggle approved
- No direct Blob URLs exposed in guest-facing pages (serve via API)
- XSS: photo metadata (uploader name) sanitized before display

## Environment Variables

Add to `.env.example`:
```
BLOB_READ_WRITE_TOKEN=   # Vercel Blob access token (auto-provisioned on Vercel)
```
