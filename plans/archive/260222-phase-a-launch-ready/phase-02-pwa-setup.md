# Phase 02: PWA Setup

## Context Links
- [Parent Plan](./plan.md)
- [PWA Research](./research/researcher-01-pwa-and-sharing.md)
- [Code Standards](../../docs/code-standards.md)

## Overview
- **Date:** 2026-02-22
- **Priority:** P1
- **Status:** pending
- **Effort:** 3h
- **Description:** Install vite-plugin-pwa, generate manifest, create icon set, configure service worker with autoUpdate, add iOS install prompt, configure Vercel caching headers.

## Key Insights
- `vite-plugin-pwa` with `registerType: 'autoUpdate'` is simplest setup. Auto-updates SW without user prompt.
- Required icons: favicon.ico (32x32), apple-touch-icon (180x180), pwa-192x192.png, pwa-512x512.png, maskable-512x512.png.
- iOS lacks native PWA install banner. Use `react-ios-pwa-prompt` or lightweight custom component.
- Vercel serves from CDN with immutable hashes on assets. Need `vercel.json` headers for SW scope.
- Current `public/` directory is completely empty.

## Requirements
**Functional:**
- App installable on Android (Chrome Add to Home Screen) and iOS (Safari Share > Add to Home Screen)
- App shell loads offline (SW precaches HTML + JS + CSS)
- Updates auto-apply on next visit

**Non-functional:**
- Lighthouse PWA score >= 90
- Manifest theme_color matches default theme (#c0392b red)

## Architecture
```
vite.config.ts ──> vite-plugin-pwa plugin
                    ├── generates manifest.webmanifest
                    ├── generates sw.js (Workbox)
                    └── injects <link rel="manifest"> into index.html

public/
  ├── favicon.ico
  ├── apple-touch-icon.png (180x180)
  ├── pwa-192x192.png
  ├── pwa-512x512.png
  └── maskable-512x512.png

src/components/layout/ios-install-prompt.tsx  (new, <80 lines)
```

## Related Code Files
**Modify:**
- `vite.config.ts` -- add VitePWA plugin config
- `index.html` -- add apple-touch-icon link, theme-color meta
- `src/App.tsx` -- render IosInstallPrompt component
- `package.json` -- add vite-plugin-pwa dependency

**Create:**
- `public/favicon.ico` -- 32x32 wedding ring icon
- `public/apple-touch-icon.png` -- 180x180
- `public/pwa-192x192.png` -- 192x192
- `public/pwa-512x512.png` -- 512x512
- `public/maskable-512x512.png` -- 512x512 with safe zone padding
- `src/components/layout/ios-install-prompt.tsx` -- iOS Safari install banner
- `vercel.json` -- cache headers for SW

## Implementation Steps

1. **Install dependency:** `npm install -D vite-plugin-pwa` (uses workbox internally).

2. **Generate icons:** Use a simple wedding-themed SVG (double rings or heart) and generate all 5 sizes. Use `imagemagick` skill or online tool. Place in `public/`. Favicon can be generated from the 512px source.

3. **Configure vite.config.ts:** Import `VitePWA` from `vite-plugin-pwa`. Add to plugins array:
   ```ts
   VitePWA({
     registerType: 'autoUpdate',
     includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
     manifest: {
       name: 'Wedding Planner - Ke Hoach Dam Cuoi',
       short_name: 'Wedding Planner',
       description: 'Ung dung len ke hoach dam cuoi Viet Nam',
       theme_color: '#c0392b',
       background_color: '#fdf6f0',
       display: 'standalone',
       scope: '/',
       start_url: '/',
       icons: [
         { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
         { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
         { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
       ],
     },
   })
   ```

4. **Update index.html:** Add in `<head>`:
   ```html
   <meta name="theme-color" content="#c0392b" />
   <link rel="icon" href="/favicon.ico" />
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   ```

5. **Create ios-install-prompt.tsx:** Lightweight component that shows a bottom banner on iOS Safari (detect via `navigator.userAgent` and `!window.matchMedia('(display-mode: standalone)').matches`). Show "Them vao Man hinh chinh" with Safari share icon. Dismiss stores `pwa_ios_dismissed` in localStorage. Max 70 lines.

6. **Mount in App.tsx:** Import and render `<IosInstallPrompt />` inside the root div, after `<SaveToast>`.

7. **Create vercel.json:** Add headers for service worker:
   ```json
   {
     "headers": [
       { "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] },
       { "source": "/manifest.webmanifest", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
     ]
   }
   ```

8. **Build & verify:** Run `npm run build`, check `dist/` for manifest.webmanifest and sw.js.

## Todo List
- [ ] Install vite-plugin-pwa
- [ ] Generate and place 5 icon files in public/
- [ ] Configure VitePWA in vite.config.ts
- [ ] Add meta tags to index.html
- [ ] Create ios-install-prompt.tsx
- [ ] Mount IosInstallPrompt in App.tsx
- [ ] Create vercel.json with SW cache headers
- [ ] Build and verify manifest + SW generated
- [ ] Test install on Android Chrome
- [ ] Test install prompt on iOS Safari

## Success Criteria
- `npm run build` produces sw.js and manifest.webmanifest in dist/
- Lighthouse PWA audit passes (installable, has manifest, SW registered)
- App installable on Android and shows custom icon on home screen
- iOS shows install prompt banner on first visit

## Risk Assessment
- **Medium:** vite-plugin-pwa version compatibility with Vite 7.3.1. Mitigation: check npm for latest compatible version before install.
- **Low:** iOS prompt detection may false-positive on non-Safari iOS browsers. Mitigation: check for `safari` in UA specifically.

## Security Considerations
- SW only caches static assets (HTML/JS/CSS), no API responses cached.
- No sensitive data in manifest.

## Next Steps
Phase 03 (Meta Tags & SEO) builds on the favicon and icons created here.
