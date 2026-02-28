# PWA Implementation Patterns for Hash-Based SPA

## Executive Summary
Your app already registers a service worker (`/sw.js`). This report covers production-ready PWA patterns using **vite-plugin-pwa** + **Workbox** for Vite 7 + React 19 with hash routing.

---

## 1. VitePWA Plugin Setup (Recommended)

### Why vite-plugin-pwa?
- Auto-generates `manifest.json` & `sw.js` from config
- Handles Workbox integration automatically
- Minifies SW code at build time
- Works seamlessly with Vite 7 + Tailwind v4

### Installation & Config
```bash
npm install -D vite-plugin-pwa workbox-build workbox-core workbox-expiration workbox-precaching workbox-routing workbox-strategies
```

**vite.config.ts:**
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wedding Planner',
        short_name: 'WedPlanner',
        description: 'Plan your perfect Vietnamese wedding',
        theme_color: '#1f2937',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/#/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2}'],
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
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 31536000 } },
          },
        ],
      },
    }),
  ],
})
```

---

## 2. Hash-Based Routing Considerations

### Problem: SPA Navigation Breaks Offline
Hash routes (`/#/app`, `/#/shared/123`) bypass service worker routing—browser fetches `index.html` before evaluating hash.

### Solution: Precache Fallback Strategy
1. **Precache index.html**: VitePWA auto-precaches it
2. **SW navigateFallback**: Route all missing pages → `index.html`
3. **React handles hash routing**: Client-side router kicks in offline

```typescript
// In workbox config
navigateFallback: '/index.html',
navigateFallbackDenylist: [/^\/_/, /\/[^/]+\.[^/]+$/], // Exclude API, assets
```

---

## 3. Workbox Caching Strategies

### Static Assets (Cache-First)
- JS bundles, CSS, images: cached indefinitely
- VitePWA hashes filenames → safe to cache forever
- Set `globPatterns` to match your build output

### API Calls (Network-First)
- `/api/sync`, `/api/ai/chat`, etc.: try network first (5s timeout)
- Falls back to cache if offline or timeout
- Key for real-time data (guest RSVPs, planning updates)

### Third-Party Resources (Cache-First with TTL)
- Google Fonts, CDN images: cache 1 year
- Rarely update; bandwidth savings worth staleness risk

---

## 4. Offline Shell Pattern

### Show "Offline" Badge
```tsx
// src/hooks/use-online-status.ts
export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handle = () => setOnline(navigator.onLine);
    window.addEventListener('online', handle);
    window.addEventListener('offline', handle);
    return () => {
      window.removeEventListener('online', handle);
      window.removeEventListener('offline', handle);
    };
  }, []);

  return online;
}

// In App.tsx
<div className={!online ? 'border-t-2 border-red-500 p-2 bg-red-50' : ''}>
  {!online && <span className="text-sm text-red-600">Offline Mode</span>}
  {/* rest of app */}
</div>
```

### Cache Wedding Data Locally
Your app already persists to localStorage (`wp_v13`). Keep it—don't fetch from SW. Users see cached data seamlessly offline.

---

## 5. iOS Safari PWA Quirks

### Splash Screen (Required for App-Like Feel)
```html
<!-- public/index.html head -->
<link rel="apple-touch-startup-image" href="/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)">
<!-- Add for other devices: 1242×2688, 1536×2048, etc. -->
```

### Status Bar Color
```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

### Standalone Mode Detection
```typescript
const isStandalone = window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;
```

### Limitations
- No SW background sync (iOS ≤17)
- No notification API
- 50MB cache limit (vs. 10GB+ on Android)
- Full app reload on update (no incremental)

### Workaround: Check Version on Load
```typescript
// Check if app was updated since last run
const buildTime = '__BUILD_TIME__'; // Injected at build
if (localStorage.getItem('buildTime') !== buildTime) {
  localStorage.setItem('buildTime', buildTime);
  localStorage.clear(); // Clear old cache on iOS
  location.reload();
}
```

---

## 6. Manifest Best Practices

### Theme Color
- Matches your app's primary color
- Affects browser address bar on Android
- `#1f2937` (from Tailwind gray-900) is good choice

### Icons
- Generate via `@squoosh/cli` or ImageMagick
- **Sizes:** 192px, 512px (required); 384px (recommended)
- **Maskable:** Add `_maskable` variant for adaptive icons (safe area guaranteed)
- Format: PNG preferred (JPEG loses transparency)

### Start URL with Hash
- `"start_url": "/#/"` — launches planner directly
- Enables deep linking to hash routes (`/#/shared/abc`)

---

## Key Takeaways

| Concern | Solution |
|---------|----------|
| **Hash routing offline** | Workbox `navigateFallback: /index.html`; React handles hash client-side |
| **API offline** | Network-first strategy with 5s timeout; fallback to stale cache |
| **Real-time data** | Use cache as fallback; sync updates when online via `useSync` hook |
| **iOS** | Splash screens, standalone detection, version checking for cache invalidation |
| **Build** | VitePWA auto-precaches hashed assets; no manual SW needed |

---

## Next Steps
1. Install `vite-plugin-pwa` + Workbox deps
2. Add PWA config to `vite.config.ts`
3. Generate 192px & 512px icons (+ maskable variants)
4. Add splash screen meta tags for iOS
5. Test offline functionality (DevTools → Network: Offline)
6. Monitor SW updates in production
