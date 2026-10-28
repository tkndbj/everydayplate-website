import { createImageUrlBuilder } from "@sanity/image-url";
import type { SiteImage } from "@/lib/types";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

export interface RawImage {
  alt?: string | null;
  caption?: string | null;
  hotspot?: { x: number; y: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  asset?: {
    _id: string;
    url: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
  } | null;
}

/**
 * Converts a Sanity image into the shape our <Img> component uses. The crop is
 * baked into the URL and the hotspot becomes a CSS object-position, so the
 * same image works in any aspect ratio while keeping the chosen focal point.
 */
export function toImage(raw: RawImage | null | undefined, fallbackAlt = ""): SiteImage | undefined {
  if (!raw?.asset?._id) return undefined;
  const dims = raw.asset.metadata?.dimensions ?? { width: 1600, height: 1200 };
  const crop = raw.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const width = Math.round(dims.width * (1 - crop.left - crop.right));
  const height = Math.round(dims.height * (1 - crop.top - crop.bottom));

  let position: string | undefined;
  if (raw.hotspot) {
    // Hotspot is relative to the full image; translate it into the cropped frame.
    const x = (raw.hotspot.x - crop.left) / (1 - crop.left - crop.right);
    const y = (raw.hotspot.y - crop.top) / (1 - crop.top - crop.bottom);
    position = `${clamp(x * 100)}% ${clamp(y * 100)}%`;
  }

  return {
    src: builder.image({ asset: { _ref: raw.asset._id }, crop: raw.crop ?? undefined }).url(),
    alt: raw.alt || fallbackAlt,
    width,
    height,
    blurDataURL: raw.asset.metadata?.lqip,
    position,
    caption: raw.caption ?? undefined,
  };
}

const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)));
