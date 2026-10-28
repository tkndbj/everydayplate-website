"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Global next/image loader. Every image is resized by the CDN that hosts it
 * (Sanity, Unsplash), so no Vercel image optimisation is used.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("/")) return src;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }

  if (url.hostname === "cdn.sanity.io") {
    url.searchParams.set("auto", "format");
    if (!url.searchParams.has("fit")) {
      url.searchParams.set("fit", url.searchParams.has("h") ? "min" : "max");
    }
    // Keep the crop's aspect ratio when scaling to a responsive width.
    const w = Number(url.searchParams.get("w"));
    const h = Number(url.searchParams.get("h"));
    if (w && h) url.searchParams.set("h", String(Math.round((h / w) * width)));
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality || 75));
    return url.href;
  }

  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("auto", "format");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality || 75));
    return url.href;
  }

  // YouTube thumbnails and anything else are served as-is.
  return src;
}
