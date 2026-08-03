# Signal — Here We Grow · 2027

Next.js landing page for the Signal Franchise Convention 2027 — cinematic hero scroll, 3D brandmark, journey section, and full convention story.

## Run locally

```bash
npm install
git lfs pull   # required for the 3D model
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project structure

- `app/`, `components/`, `lib/` — Next.js application
- `public/` — images, brand assets, videos, and 3D model (`models/modal-opt.glb`)
- `Logos/`, `SVG logos/` — source brand assets
- `legacy/` — original single-file HTML draft

## Vercel

The Next.js app lives at the repository root, so Vercel deploys it automatically.

## Source masters

Full-resolution photography and the 298 MB source glTF are intentionally kept out of
git — only the web-optimized derivatives under `public/` are committed. Retrieve the
masters from asset storage if you need to regenerate a derivative (see
`scripts/optimize-model.mjs`).
