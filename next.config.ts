import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // All Sanity content uses this profile. Pages refresh in the background at
    // most once a minute (so new posts appear quickly even without a webhook),
    // while visitors are always served instantly from the cache.
    content: {
      stale: 60,
      revalidate: 60,
      expire: 60 * 60 * 24 * 30,
    },
  },
  images: {
    // Images are resized by the Sanity / YouTube / Unsplash CDNs themselves,
    // so we don't use (or pay for) Vercel's image optimisation quota.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
