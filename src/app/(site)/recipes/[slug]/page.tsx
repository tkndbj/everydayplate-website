import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChefHat, Clock, Flame, Lightbulb, Users } from "lucide-react";
import { Suspense } from "react";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { Img } from "@/components/Img";
import { PortableBody } from "@/components/PortableBody";
import { InlineText, RichText } from "@/components/RichText";
import { IngredientList } from "@/components/recipe/IngredientList";
import { ShareActions } from "@/components/recipe/ShareActions";
import { JsonLd, SectionHeader } from "@/components/ui";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { getRecipe, getSlugs } from "@/lib/data";
import { blockText, ingredientSections, methodSections, toBlocks, toPlainText } from "@/lib/rich-text";
import { site } from "@/lib/site";
import {
  difficultyLabel,
  formatDate,
  formatMinutes,
  isoDuration,
  toStaticParams,
} from "@/lib/utils";
import { getYouTubeId, isYouTubeShort, youTubeThumbnail } from "@/lib/youtube";

export async function generateStaticParams() {
  return toStaticParams(await getSlugs("recipe"));
}

export async function generateMetadata({ params }: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRecipe(slug);
  if (!data) return { title: "Recipe not found", robots: { index: false } };
  const { recipe } = data;
  return {
    title: recipe.title,
    description: toPlainText(recipe.excerpt) || undefined,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      type: "article",
      title: recipe.title,
      description: toPlainText(recipe.excerpt) || undefined,
      publishedTime: recipe.publishedAt,
      images: recipe.image ? [{ url: ogUrl(recipe.image.src), width: 1200, height: 630, alt: recipe.image.alt }] : undefined,
    },
  };
}

export default function RecipePage({ params }: PageProps<"/recipes/[slug]">) {
  return (
    <Suspense fallback={<RecipeSkeleton />}>
      <RecipeContent params={params} />
    </Suspense>
  );
}

