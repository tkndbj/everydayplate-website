import Link from "next/link";
import { toPlainText } from "@/lib/rich-text";
import type { PostCard } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Img } from "../Img";

interface Props {
  post: PostCard;
  className?: string;
  layout?: "stacked" | "row";
}

export function StoryCard({ post, className, layout = "stacked" }: Props) {
  const row = layout === "row";
  const excerpt = toPlainText(post.excerpt);
  return (
    <article className={cn("group relative", row ? "grid grid-cols-[7rem_1fr] items-center gap-5 sm:grid-cols-[10rem_1fr]" : "flex flex-col", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card)] bg-sand",
          row ? "aspect-square" : "aspect-[3/2]",
        )}
      >
        <Img
          image={post.image}
          sizes={row ? "160px" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className={row ? "" : "px-1 pt-4"}>
        <time dateTime={post.publishedAt} className="text-xs font-medium uppercase tracking-[0.14em] text-olive">
          {formatDate(post.publishedAt)}
        </time>
        <h3
          className={cn(
            "mt-2 font-serif leading-snug text-ink transition-colors group-hover:text-terracotta-dark",
            row ? "text-lg sm:text-xl" : "text-xl",
          )}
        >
          <Link href={`/stories/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {excerpt && !row && (
          <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted">{excerpt}</p>
        )}
      </div>
    </article>
  );
}
