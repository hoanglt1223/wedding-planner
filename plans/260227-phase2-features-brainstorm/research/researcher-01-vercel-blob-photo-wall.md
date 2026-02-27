# Research Report: Vercel Blob & Guest Photo Wall Architecture

**Date:** 2026-02-28 | **Max Word Count:** 150 lines

## Executive Summary

Vercel Blob provides cost-effective object storage ($0.023/GB-month storage, $0.05/GB transfer) with 100GB-hours free tier. Two upload patterns exist: **createPutUrl** (client-side direct upload, minimal server load) and **server upload** (more control, better for image processing). Wedding photo gallery architecture uses QR codes → guest upload → auto-approve → masonry display → zip download pattern, leveraging serverless for cost efficiency.

## Topic 1: Vercel Blob

### Pricing & Free Tier
- **Cost:** $0.023/GB-month storage + $0.05/GB outbound transfer
- **Free Tier:** 100GB-hours (no expiration, no credit card required)
- **Setup:** Included on all Vercel plans (Hobby, Pro, Enterprise)

### Upload Patterns

**Client-Side (createPutUrl):**
- Generate pre-signed URL server-side, client uploads directly to Blob
- Best for: User-generated photos, minimal server overhead
- Reduces serverless function invocations

**Server Upload:**
- Browser sends to API → API writes to Blob using `put()` method
- Better for: Image validation, compression, transformation
- Works well with middleware (Sharp for thumbnails)

### Key Operations
- **Put/Upload:** `put(pathname, body, options)` with metadata support
- **List:** `list({ prefix, limit, cursor })` for pagination
- **Delete:** `delete(pathname)` or batch deletions
- **Public URLs:** Access via `https://<token>.public.blob.vercel-storage.com/<path>`

### Image Optimization
- No built-in thumbnails; use **Sharp** (Node.js) server-side post-upload
- Compress before upload: reduce ~10MB to ~1-2MB via ImageMagick/Squoosh
- Store original + resized versions with different pathname prefixes
- Consider WebP format for ~40% size reduction vs JPEG

### Limitations
- Single file upload per invocation (no native batch)
- 4.5GB max invocation payload (serverless limit)
- Outbound transfer costs scale with downloads

---

## Topic 2: Guest Photo Wall Architecture

### QR Code → Upload Pattern
1. Generate QR code linking to `/upload?event=<id>` page
2. Guest scans → uploads via form
3. Server validates (filesize, MIME type, malware scan if budget permits)
4. Store in Vercel Blob with metadata (timestamp, guest name optional)
5. Auto-approve or queue for manual review

### Image Moderation
- **Auto-Approve:** Flag suspicious uploads (oversized, invalid format) only
- **Manual Hide:** Admin dashboard to soft-delete inappropriate photos (mark as hidden, don't physical delete)
- **Optional:** Integrate ImageAI/ML service for NSFW detection (adds cost)

### React Masonry Gallery
- **Lightweight:** Use `react-masonry-css` (~5KB) or vanilla CSS Grid with `auto-rows: minmax(200px, 1fr)`
- **Performance:** Lazy-load images, virtualize for 1000+ photos
- **UX:** Infinite scroll or pagination; click → lightbox overlay

### Zip Download Pattern
1. Client requests download
2. API creates streaming response with `JSZip` or server-side `archiver` (Node.js)
3. Stream blob listings, fetch each image, add to zip in-memory
4. Return as `Content-Type: application/zip`
5. For 500+ photos: pre-generate zips periodically, store in Blob, serve pre-built

### Serverless Constraints
- **Timeout:** 60s (Vercel Pro) → pre-generate zips for large galleries
- **Memory:** 512MB–3GB (depends on plan) → chunk processing
- **Best Practice:** Async queue for zip generation; user receives email/download link when ready

---

## Resources & References

### Official Docs
- [Vercel Blob Documentation](https://vercel.com/docs/vercel-blob)
- [Vercel Blob Pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Vercel Pricing Plans 2025](https://vercel.com/pricing)

### Wedding Gallery Implementations
- [GitHub: Serverless Wedding Gallery (AWS)](https://github.com/eddmann/our-wedding-gallery)
- [Building Serverless Wedding Gallery Blog Post](https://eddmann.com/posts/building-a-serverless-wedding-gallery-using-aws-lambda-s3-and-dynamodb)

### Production QR Photo Apps
- [Kululu - Wedding Photo Sharing with QR](https://www.kululu.com/wedding-photo-sharing-app)
- [GUESTPIX - QR Event Photo Platform](https://guestpix.com/)
- [Wedibox - QR Photo Collection](https://www.wedibox.com/)
- [GuestCam - Event Photo Sharing](https://guestcam.co/)

### React Masonry Libraries
- `react-masonry-css` (simple, lightweight)
- CSS Grid with `auto-rows: minmax()` (no dependency, native)
- `react-virtualized` (for 1000+ items)

---

## Unresolved Questions

1. Should we use Sharp on every upload or batch-process thumbnails async?
2. Pre-generate zip files or stream on-demand?
3. Manual image moderation UI complexity vs. cost of ML filtering?
4. Support video uploads? (impacts storage cost + streaming architecture)
