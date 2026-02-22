# Phase 07: Share-via-Link

## Context Links
- [Parent Plan](./plan.md)
- [PWA + Sharing Research](./research/researcher-01-pwa-and-sharing.md)
- [Redis Factory](../../src/lib/redis.ts)
- [Export Utils](../../src/lib/export.ts)

## Overview
- **Date:** 2026-02-22
- **Priority:** P2
- **Status:** pending
- **Effort:** 3h
- **Description:** Serverless API endpoint using existing Upstash Redis for short-lived share links. Read-only preview page showing couple info, progress, timeline summary. 10-minute TTL.

## Key Insights
- Upstash Redis already configured in project (createRedis factory in `src/lib/redis.ts`). ENV vars set.
- Share flow: user clicks "Share" -> app compresses state, POSTs to `/api/share` -> Redis stores with 10-min TTL -> returns short URL `/#/shared/{id}`.
- Preview page is read-only. Viewer cannot edit. Shows: couple names, wedding date, progress %, ceremony checklist summary.
- lz-string for compression: WeddingState JSON ~5KB, compresses to ~1.5KB. Well within Redis limits.
- 10-min TTL prevents stale data and keeps Redis storage minimal.

## Requirements
**Functional:**
- "Share" button in app header or footer
- Creates a shareable link valid for 10 minutes
- Link opens a read-only preview page (no editing)
- Preview shows: couple names, date, progress bar, ceremony steps status
- Expired links show friendly "Link expired" message

**Non-functional:**
- Share link generation < 1s
- Preview page loads < 2s
- Redis storage per share < 5KB
- No authentication required

## Architecture
```
Client (Share Button)
  │
  ├── compress state with lz-string
  ├── POST /api/share { data: compressedState }
  │
  ▼
API /api/share (Vercel Function)
  │
  ├── generate nanoid (8 chars)
  ├── Redis SET share:{id} data EX 600
  └── return { id, url }

Client (Viewer)
  │
  ├── GET /api/share?id={id}
  │
  ▼
API /api/share (Vercel Function, GET)
  │
  ├── Redis GET share:{id}
  └── return { data } or 404

Shared Preview Page (/#/shared/{id})
  │
  ├── fetch /api/share?id={id}
  ├── decompress with lz-string
  └── render read-only preview
```

## Related Code Files
**Modify:**
- `src/main.tsx` -- add `#/shared/{id}` route to hash router
- `src/components/layout/header.tsx` -- add Share button
- `package.json` -- add lz-string, nanoid dependencies

**Create:**
- `api/share.ts` -- Vercel serverless function (POST create, GET retrieve)
- `src/pages/shared-preview-page.tsx` -- read-only preview (~100 lines)
- `src/components/shared/shared-progress.tsx` -- progress display (~50 lines)
- `src/lib/share.ts` -- client-side compress/decompress + API calls (~40 lines)

## Implementation Steps

1. **Install dependencies:** `npm install lz-string nanoid` and `npm install -D @types/lz-string`

2. **Create api/share.ts:** Vercel serverless function handling both POST and GET.
   ```ts
   // POST: create share link
   // - parse body { data: string } (lz-string compressed)
   // - validate data length < 10KB
   // - generate id with nanoid(8)
   // - Redis SET `share:${id}` data EX 600 (10 min)
   // - return { id }

   // GET: retrieve shared data
   // - parse query param ?id=xxx
   // - Redis GET `share:${id}`
   // - return { data } or 404 { error: "expired" }
   ```
   Use `createRedis()` from `@/lib/redis`. Handle CORS headers. Max 60 lines.

3. **Create src/lib/share.ts:** Client-side utilities.
   ```ts
   import { compressToBase64, decompressFromBase64 } from 'lz-string';

   export function compressState(state: WeddingState): string
   export function decompressState(data: string): WeddingState | null
   export async function createShareLink(state: WeddingState): Promise<string>
   export async function fetchSharedState(id: string): Promise<WeddingState | null>
   ```

4. **Create shared-preview-page.tsx:** Read-only preview page.
   - Fetches shared data on mount using id from URL hash
   - Loading state: spinner
   - Error/expired state: friendly message + CTA to create own plan
   - Success: render couple names, wedding date, countdown, progress bar, ceremony steps summary (checkmarks)
   - Footer: "Create your own plan" CTA linking to landing page

5. **Create shared-progress.tsx:** Reusable progress display component.
   - Shows progress bar + percentage
   - Lists ceremony steps with check/uncheck status
   - Compact layout for sharing context

6. **Add Share button to header.tsx:** Add a share icon button (lucide `Share2` icon) next to existing nav. On click:
   - Call `createShareLink(state)`
   - Copy URL to clipboard (`navigator.clipboard.writeText`)
   - Show brief toast "Link da duoc sao chep!"
   - If clipboard fails, show URL in a modal for manual copy

7. **Update main.tsx router:** Add shared route handling:
   ```tsx
   if (route.startsWith('#/shared/')) {
     const id = route.replace('#/shared/', '');
     return <SharedPreviewPage shareId={id} />;
   }
   ```

8. **Build & test:** Create share link, open in incognito. Verify data displays. Wait 10 min, verify expiry message.

## Todo List
- [ ] Install lz-string and nanoid
- [ ] Create api/share.ts (POST + GET handler)
- [ ] Create src/lib/share.ts (compress/decompress/API)
- [ ] Create shared-preview-page.tsx
- [ ] Create shared-progress.tsx
- [ ] Add Share button to header.tsx
- [ ] Update main.tsx hash router for /shared/{id}
- [ ] Test share link creation
- [ ] Test share link preview (incognito)
- [ ] Test expired link message
- [ ] Test clipboard copy on mobile

## Success Criteria
- Share button generates link in < 1s
- Link opens read-only preview showing correct data
- Link expires after 10 minutes with friendly message
- Works on mobile (Zalo in-app browser, Chrome, Safari)
- Redis usage < 5KB per share

## Risk Assessment
- **Medium:** Zalo in-app browser may block clipboard API. Mitigation: fallback to showing URL text for manual copy.
- **Low:** Redis TTL precision is seconds; 10 min = 600s is reliable.
- **Low:** nanoid collision at 8 chars is 1 in 2.8 trillion. Acceptable for ephemeral links.

## Security Considerations
- **Data exposure:** Shared data includes couple names, dates, guest count, budget. Acceptable since user explicitly chose to share.
- **Rate limiting:** Not implemented in MVP. If abused, add IP-based rate limiting via Upstash ratelimit.
- **Input validation:** Server validates compressed data length < 10KB. Rejects oversized payloads.
- **No PII beyond names/dates.** No phone numbers or addresses included in compressed state (filter before compression).

## Next Steps
Post-launch: monitor Redis usage via Upstash dashboard. Consider extending TTL to 1 hour if users request it. Add QR code generation for offline sharing.
