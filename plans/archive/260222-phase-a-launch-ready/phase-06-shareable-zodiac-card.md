# Phase 06: Shareable Zodiac Card

## Context Links
- [Parent Plan](./plan.md)
- [PWA + Sharing Research](./research/researcher-01-pwa-and-sharing.md)
- [Tab Compatibility Component](../../src/components/astrology/tab-compatibility.tsx)
- [Astrology Page](../../src/pages/astrology-page.tsx)

## Overview
- **Date:** 2026-02-22
- **Priority:** P2
- **Status:** pending
- **Effort:** 4h
- **Description:** Build a screenshot-friendly zodiac compatibility card with html2canvas "Save as Image" button. Optimized for 1200x630px sharing on Facebook/Zalo. Primary viral growth mechanism.

## Key Insights
- html2canvas renders DOM to canvas. Must use inline styles or computed Tailwind for correct rendering.
- Export at 1200x630px (Facebook/OG standard). Use `scale: 2` for retina quality (2400x1260 actual).
- Mobile gotcha: Android WebView can fail with large canvas. Limit to `scale: 2` max.
- Tailwind text may shift during html2canvas render. Fix: set explicit `font-family` on the card container.
- Existing `tab-compatibility.tsx` already computes scores, element relations, zodiac data -- reuse all logic.
- Card should include: couple names, birth years, zodiac animals, compatibility score, element analysis, app branding/URL.

## Requirements
**Functional:**
- "Save as Image" button on astrology page (visible when compatibility data available)
- Generates a 1200x630 card with couple's zodiac analysis
- Downloads as PNG file to device
- Card includes app URL as watermark for viral sharing

**Non-functional:**
- Image generation < 3 seconds on mid-range Android
- Card renders correctly without network (all data inline, no external images)
- File size < 500KB

## Architecture
```
src/components/astrology/
  zodiac-share-card.tsx    (new, ~80 lines, the rendered card)
  zodiac-share-button.tsx  (new, ~50 lines, html2canvas trigger)

tab-compatibility.tsx ──> renders ZodiacShareButton
ZodiacShareButton ──> renders hidden ZodiacShareCard ──> html2canvas ──> download PNG
```

## Related Code Files
**Modify:**
- `src/components/astrology/tab-compatibility.tsx` -- add ZodiacShareButton after main result card
- `package.json` -- add html2canvas dependency

**Create:**
- `src/components/astrology/zodiac-share-card.tsx` -- the 1200x630 card component
- `src/components/astrology/zodiac-share-button.tsx` -- button + html2canvas logic

## Implementation Steps

1. **Install html2canvas:** `npm install html2canvas`

2. **Create zodiac-share-card.tsx:** A ref-able div designed for screenshot export.
   - Fixed dimensions via inline style: `width: 1200px, height: 630px`
   - Layout: left side (bride info + zodiac), center (compatibility result + score), right side (groom info + zodiac)
   - Background: warm gradient `linear-gradient(135deg, #fdf6f0, #fce4ec)`
   - Explicit `fontFamily: "'Playfair Display', serif"` inline for html2canvas reliability
   - Bottom bar: app URL "weddingplanner.vn" + "Tu Vi Hop Tuoi" branding
   - Props: `brideYear, groomYear, brideName, groomName, score, relation`
   - Use zodiac emoji (from astrology.ts `getZodiac`) for visual appeal
   - Element colors match existing COMPAT_STYLE (green/blue/red)
   - Position offscreen: `absolute left-[-9999px] top-0` so it doesn't affect layout

3. **Create zodiac-share-button.tsx:**
   ```tsx
   interface Props {
     brideYear: number; groomYear: number;
     brideName: string; groomName: string;
     score: number; relationType: CompatType;
   }
   ```
   - Renders a Button "Luu Hinh" (Save Image) with camera emoji
   - On click: make card visible (move from offscreen), call `html2canvas(cardRef, { scale: 2, useCORS: true })`, convert to blob, trigger download as `tuvi-{brideName}-{groomName}.png`, move card back offscreen
   - Loading state: disable button, show "Dang tao..." text
   - Error handling: try-catch, show toast on failure

4. **Integrate in tab-compatibility.tsx:** After the score bar Card (around line 84), add:
   ```tsx
   <ZodiacShareButton
     brideYear={brideYear} groomYear={groomYear}
     brideName={brideName} groomName={groomName}
     score={score} relationType={rel.type}
   />
   ```

5. **Test rendering:** Open astrology page, enter birth years, click "Save Image". Verify PNG downloads, dimensions correct, text readable.

## Todo List
- [ ] Install html2canvas
- [ ] Create zodiac-share-card.tsx (1200x630 layout)
- [ ] Create zodiac-share-button.tsx (html2canvas trigger)
- [ ] Integrate button in tab-compatibility.tsx
- [ ] Test on Chrome desktop
- [ ] Test on Android Chrome
- [ ] Test on iOS Safari
- [ ] Verify PNG dimensions and file size
- [ ] Verify app URL watermark visible in exported image

## Success Criteria
- Button generates downloadable PNG in < 3s
- PNG dimensions: 2400x1260 (scale:2) or 1200x630 (scale:1)
- All text readable (couple names, zodiac, score, elements)
- App branding/URL visible in image
- File size < 500KB
- Works on Android Chrome and iOS Safari

## Risk Assessment
- **Medium:** html2canvas may not render custom CSS variables (`var(--theme-*)`). Mitigation: use inline styles and hardcoded colors on the share card specifically.
- **Medium:** Large canvas on low-end Android may OOM. Mitigation: use `scale: 2` not higher; fallback to `scale: 1` on error.
- **Low:** Google Fonts may not render if not loaded. Mitigation: card uses fonts already loaded by index.html.

## Security Considerations
- No user data leaves the device. Image generated client-side only.
- html2canvas processes only the card DOM node (no access to other page content).

## Next Steps
After launch, track how many zodiac card images are shared on social media (manual observation). Consider adding QR code to card linking back to app.
