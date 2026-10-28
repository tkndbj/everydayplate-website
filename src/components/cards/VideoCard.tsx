import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoCard as VideoCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Img } from "../Img";

interface Props {
  video: VideoCardData;
  className?: string;
  sizes?: string;
}

/** Vertical card for Shorts, wide card for regular videos. */
export function VideoCard({ video, className, sizes }: Props) {
  const short = video.isShort;
  return (
    <article className={cn("group relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card)] bg-ink shadow-[var(--shadow-soft)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-lift)]",
          short ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        <Img
          image={video.thumbnail}
          sizes={sizes ?? (short ? "(min-width: 1024px) 16vw, (min-width: 640px) 28vw, 45vw" : "(min-width: 1024px) 45vw, 92vw")}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-terracotta shadow-lg backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-paper">
          <Play className="ml-0.5 size-6 fill-current" />
        </span>
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
      </div>
    </article>
  );
}
