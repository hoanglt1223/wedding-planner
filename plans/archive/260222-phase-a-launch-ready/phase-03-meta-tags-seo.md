# Phase 03: Meta Tags & SEO Foundation

## Context Links
- [Parent Plan](./plan.md)
- [PWA Research](./research/researcher-01-pwa-and-sharing.md)
- [Mobile UX Research](./research/researcher-02-mobile-ux-and-landing.md)

## Overview
- **Date:** 2026-02-22
- **Priority:** P1
- **Status:** pending
- **Effort:** 2h
- **Description:** Add OG tags, Twitter cards, favicon links, robots.txt, sitemap.xml, and structured data. Enable rich previews when shared on Zalo/Facebook.

## Key Insights
- Zalo uses OG tags (same as Facebook). `og:image` must be absolute URL, minimum 200x200, ideal 1200x630.
- Vietnamese users share primarily on Zalo and Facebook. Both render OG previews in chat.
- Current `index.html` has zero meta tags beyond viewport and charset.
- Need a static OG image in `public/` for default sharing (before zodiac card phase).
- `robots.txt` and `sitemap.xml` are needed for Google indexing.

## Requirements
**Functional:**
- Sharing app URL on Zalo/Facebook shows rich preview (title, description, image)
- Google can crawl and index the landing page
- All meta tags render correctly in Facebook Sharing Debugger

**Non-functional:**
- OG image loads in < 1s (static file, CDN-cached)
- Vietnamese text in meta tags uses proper diacritics

## Architecture
Static files in `public/` + meta tags in `index.html`. No React components needed.

## Related Code Files
**Modify:**
- `index.html` -- add all meta tags

**Create:**
- `public/og-image.png` -- 1200x630 default OG image (wedding-themed, Vietnamese text)
- `public/robots.txt`
- `public/sitemap.xml`

## Implementation Steps

1. **Create OG image (1200x630):** Design a simple wedding-themed banner with app name in Vietnamese. Use `imagemagick` skill or create a simple SVG-based image. Text: "Wedding Planner - Ke hoach dam cuoi" with subtle wedding imagery. Save as `public/og-image.png`.

2. **Update index.html `<head>`:** Add these meta tags (after existing viewport meta):
   ```html
   <!-- SEO -->
   <meta name="description" content="Ung dung mien phi giup ban len ke hoach dam cuoi Viet Nam: nghi le, ngan sach, khach moi, tu vi hop tuoi." />
   <meta name="keywords" content="dam cuoi, ke hoach cuoi, nghi le cuoi viet nam, ngan sach cuoi, tu vi hop tuoi" />
   <meta name="author" content="Wedding Planner" />

   <!-- Open Graph -->
   <meta property="og:type" content="website" />
   <meta property="og:title" content="Wedding Planner - Ke Hoach Dam Cuoi Viet Nam" />
   <meta property="og:description" content="Mien phi 100%. Nghi le 8 buoc, ngan sach, khach moi, tu vi hop tuoi. Khong can dang ky." />
   <meta property="og:image" content="https://YOUR_DOMAIN/og-image.png" />
   <meta property="og:url" content="https://YOUR_DOMAIN/" />
   <meta property="og:locale" content="vi_VN" />
   <meta property="og:site_name" content="Wedding Planner" />

   <!-- Twitter Card -->
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="Wedding Planner - Ke Hoach Dam Cuoi" />
   <meta name="twitter:description" content="Mien phi 100%. Nghi le 8 buoc, ngan sach, khach moi, tu vi hop tuoi." />
   <meta name="twitter:image" content="https://YOUR_DOMAIN/og-image.png" />
   ```
   **Note:** Replace `YOUR_DOMAIN` with actual Vercel domain after first deploy, or use env-based approach.

3. **Add structured data (JSON-LD):** Add a `<script type="application/ld+json">` block in `<head>`:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebApplication",
     "name": "Wedding Planner",
     "description": "Ung dung mien phi ke hoach dam cuoi Viet Nam",
     "applicationCategory": "LifestyleApplication",
     "operatingSystem": "Web",
     "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" },
     "inLanguage": "vi"
   }
   ```

4. **Create robots.txt:**
   ```
   User-agent: *
   Allow: /
   Sitemap: https://YOUR_DOMAIN/sitemap.xml
   ```

5. **Create sitemap.xml:**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://YOUR_DOMAIN/</loc>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
   </urlset>
   ```

6. **Update title tag:** Change from "Vietnamese Wedding Planner" to "Wedding Planner - Ke Hoach Dam Cuoi Viet Nam | Mien Phi 100%"

7. **Build and verify:** Run `npm run build`. Check dist/ for robots.txt, sitemap.xml, og-image.png.

## Todo List
- [ ] Create og-image.png (1200x630) and place in public/
- [ ] Add SEO meta tags to index.html
- [ ] Add OG tags to index.html
- [ ] Add Twitter Card tags to index.html
- [ ] Add JSON-LD structured data to index.html
- [ ] Create public/robots.txt
- [ ] Create public/sitemap.xml
- [ ] Update page title
- [ ] Build and verify all files in dist/
- [ ] Test OG tags with Facebook Sharing Debugger (after deploy)

## Success Criteria
- Facebook Sharing Debugger shows correct title, description, image
- Zalo chat preview shows rich card when sharing URL
- `robots.txt` and `sitemap.xml` accessible at root URLs
- Lighthouse SEO score >= 90

## Risk Assessment
- **Low:** OG image URL must be absolute. Placeholder `YOUR_DOMAIN` must be updated after Vercel deploy or configured dynamically.
- **Mitigation:** After first Vercel deploy, update URLs to match actual domain.

## Security Considerations
- No user data exposed in meta tags. All content is static marketing copy.

## Next Steps
Phase 04 (Landing Page) will use the OG image and meta tags established here for consistent branding.
