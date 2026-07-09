# Signal — Here We Grow · 2027 (Next.js)

Next.js + Framer Motion rebuild of the Signal Franchise Convention site, built to the
Signal brand guide (`HC0296_SignalConvention_BrandGuide_081424_V1-03_CB.pdf`).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

- `app/layout.tsx` — fonts (Michroma / Archivo / IBM Plex Mono via `next/font`) + metadata
- `app/globals.css` — brand tokens from the guide (orange `#FF7900`, yellow `#FFDA8F`, blue `#0055FF`, light blue `#00D5FF`, light gray `#DBDBDB`)
- `components/` — one client component per section
- `public/brand/` — **official logo assets extracted from the brand guide PDF**:
  - `here-we-grow-25/26/27-dark.png` — full-color lockups for dark backgrounds
  - `here-we-grow-25/26/27-light.png` — full-color lockups for light backgrounds
  - `beacon-2025/2026/2027.png` — the year beacon marks (white, for dark backgrounds)

## Animations (Framer Motion)

- Hero: staggered entrance + slow ambient beacon rotation
- Story: scroll-pinned horizontal track (`useScroll` + `useTransform`), dashed ray-line progress
- Section reveals: `whileInView` via `components/Reveal.tsx`
- Brands bar: SIGNAL / FILTERGO slide-in from opposite sides
- Countdown: live ticking clock (placeholder date `2027-12-10`)
- All animations respect `prefers-reduced-motion`; horizontal pin falls back to a vertical stack under 821px

## Brand-guide compliance

- Real brandmark exports used everywhere (never redrawn or recolored)
- On-dark lockups only on black, on-light lockups only on white/light gray
- Hero lockup rendered ≥ 300px wide (guide minimum is 168px)
- No drop shadows or effects applied to the marks

## Remaining placeholders

- Venue name + confirmed date (`[Dec 10, 2027]`, `[Venue name]`, countdown target in `components/Register.tsx`)
- Aftermovie video (`components/Aftermovie.tsx` — swap frame for a `<video>`)
- Merch photos + prices, crewneck image
- Register CTA link (`components/Register.tsx`)
