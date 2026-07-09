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
- `public/` — images, brand assets, and 3D model
- `Images/`, `Logos/`, `SVG logos/` — source brand assets
- `legacy/` — original single-file HTML draft

## Vercel

The Next.js app lives at the repository root, so Vercel deploys it automatically. `vercel.json` runs `git lfs pull` during install so the 3D model is available in production.
