# Research Report: PWA, State Sharing, and Image Export

**Date:** 2026-02-22
**Project:** Wedding Planner (Vite 7 + React 19 + TypeScript)
**Topics:** PWA support, shareable links without database, image export for social sharing

---

## 1. PWA Support with Vite 7

### Best Plugin: vite-plugin-pwa

**vite-plugin-pwa** is the industry standard for Vite PWA support. Zero-configuration setup generates manifests and service workers using Google Workbox. Actively maintained with React 19 compatibility.

**Installation & Configuration:**
```javascript
import { VitePWA } from 'vite-plugin-pwa/vite'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wedding Planner',
        theme_color: '#ffffff',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
}
```

**Vercel Deployment Compatibility:**
- Service workers require HTTPS (enforced by Vercel)
- Configure `vercel.json` headers for manifest: `Content-Type: application/manifest+json`
- Service worker must have Cache-Control headers forcing validation on each request
- HTML files typically use no-cache headers to ensure fresh content

**Add to Home Screen:**
- **Android:** Automatic prompt after ~2 visits (native browser behavior)
- **iOS:** No automatic prompt; use [`react-ios-pwa-prompt`](https://github.com/chrisdancee/react-ios-pwa-prompt) library for custom UI
- Requires `beforeinstallprompt` event listener on desktop/Android
- Icons needed: favicon (16×16), apple-touch-icon (180×180), masked icons (192×192, 512×512)

**React 19 Gotchas:**
- No known breaking changes; vite-plugin-pwa >= v0.17 requires Vite 5+ (Vite 7 compatible)
- Service worker isolation prevents direct React component access; communicate via postMessage
- Use Web Workers for background tasks without blocking main thread

---

## 2. Shareable Links Without Database

### Recommended Approach: Upstash Redis (Your Setup Already Configured)

Since your app has Upstash Redis already configured but unused, this is the **optimal choice** over URL encoding:

**Why Upstash Redis > URL Encoding:**
- URL size limits: Browser max ~2000 chars; your wedding data could exceed this
- **Security:** Sensitive data (guest passwords, budgets) compressed in URLs are still readable
- **Flexibility:** Short-lived keys (10 mins) allow stateless sharing without exposing internals
- **Scalability:** Easy to migrate to Vercel KV (same API) without code changes

**Implementation (Upstash Serverless):**
```typescript
// API route: /api/share
import { createRedis } from '@/services/redis'

export default async (req: Request) => {
  const redis = createRedis()
  const state = await req.json()
  const key = `share:${crypto.randomUUID()}`

  // 10-minute TTL
  await redis.setex(key, 600, JSON.stringify(state))
  return new Response(JSON.stringify({ shareId: key.split(':')[1] }))
}
```

**Tradeoff:** +1 HTTP request on share creation, but avoids exposing data in URL history/logs.

### Fallback: URL Compression with lz-string

**Use if Redis not preferred for specific shares:**

**Installation:**
```bash
npm install lz-string
```

**Usage:**
```typescript
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

const state = { guests: [...], budget: {...} }
const compressed = compressToEncodedURIComponent(JSON.stringify(state))
const url = `https://app.com/preview?data=${compressed}`
```

**Size Limits:**
- ~95% compression ratio on typical JSON
- Wedding data (500 guests): ~50KB raw → ~3KB compressed (still under URL limits)
- *Warning:* Phone numbers, budget figures visible in browser history/shared links

---

## 3. Image Export from DOM

### Winner: html2canvas (Most Reliable for React + Tailwind)

**Key Advantages:**
- Works with Tailwind CSS v4 (known issue: text shifts down; fix: restore `img { display: auto }`)
- Battle-tested in React ecosystem; no React 19 breaking changes
- Handles pseudo-elements and gradients better than competitors

**Mobile Compatibility Issues:**
- **Chrome Mobile:** Works well
- **Android WebView:** Known bugs (empty screens); canvas size limits can trigger
- **Samsung Internet:** Inherits Chrome rendering; same WebView constraints
- **iOS Safari:** Unstable; may produce blank images

**Solution for Mobile:**
```typescript
const options = {
  allowTaint: true,
  useCORS: true,
  windowWidth: 1200,
  windowHeight: 800,
  scale: 2 // Compensate for mobile rendering
}
const canvas = await html2canvas(element, options)
```

**Competitors:**
- **dom-to-image:** Lighter but less stable with Tailwind
- **modern-screenshot:** Newer, Puppeteer-like but requires server
- **html-to-image:** Drop-in replacement but slower

**Recommended:** Stick with **html2canvas** for client-side. If mobile fails, fall back to server-side rendering via Vercel Functions.

---

## 4. Image Dimensions for Social Sharing

### Facebook (Primary Platform)

| Content Type | Dimensions | Aspect Ratio |
|---|---|---|
| Link Preview | 1200 × 630px | 1.91:1 |
| Feed Post (Square) | 1080 × 1080px | 1:1 |
| Feed Post (Vertical) | 1080 × 1350px | 4:5 |
| Stories | 1080 × 1920px | 9:16 |
| Cover Photo | 1640 × 624px | 2.62:1 |

**Max file size:** 8MB (PNG recommended for zodiac card with transparency)

### Zalo (Vietnamese Platform)

Search results did not contain Zalo-specific dimensions. Recommend:
- Check Zalo Developer Documentation directly
- Typical defaults: 1200 × 630px (opengraph standard) works across most platforms
- Test with actual app before launch

**Best Practice:** Export at 1200 × 630px for universal compatibility; add Zalo-specific version if docs confirm different requirements.

---

## 5. Implementation Priority

### Immediate (MVP Launch)
1. ✅ vite-plugin-pwa configuration + manifest
2. ✅ Upstash Redis share links (API route + hook)
3. ✅ html2canvas for zodiac card export
4. ✅ Facebook dimensions (1200 × 630px)

### Post-Launch
1. iOS "Add to Home" prompt (react-ios-pwa-prompt component)
2. Zalo-specific dimensions once confirmed
3. Server-side image rendering fallback for Android WebView failures

---

## Citations

- [vite-plugin-pwa GitHub](https://github.com/vite-pwa/vite-plugin-pwa)
- [Vite Plugin PWA Guide](https://vite-pwa-org.netlify.app/guide/)
- [Vercel Deployment - Vite PWA](https://vite-pwa-org.netlify.app/deployment/vercel)
- [lz-string Compression](https://github.com/pieroxy/lz-string)
- [Upstash Redis Vercel Integration](https://upstash.com/docs/redis/howto/vercelintegration)
- [html2canvas - LogRocket](https://blog.logrocket.com/export-react-components-as-images-html2canvas/)
- [html2canvas Tailwind CSS Fix](https://hanki.dev/tailwind-html2canvas-text-shift-down/)
- [React iOS PWA Prompt](https://github.com/chrisdancee/react-ios-pwa-prompt)
- [Social Media Image Sizes 2026](https://www.socialpilot.co/blog/social-media-image-sizes)
- [Facebook Image Dimensions 2026](https://imageforpost.com/guides/facebook-image-sizes-dimensions-guide-2025)

---

## Unresolved Questions

1. **Zalo official image dimensions** — Search results don't cover Zalo specifics; need to check Zalo developer docs
2. **Exact React 19 compatibility** — vite-plugin-pwa community hasn't released v0.18+ with explicit React 19 testing; assume compatible based on zero breaking changes
3. **Mobile WebView fallback strategy** — Determine if server-side rendering via Vercel Function is necessary for Android users or acceptable to degrade gracefully
