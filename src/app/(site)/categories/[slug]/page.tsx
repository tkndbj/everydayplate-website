import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { EmptyState, GridSkeleton, PageIntro, SectionHeader } from "@/components/ui";
import { getCategories, getCategoryPage } from "@/lib/data";
import { toStaticParams } from "@/lib/utils";

export async function generateStaticParams() {
  return toStaticParams((await getCategories()).map((c) => c.slug));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryPage(slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  return {
    title: category.title,
    description: category.description ?? `${category.title} recipes, videos and stories from Everyday Plate.`,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="container-page pt-16">
          <div className="mb-12 h-16 w-2/3 animate-pulse rounded-xl bg-sand" />
          <GridSkeleton />
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: Pick<PageProps<"/categories/[slug]">, "params">) {
  const { slug } = await params;
  const category = await getCategoryPage(slug);
  if (!category) notFound();
  const { recipes, videos, posts, recipeTotal } = category;
  const shorts = videos.filter((v) => v.isShort);
  const long = videos.filter((v) => !v.isShort);

  return (
    <>
      <PageIntro eyebrow="Category" title={category.title}>
        {category.description}
      </PageIntro>

      <div className="container-page space-y-20">
        {!recipes.length && !videos.length && !posts.length && (
          <EmptyState title="Nothing here yet">
            <Link href="/recipes" className="text-terracotta underline underline-offset-4">
              Browse all recipes
            </Link>
          </EmptyState>
        )}

        {recipes.length > 0 && (
          <section>
            <SectionHeader title="Recipes" />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((r, i) => (
                <RecipeCard key={r._id} recipe={r} preload={i < 3} />
              ))}
            </div>
            {recipeTotal > recipes.length && (
              <Link href={`/recipes?category=${category.slug}`} className="btn btn-ghost mt-10">
                See all {recipeTotal} recipes <ArrowRight className="size-4" />
              </Link>
            )}
          </section>
        )}

        {videos.length > 0 && (
          <section>
            <SectionHeader title="Videos" href="/videos" linkLabel="All videos" />
            {long.length > 0 && (
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                {long.map((v) => (
                  <VideoCard key={v._id} video={v} />
                ))}
              </div>
            )}
            {shorts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {shorts.map((v) => (
                  <VideoCard key={v._id} video={v} />
                ))}
              </div>
            )}
          </section>
        )}

        {posts.length > 0 && (
          <section>
            <SectionHeader title="Stories" />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <StoryCard key={p._id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
