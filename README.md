# Signal — Here We Grow · 2027 (first draft)

Single-file site: open `legacy/index.html` in a browser. Black-first brand build per the Signal brand guide (orange #FF7900, yellow #FFDA8F, blue #0055FF, light blue #00D5FF, light gray #DBDBDB).

## Production app (Next.js)

The current site lives in `signal-hwg-next/`. Run locally:

```bash
cd signal-hwg-next
npm install
git lfs pull   # required for the 3D model
npm run dev
```

## Vercel deployment

In the Vercel project settings, set **Root Directory** to `signal-hwg-next`, then redeploy.

Without that, Vercel may serve the old static draft instead of the Next.js app.

## Page flow
Hero (pulsing beacon, HERE WE —27 GROW) → pinned horizontal story (2025 Culture · 2026 Community · 2027 Consistency) → agenda (white) → aftermovie (full-bleed, brand gradient overlay) → Signal × Filtergo bar → merch (light gray) → live countdown + register → footer (unified beacon).

## Drop-in slots (search `PLACEHOLDER` in index.html)
1. Nav + hero wordmark → replace styled text with the official lockup exports (dark-background set; min 168px wide per guide).
2. Chapter images → `.chapter-img` blocks (2025 photo, 2026 photo, 2027 = full-color lockup).
3. Aftermovie → swap `.movie-frame` for a `<video autoplay muted loop playsinline>`; keep the gradient overlay (`.movie-frame::after`) per the guide's imagery rule.
4. Merch photos → `.item-img` blocks.
5. Countdown date → `target` const in the script (currently 2027-12-10, placeholder).
6. Register links → all `href="#register"` CTAs point at the section; wire the button to the real ticketing URL.

## Brand-guide compliance notes
- The SVG "beacon" marks are wireframe stand-ins. Production must use official logo exports — never redraw, recolor, or add effects.
- Gradients only in the brand order (warm white→yellow→orange; cool blue→light blue).
- Contrast rules respected: full-color mark on black/white only.

## For Claude Code
Everything is one `index.html` (CSS + JS inline) for easy iteration. Suggested next tasks: split into `/assets`, add real ticketing integration, mobile nav menu, OG/meta images, and per-section a11y pass. GSAP + ScrollTrigger load from cdnjs; horizontal pin disables under 820px and for reduced-motion users (falls back to a vertical stack).
