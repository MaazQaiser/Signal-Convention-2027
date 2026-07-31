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
    ];
  },
};

export default nextConfig;
