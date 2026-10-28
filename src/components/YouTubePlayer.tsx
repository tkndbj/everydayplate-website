"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { youTubeThumbnail } from "@/lib/youtube";
import { cn } from "@/lib/utils";

interface Props {
  id: string | null;
  title: string;
  short?: boolean;
  className?: string;
}

/**
 * Lightweight YouTube embed: shows the thumbnail and only loads YouTube's
 * (heavy) player when the visitor presses play. Uses the privacy-friendly
 * youtube-nocookie domain.
 */
export function YouTubePlayer({ id, title, short, className }: Props) {
  const [playing, setPlaying] = useState(false);
  // Not every video has a max-resolution thumbnail; fall back to the standard one.
  const [hiRes, setHiRes] = useState(!short);
  const frame = cn(
    "relative overflow-hidden rounded-[var(--radius-card)] bg-ink shadow-[var(--shadow-lift)]",
    short ? "mx-auto aspect-[9/16] w-full max-w-[22rem]" : "aspect-video w-full",
    className,
  );

  if (!id) {
    return (
      <div className={cn(frame, "grid place-items-center p-6 text-center text-paper/80")}>
        <p className="max-w-xs text-sm">This is a demo video. Once the admin panel is connected, your YouTube video plays here.</p>
      </div>
    );
  }

  if (playing) {
    return (
      <div className={frame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={cn(frame, "group block")} aria-label={`Play video: ${title}`}>
      <Image
        src={youTubeThumbnail(id, hiRes ? "maxres" : "hq")}
        onError={() => setHiRes(false)}
        alt=""
        fill
        sizes={short ? "352px" : "(min-width: 1024px) 60vw, 100vw"}
        className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      <span className="absolute left-1/2 top-1/2 grid size-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-terracotta text-paper shadow-xl ring-8 ring-paper/20 transition duration-300 group-hover:scale-110">
        <Play className="ml-1 size-8 fill-current" />
      </span>
    </button>
  );
}
