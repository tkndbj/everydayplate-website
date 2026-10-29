import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { EmptyState, GridSkeleton, PageIntro, Pagination } from "@/components/ui";
import { getCategories, getRecipes } from "@/lib/data";
import { firstParam, parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Every recipe from Everyday Plate — Cypriot classics, meze, quick dinners and sweet things.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage({ searchParams }: PageProps<"/recipes">) {
  return (
    <>
      <PageIntro eyebrow="Recipes" title="Cook something good today">
        Tried-and-tested recipes from my kitchen — from slow Sunday classics to 20-minute weeknight dinners.
      </PageIntro>
      <div className="container-page">
        <Suspense
          fallback={
            <>
              <div className="mb-10 h-10 w-full max-w-xl animate-pulse rounded-full bg-sand" />
              <GridSkeleton />
            </>
          }
        >
          <RecipeResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function RecipeResults({ searchParams }: Pick<PageProps<"/recipes">, "searchParams">) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const category = firstParam(params.category);
  const [{ items, pageCount, total }, categories] = await Promise.all([getRecipes(page, category), getCategories()]);
  const used = categories.filter((c) => c.recipeCount > 0);
  const active = used.find((c) => c.slug === category);
  const main = used.filter((c) => !c.parent);
  // Once a main category (or one of its sub-categories) is picked, its sub-categories show as a second row.
  const openSlug = active?.parent?.slug ?? active?.slug;
  const subs = openSlug ? used.filter((c) => c.parent?.slug === openSlug) : [];

  return (
    <>
      {used.length > 0 && (
        <nav aria-label="Filter by category" className="rail -mx-4 mb-10 auto-cols-max px-4 sm:mx-0 sm:flex sm:flex-wrap sm:gap-2 sm:px-0">
          <Link href="/recipes" className="chip" aria-current={!category ? "page" : undefined}>
            All
          </Link>
          {main.map((c) => (
            <Link
              key={c.slug}
              href={`/recipes?category=${c.slug}`}
              className="chip"
              aria-current={c.slug === openSlug ? "page" : undefined}
            >
              {c.title}
            </Link>
          ))}
        </nav>
      )}

      {subs.length > 0 && (
        <nav
          aria-label="Filter by sub-category"
          className="rail -mx-4 -mt-6 mb-10 auto-cols-max px-4 sm:mx-0 sm:flex sm:flex-wrap sm:gap-2 sm:px-0"
        >
          {subs.map((c) => (
            <Link
              key={c.slug}
              href={`/recipes?category=${c.slug}`}
              className="chip text-sm"
              aria-current={c.slug === category ? "page" : undefined}
            >
              {c.title}
            </Link>
          ))}
        </nav>
      )}

      {items.length ? (
        <>
          <p className="mb-6 text-sm text-muted">
            {total} {total === 1 ? "recipe" : "recipes"}
            {active ? ` in ${active.title}` : ""}
          </p>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((recipe, i) => (
              <RecipeCard key={recipe._id} recipe={recipe} preload={i < 3} />
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} basePath="/recipes" params={{ category }} />
        </>
      ) : (
        <EmptyState title="No recipes here yet">
          {category ? (
            <Link href="/recipes" className="text-terracotta underline underline-offset-4">
              See all recipes
            </Link>
          ) : (
            "New recipes are on their way — check back soon."
          )}
        </EmptyState>
      )}
    </>
  );
}
