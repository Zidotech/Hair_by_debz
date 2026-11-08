import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"], qualities: [75], minimumCacheTTL: 2592000 },
  async headers() {
    const cache = "public, max-age=604800, stale-while-revalidate=2592000";
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: cache }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: cache }] },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
