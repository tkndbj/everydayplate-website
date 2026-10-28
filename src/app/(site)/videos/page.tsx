import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { VideoCard } from "@/components/cards/VideoCard";
import { EmptyState, PageIntro, Pagination } from "@/components/ui";
import { getVideos, type VideoFormat } from "@/lib/data";
import { cn, firstParam, parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Videos",
  description: "Short cooking videos and full recipe walk-throughs from Everyday Plate.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage({ searchParams }: PageProps<"/videos">) {
  return (
    <>
      <PageIntro eyebrow="Videos" title="Watch, then cook along">
        Quick Shorts for a bit of inspiration, and longer videos when you want to see every step.
      </PageIntro>
      <div className="container-page">
        <Suspense fallback={<VideoSkeleton />}>
          <VideoResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function VideoResults({ searchParams }: Pick<PageProps<"/videos">, "searchParams">) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const requested = firstParam(params.type);
  const format: VideoFormat | "" = requested === "short" || requested === "long" ? requested : "";
  const { items, pageCount, total, shortCount, longCount } = await getVideos(page, format);
  const showTabs = shortCount > 0 && longCount > 0;

  const tabs = [
    { value: "", label: "All", count: shortCount + longCount },
    { value: "short", label: "Shorts", count: shortCount },
    { value: "long", label: "Videos", count: longCount },
  ];

  const shorts = items.filter((v) => v.isShort);
  const long = items.filter((v) => !v.isShort);

  return (
    <>
      {showTabs && (
        <nav aria-label="Filter videos" className="mb-10 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value ? `/videos?type=${tab.value}` : "/videos"}
              className="chip"
              aria-current={format === tab.value ? "page" : undefined}
            >
              {tab.label} <span className="opacity-60">{tab.count}</span>
            </Link>
          ))}
        </nav>
      )}

      {total === 0 ? (
        <EmptyState title="No videos yet">New videos are coming soon.</EmptyState>
      ) : (
        <>
          {long.length > 0 && (
            <div className={cn("grid gap-6 md:grid-cols-2", shorts.length > 0 && "mb-14")}>
              {long.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
          {shorts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {shorts.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
          <Pagination page={page} pageCount={pageCount} basePath="/videos" params={{ type: format }} />
        </>
      )}
    </>
  );
}

function VideoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="aspect-[9/16] animate-pulse rounded-[var(--radius-card)] bg-sand" />
      ))}
    </div>
  );
}
