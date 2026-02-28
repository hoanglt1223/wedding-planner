# Phase 01: PWA Infrastructure

## Parallelization Info

- **Group:** A (runs in parallel with Phase 02)
- **Depends on:** Nothing
- **Blocks:** Phase 07 (Polish)
- **No file conflicts with Phase 02**

## Context Links

- [PWA Research Report](research/researcher-01-pwa-patterns.md)
- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Current vite.config.ts](../../vite.config.ts)
- [Current main.tsx](../../src/main.tsx)
- [Current ios-install-prompt.tsx](../../src/components/pwa/ios-install-prompt.tsx)

## Overview

- **Priority:** HIGH
- **Status:** complete
- **Effort:** 3h
- **Description:** Install vite-plugin-pwa, configure Workbox caching, create web manifest, add `useOnlineStatus` hook, improve iOS install prompt, remove manual SW registration.

## Key Insights

- App already registers `/sw.js` manually in `main.tsx` (lines 14-18) -- VitePWA replaces this entirely
- Hash routing works fine offline since Workbox `navigateFallback` serves `index.html` and React handles `#` client-side
- All user data already in localStorage (`wp_v15`) -- offline works by default for reads
- iOS has 50MB cache limit; keep precache lean (JS+CSS+HTML only, ~2MB typical)
- `registerType: 'autoUpdate'` avoids prompt UX complexity; SW updates silently

## Requirements

### Functional
- App installable on Android (Chrome) and iOS (Safari)
- Offline access to all cached static assets
- API calls degrade gracefully when offline (network-first with 5s timeout)
- Offline badge visible to user when disconnected
- iOS-specific install prompt with bilingual text

### Non-Functional
- Lighthouse PWA score > 90
- Precache bundle < 5MB
- SW registration < 100ms on repeat visits

## Architecture

```
vite-plugin-pwa (build-time)
  -> Generates manifest.webmanifest
  -> Generates sw.js via Workbox
  -> Auto-injects manifest link into index.html
  -> Precaches all static assets (JS, CSS, HTML, images)

Runtime:
  Static assets -> CacheFirst (immutable hashed filenames)
  /api/* -> NetworkFirst (5s timeout, stale fallback)
  Google Fonts -> CacheFirst (1yr TTL)
  navigateFallback -> /index.html (hash routing compat)
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `vite.config.ts` | Add VitePWA plugin config |
| `src/main.tsx` | Remove manual SW registration (lines 14-18) |

### Files to CREATE
| File | Purpose |
|------|---------|
| `src/hooks/use-online-status.ts` | React hook: `navigator.onLine` + event listeners |
| `src/components/pwa/install-prompt.tsx` | Improved bilingual install prompt (replaces ios-install-prompt.tsx) |
| `public/icons/icon-192.png` | PWA icon 192x192 (placeholder) |
| `public/icons/icon-512.png` | PWA icon 512x512 (placeholder) |
| `public/icons/icon-192-maskable.png` | Maskable PWA icon 192x192 |

### Files to DELETE
| File | Reason |
|------|--------|
| `src/components/pwa/ios-install-prompt.tsx` | Replaced by `install-prompt.tsx` |

## File Ownership (EXCLUSIVE)

This phase owns:
- `vite.config.ts` (PWA plugin addition only)
- `src/main.tsx` (SW registration removal only)
- `src/hooks/use-online-status.ts`
- `src/components/pwa/*`
- `public/icons/*`

No other phase may touch these files.

## Implementation Steps

### Step 1: Install dependencies
```bash
npm install -D vite-plugin-pwa
```
Note: `workbox-*` packages are peer deps auto-installed by vite-plugin-pwa.

### Step 2: Configure VitePWA in vite.config.ts
Add `VitePWA()` to plugins array:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

plugins: [
  react(),
  tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Wedding Planner - Ke Hoach Dam Cuoi',
      short_name: 'Wedding',
      description: 'Plan your perfect Vietnamese wedding',
      theme_color: '#1f2937',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/#/app',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//, /\/[^/]+\.[^/]+$/],
      runtimeCaching: [
        {
          urlPattern: /^\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
          },
        },
      ],
    },
  }),
],
```

### Step 3: Create icon placeholders
Generate 192x192 and 512x512 PNG icons in `public/icons/`. Use simple colored square with "W" text as placeholder (replace with real icons later).

### Step 4: Create useOnlineStatus hook
`src/hooks/use-online-status.ts` (~20 lines):
```typescript
import { useState, useEffect } from 'react';

export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handler = () => setOnline(navigator.onLine);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    return () => {
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }, []);
  return online;
}
```

### Step 5: Remove manual SW registration from main.tsx
Delete lines 14-18 (the `if ('serviceWorker' in navigator)` block). VitePWA auto-injects SW registration.

### Step 6: Replace ios-install-prompt with bilingual install-prompt
Create `src/components/pwa/install-prompt.tsx` (~80 lines):
- Detect iOS Safari, Android Chrome, standalone mode
- Show banner: "Add to Home Screen" with bilingual text
- Accept `lang` prop, use `t()` for labels
- Dismiss permanently via localStorage (`pwa_install_dismissed`)
- For Android: listen to `beforeinstallprompt` event, show native prompt
- Touch target: 44px dismiss button

Delete `ios-install-prompt.tsx` after.

### Step 7: Add Apple meta tags to index.html
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Wedding">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
```

### Step 8: Verify build and test
```bash
npm run build
npm run preview
```
- Open DevTools > Application > Manifest -- verify manifest loads
- Open DevTools > Application > Service Workers -- verify SW registered
- Toggle Network: Offline -- verify app shell loads

## Todo List

- [ ] Install vite-plugin-pwa
- [ ] Add VitePWA config to vite.config.ts
- [ ] Create placeholder icons (192, 512, maskable)
- [ ] Create `use-online-status.ts` hook
- [ ] Remove manual SW registration from main.tsx
- [ ] Create bilingual `install-prompt.tsx`
- [ ] Delete `ios-install-prompt.tsx`
- [ ] Add Apple meta tags to index.html
- [ ] Update App.tsx import (ios-install-prompt -> install-prompt)
- [ ] Run build, verify no errors
- [ ] Test offline mode in preview

## Success Criteria

- `npm run build` passes with no errors
- Lighthouse PWA audit score >= 90
- App installable on Android Chrome
- iOS Safari shows install banner
- Offline mode loads app shell with cached data
- `useOnlineStatus` returns correct boolean on toggle

## Conflict Prevention

- **vite.config.ts**: Only add VitePWA to plugins array. Do not change react() or tailwindcss() plugins.
- **main.tsx**: Only remove SW registration block. Do not touch Root component or hash routing.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| VitePWA conflicts with Tailwind v4 plugin | Med | Both are Vite plugins; order matters. Place VitePWA after tailwindcss(). |
| Large precache bundle | Low | globPatterns excludes `.jpg`/`.jpeg`/`.gif`; only essential assets cached |
| iOS cache limit (50MB) | Low | Typical SPA bundle < 2MB; well within limits |

## Security Considerations

- SW only caches same-origin requests; no CORS issues
- API cache expires after 24h; stale tokens/sessions naturally expire
- No sensitive data in SW cache (all user data in localStorage)

## Next Steps

- Phase 07 will add offline badge to header using `useOnlineStatus`
- Phase 03 will update App.tsx import from `ios-install-prompt` to `install-prompt`
