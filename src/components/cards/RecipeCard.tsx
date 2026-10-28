import Link from "next/link";
import { Clock, Play } from "lucide-react";
import { toPlainText } from "@/lib/rich-text";
import type { RecipeCard as RecipeCardData } from "@/lib/types";
import { cn, formatMinutes } from "@/lib/utils";
import { Img } from "../Img";

interface Props {
  recipe: RecipeCardData;
  sizes?: string;
  preload?: boolean;
  className?: string;
}

export function RecipeCard({
  recipe,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw",
  preload,
  className,
}: Props) {
  const time = formatMinutes((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0));
  const category = recipe.categories[0];
  const excerpt = toPlainText(recipe.excerpt);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-sand shadow-[var(--shadow-soft)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-lift)]">
        <Img
          image={recipe.image}
          sizes={sizes}
          preload={preload}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {recipe.hasVideo && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-paper backdrop-blur">
            <Play className="size-3 fill-current" /> Video
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-center gap-3 text-xs font-medium text-muted">
          {category && <span className="uppercase tracking-[0.14em] text-terracotta">{category.title}</span>}
          {time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {time}
            </span>
          )}
        </div>
        <h3 className="mt-2 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-terracotta-dark">
          <Link href={`/recipes/${recipe.slug}`} className="after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </h3>
        {excerpt && <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted">{excerpt}</p>}
      </div>
    </article>
  );
}
