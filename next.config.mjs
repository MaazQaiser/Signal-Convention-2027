import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * `next build` and `next dev` both write to .next, so building while the dev
   * server runs deletes its chunks and every /_next/static request 404s until
   * dev restarts. `npm run build:check` sets NEXT_DIST_DIR to build elsewhere.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /* Hide the Next.js dev tools badge (dev-only overlay; no effect on builds) */
  devIndicators: false,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    /*
     * Next's default is webp-only. Offering AVIF first lets the optimizer
     * spend the same byte budget on more resolution, which is what the
     * full-bleed `sizes="100vw"` heroes need on 2x displays.
     */
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three: path.resolve(__dirname, "node_modules/three"),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      /*
       * Files served straight out of /public get Vercel's default
       * `public, max-age=0, must-revalidate`, which meant the 38MB (brotli)
       * brandmark GLB and the two films — ~102MB of media — were revalidated
       * on essentially every visit instead of being reused.
       *
       * These filenames are NOT content-hashed the way /_next/static assets
       * are, so this is a deliberate 30-day bet rather than `immutable`:
       * replacing a model or film means viewers keep the cached copy until
       * max-age lapses. To publish a replacement immediately, rename the file
       * and update its reference (BRANDMARK_MODEL_PATH in lib/brandmark-model.ts
       * for the GLB).
       */
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
