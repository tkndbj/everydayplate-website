import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { ShareActions } from "@/components/recipe/ShareActions";
import { RichText } from "@/components/RichText";
import { JsonLd, SectionHeader } from "@/components/ui";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { getSlugs, getVideo } from "@/lib/data";
import { toPlainText } from "@/lib/rich-text";
import { cn, formatDate, toStaticParams } from "@/lib/utils";

export async function generateStaticParams() {
  return toStaticParams(await getSlugs("video"));
}

export async function generateMetadata({ params }: PageProps<"/videos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getVideo(slug);
  if (!data) return { title: "Video not found", robots: { index: false } };
  const { video } = data;
  return {
    title: video.title,
    description: toPlainText(video.description) || undefined,
    alternates: { canonical: `/videos/${video.slug}` },
    openGraph: {
      type: "video.other",
      title: video.title,
      description: toPlainText(video.description) || undefined,
      images: video.thumbnail ? [{ url: video.thumbnail.src }] : undefined,
    },
  };
}

export default function VideoPage({ params }: PageProps<"/videos/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page mt-14 aspect-video max-w-4xl animate-pulse rounded-[2rem] bg-sand" />}>
      <VideoContent params={params} />
    </Suspense>
  );
}

async function VideoContent({ params }: Pick<PageProps<"/videos/[slug]">, "params">) {
  const { slug } = await params;
  const data = await getVideo(slug);
  if (!data) notFound();
  const { video } = data;
  const more = data.more.filter((v) => v.isShort === video.isShort).slice(0, 5);

  return (
    <article>
      {video.youtubeId && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: toPlainText(video.description) || video.title,
            thumbnailUrl: video.thumbnail?.src,
            uploadDate: video.publishedAt,
            embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
          }}
        />
      )}

      <div
        className={cn(
          "container-page grid gap-10 pt-10 sm:pt-14",
          video.isShort ? "md:grid-cols-[22rem_1fr] md:items-start lg:gap-16" : "max-w-5xl",
        )}
      >
        <YouTubePlayer id={video.youtubeId} title={video.title} short={video.isShort} className="animate-fade-up" />

        <div className="animate-fade-up [animation-delay:100ms]">
          <Link href="/videos" className="text-sm text-muted hover:text-terracotta">
            ← All videos
          </Link>
          <p className="eyebrow mt-6">{video.isShort ? "Short" : "Video"} · {formatDate(video.publishedAt)}</p>
          <h1 className="mt-3 text-4xl leading-tight text-ink sm:text-5xl">{video.title}</h1>
          <RichText value={video.description} className="mt-5 text-lg leading-relaxed text-muted" />
          <div className="mt-6 flex flex-wrap gap-2">
            {video.categories.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="chip">
                {c.title}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <ShareActions title={video.title} />
          </div>

          {video.recipe && (
            <div className="mt-10 rounded-[var(--radius-card)] bg-paper p-5 shadow-[var(--shadow-soft)] ring-1 ring-line">
              <p className="eyebrow mb-4 flex items-center gap-2">
                Get the full recipe <ArrowRight className="size-3.5" />
              </p>
              <RecipeCard recipe={video.recipe} sizes="(min-width: 768px) 30vw, 90vw" />
            </div>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeader eyebrow="Keep watching" title="More videos" href="/videos" linkLabel="All videos" />
          {video.isShort ? (
            <div className="rail auto-cols-[44%] sm:auto-cols-[28%] lg:auto-cols-[calc((100%-4rem)/5)]">
              {more.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.slice(0, 3).map((v) => (
                <VideoCard key={v._id} video={v} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw" />
              ))}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
