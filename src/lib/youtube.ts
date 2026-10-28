/**
 * Extracts the 11-character video id from any common YouTube link:
 * youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/…, /embed/…, /live/…
 */
export function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\.|^m\./, "");

    if (host === "youtu.be") return clean(url.pathname.slice(1));
    if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
      const v = url.searchParams.get("v");
      if (v) return clean(v);
      const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // fall through
  }
  return null;
}

function clean(id: string): string | null {
  const match = id.match(/^[\w-]{11}/);
  return match ? match[0] : null;
}

export function isYouTubeShort(url?: string | null): boolean {
  return Boolean(url && /youtube\.com\/shorts\//i.test(url));
}

export function youTubeThumbnail(id: string, quality: "hq" | "maxres" = "hq"): string {
  return `https://i.ytimg.com/vi/${id}/${quality === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;
}