async function RecipeContent({ params }: Pick<PageProps<"/recipes/[slug]">, "params">) {
  const { slug } = await params;
  const data = await getRecipe(slug);
  if (!data) notFound();
  const { recipe, related } = data;

  const total = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  const sections = ingredientSections(recipe.ingredients);
  const method = methodSections(recipe.steps);
  const steps = method.flatMap((section) => section.steps);
  const excerpt = toPlainText(recipe.excerpt);
  // The main video first, then any extra ones; links YouTube can't read are skipped.
  const videos = [recipe.youtubeUrl, ...(recipe.moreVideos ?? [])]
    .map((url) => ({ url, id: getYouTubeId(url) }))
    .filter((v): v is { url: string; id: string } => Boolean(v.id));
  const [mainVideo, ...moreVideos] = videos;

  const facts = [
    recipe.prepTime && { icon: ChefHat, label: "Prep", value: formatMinutes(recipe.prepTime) },
    recipe.cookTime && { icon: Flame, label: "Cook", value: formatMinutes(recipe.cookTime) },
    total && { icon: Clock, label: "Total", value: formatMinutes(total) },
    recipe.servings && { icon: Users, label: "Serves", value: String(recipe.servings) },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipe.title,
          description: excerpt || undefined,
          image: recipe.image ? [ogUrl(recipe.image.src)] : undefined,
          author: { "@type": "Person", name: site.author },
          datePublished: recipe.publishedAt,
          dateModified: recipe.updatedAt,
          prepTime: isoDuration(recipe.prepTime),
          cookTime: isoDuration(recipe.cookTime),
          totalTime: isoDuration(total),
          recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
          recipeCategory: recipe.categories[0]?.title,
          recipeCuisine: "Cypriot",
          recipeIngredient: sections.flatMap((s) => s.items.map((item) => blockText(item.block))),
          recipeInstructions: steps.map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            text: step.map(blockText).join(" "),
          })),
          video: videos.length
            ? videos.map(({ id }) => ({
                "@type": "VideoObject",
                name: recipe.title,
                description: excerpt || recipe.title,
                thumbnailUrl: youTubeThumbnail(id),
                embedUrl: `https://www.youtube.com/embed/${id}`,
                uploadDate: recipe.publishedAt,
              }))
            : undefined,
        }}
      />

      {/* Header */}
      <header className="container-page grid gap-10 pb-12 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
        <div className="animate-fade-up">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/recipes" className="hover:text-terracotta">
              Recipes
            </Link>
            {recipe.categories[0]?.parent && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/categories/${recipe.categories[0].parent.slug}`} className="hover:text-terracotta">
                  {recipe.categories[0].parent.title}
                </Link>
              </>
            )}
            {recipe.categories[0] && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/categories/${recipe.categories[0].slug}`} className="hover:text-terracotta">
                  {recipe.categories[0].title}
                </Link>
              </>
            )}
          </nav>
          <h1 className="mt-4 text-4xl leading-[1.05] text-ink sm:text-6xl">{recipe.title}</h1>
          <RichText value={recipe.excerpt} className="mt-5 text-lg leading-relaxed text-muted" />

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-paper px-4 py-4">
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted">
                    <Icon className="size-3.5 text-terracotta" /> {label}
                  </dt>
                  <dd className="mt-1 font-serif text-lg text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {recipe.difficulty && (
              <span className="rounded-full bg-olive-soft px-3 py-1 text-sm font-medium text-olive">
                {difficultyLabel[recipe.difficulty]}
              </span>
            )}
            <span className="text-sm text-muted">{formatDate(recipe.publishedAt)}</span>
            <ShareActions title={recipe.title} print />
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-sand shadow-[var(--shadow-lift)] animate-fade-up [animation-delay:100ms]">
          <Img image={recipe.image} sizes="(min-width: 1024px) 52vw, 100vw" preload />
        </div>
      </header>

      {recipe.intro?.length ? (
        <div className="container-page">
          <PortableBody value={recipe.intro} className="mx-auto max-w-3xl border-y border-line py-10" />
        </div>
      ) : null}

      {/* Body */}
      <div className="container-page mt-12 grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-card)] bg-paper p-6 shadow-[var(--shadow-soft)] ring-1 ring-line sm:p-8">
            <h2 className="text-2xl text-ink">Ingredients</h2>
            {recipe.servings && <p className="mt-1 text-sm text-muted">Serves {recipe.servings}</p>}
            <div className="mt-6">
              <IngredientList
                sections={sections.map((s) => ({
                  title: s.title && <InlineText block={s.title} />,
                  items: s.items.map((item) => ({
                    content: <InlineText block={item.block} />,
                    number: item.number,
                    indent: item.indent,
                  })),
                }))}
              />
            </div>
          </div>
        </aside>

        <div>
          {mainVideo && (
            <div className="no-print mb-12 space-y-6">
              <YouTubePlayer id={mainVideo.id} title={recipe.title} short={isYouTubeShort(mainVideo.url)} />
              {moreVideos.length > 0 && (
                <div className="grid items-start gap-6 sm:grid-cols-2">
                  {moreVideos.map((v, i) => (
                    <YouTubePlayer
                      key={v.id}
                      id={v.id}
                      title={`${recipe.title} – video ${i + 2}`}
                      short={isYouTubeShort(v.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <h2 className="text-3xl text-ink">Method</h2>
          <div className="mt-8 space-y-10">
            {method.map((section, s) => {
              // Step numbers carry on from one heading to the next.
              const first = method.slice(0, s).reduce((n, prev) => n + prev.steps.length, 1);
              return (
                <section key={s}>
                  {section.title && (
                    <h3 className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-olive">
                      <InlineText block={section.title} />
                    </h3>
                  )}
                  <ol start={first} className="space-y-8">
                    {section.steps.map((step, i) => (
                      <li key={step[0]._key ?? i} className="grid grid-cols-[2.75rem_1fr] gap-4">
                        <span className="grid size-11 place-items-center rounded-full bg-terracotta-soft font-serif text-lg font-semibold text-terracotta-dark">
                          {first + i}
                        </span>
                        <RichText value={step} className="pt-2 text-[1.0625rem] leading-relaxed text-ink-soft" />
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>

          {toBlocks(recipe.tips).length > 0 && (
            <div className="mt-12 rounded-[var(--radius-card)] bg-olive-soft/70 p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-2xl text-ink">
                <Lightbulb className="size-6 text-olive" /> Chef’s tips
              </h2>
              <RichText value={recipe.tips} className="mt-4 leading-relaxed text-ink-soft" />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="no-print container-page mt-24">
          <SectionHeader eyebrow="Keep cooking" title="You might also like" href="/recipes" linkLabel="All recipes" />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RecipeCard key={r._id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/** 1200×630 crop for social previews (Sanity and Unsplash both support these params). */
function ogUrl(src: string) {
  const url = new URL(src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("auto", "format");
  return url.href;
}

function RecipeSkeleton() {
  return (
    <div className="container-page grid gap-10 pb-12 pt-14 lg:grid-cols-[1fr_1.1fr]" aria-hidden>
      <div className="space-y-5">
        <div className="h-4 w-32 animate-pulse rounded bg-sand" />
        <div className="h-14 w-full animate-pulse rounded-xl bg-sand" />
        <div className="h-14 w-2/3 animate-pulse rounded-xl bg-sand" />
        <div className="h-20 w-full animate-pulse rounded-2xl bg-sand" />
      </div>
      <div className="aspect-[4/3] animate-pulse rounded-[2rem] bg-sand" />
    </div>
  );
}
