import type { Metadata } from "next";
import { Suspense } from "react";
import { StoryCard } from "@/components/cards/StoryCard";
import { EmptyState, GridSkeleton, PageIntro, Pagination } from "@/components/ui";
import { getPosts } from "@/lib/data";
import { parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stories",
  description: "Kitchen stories, food memories and cooking notes from Mustafa Özdeşer.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage({ searchParams }: PageProps<"/stories">) {
  return (
    <>
      <PageIntro eyebrow="Stories" title="Notes from my kitchen">
        Food memories, cooking lessons and the stories behind the recipes.
      </PageIntro>
      <div className="container-page">
        <Suspense fallback={<GridSkeleton aspect="aspect-[3/2]" />}>
          <StoryResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function StoryResults({ searchParams }: Pick<PageProps<"/stories">, "searchParams">) {
  const page = parsePage((await searchParams).page);
  const { items, pageCount } = await getPosts(page);

  if (!items.length) return <EmptyState title="No stories yet">The first story is on its way.</EmptyState>;

  return (
    <>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <StoryCard key={post._id} post={post} />
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} basePath="/stories" />
    </>
  );
}
