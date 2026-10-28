"use client";

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import type { VideoCard as VideoCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Img } from "../Img";

interface Props {
  video: VideoCardData;
  className?: string;
  sizes?: string;
}

/** Fired when a card starts playing, so any other playing card stops. */
const PLAY_EVENT = "everyday-plate:video-play";

/**
 * Vertical card for Shorts, wide card for regular videos. The play button
 * plays the video right inside the card; the title opens the video's page.
 */
export function VideoCard({ video, className, sizes }: Props) {
  const short = video.isShort;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const stopIfOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== video._id) setPlaying(false);
    };
    window.addEventListener(PLAY_EVENT, stopIfOther);
    return () => window.removeEventListener(PLAY_EVENT, stopIfOther);
  }, [playing, video._id]);

  function play() {
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: video._id }));
    setPlaying(true);
  }

  const frame = cn(
    "relative overflow-hidden rounded-[var(--radius-card)] bg-ink shadow-[var(--shadow-soft)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-lift)]",
    short ? "aspect-[9/16]" : "aspect-video",
  );

  if (playing && video.youtubeId) {
    return (
      <article className={cn("relative", className)}>
        <div className={frame}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
        <Link
          href={`/videos/${video.slug}`}
          className="mt-2 inline-flex items-center gap-1 px-1 text-sm font-medium text-ink-soft hover:text-terracotta"
        >
          <span className="line-clamp-1">{video.title}</span>
          <ArrowUpRight className="size-3.5 shrink-0" />
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group relative", className)}>
      <div className={frame}>
        <Img
          image={video.thumbnail}
          sizes={sizes ?? (short ? "(min-width: 1024px) 16vw, (min-width: 640px) 28vw, 45vw" : "(min-width: 1024px) 45vw, 92vw")}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        {short && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-ink">
            Short
          </span>
        )}
        <h3
          className={cn(
            "absolute inset-x-0 bottom-0 p-4 font-serif leading-snug text-paper",
            short ? "text-base" : "text-xl sm:p-5",
          )}
        >
          <Link href={`/videos/${video.slug}`} className="line-clamp-3 after:absolute after:inset-0">
            {video.title}
          </Link>
        </h3>
        {/* Sits above the card-wide link so pressing play plays here instead of navigating. */}
        {video.youtubeId ? (
          <button
            type="button"
            onClick={play}
            aria-label={`Play: ${video.title}`}
            className="absolute left-1/2 top-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-terracotta shadow-lg backdrop-blur transition duration-300 hover:scale-110 hover:bg-paper group-hover:scale-110"
          >
            <Play className="ml-0.5 size-6 fill-current" />
          </button>
        ) : (
          <span className="pointer-events-none absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-terracotta shadow-lg backdrop-blur">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        )}
      </div>
    </article>
  );
}
