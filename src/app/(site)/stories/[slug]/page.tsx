import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoryCard } from "@/components/cards/StoryCard";
import { Img } from "@/components/Img";
import { PortableBody } from "@/components/PortableBody";
import { RichText } from "@/components/RichText";
import { ShareActions } from "@/components/recipe/ShareActions";
import { JsonLd, SectionHeader } from "@/components/ui";
import { getPost, getSlugs } from "@/lib/data";
import { toPlainText } from "@/lib/rich-text";
import { site } from "@/lib/site";
import { formatDate, toStaticParams } from "@/lib/utils";

export async function generateStaticParams() {
  return toStaticParams(await getSlugs("post"));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) return { title: "Story not found", robots: { index: false } };
  const { post } = data;
  return {
    title: post.title,
    description: toPlainText(post.excerpt) || undefined,
    alternates: { canonical: `/stories/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: toPlainText(post.excerpt) || undefined,
      publishedTime: post.publishedAt,
      authors: [site.author],
      images: post.image ? [{ url: post.image.src, alt: post.image.alt }] : undefined,
    },
  };
}

export default function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page mt-14 h-96 max-w-3xl animate-pulse rounded-[2rem] bg-sand" />}>
      <StoryContent params={params} />
    </Suspense>
  );
}

async function StoryContent({ params }: Pick<PageProps<"/stories/[slug]">, "params">) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();
  const { post, more } = data;

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: toPlainText(post.excerpt) || undefined,
          image: post.image?.src,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Person", name: site.author },
        }}
      />

      <header className="container-page max-w-4xl pt-12 text-center sm:pt-16">
        <Link href="/stories" className="text-sm text-muted hover:text-terracotta">
          ← All stories
        </Link>
        <p className="eyebrow mt-6 animate-fade-up">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <h1 className="mt-4 animate-fade-up text-4xl leading-[1.08] text-ink sm:text-6xl">{post.title}</h1>
        <RichText
          value={post.excerpt}
          className="mx-auto mt-6 max-w-2xl animate-fade-up text-xl leading-relaxed text-muted"
        />
      </header>

      {post.image && (
        <div className="container-page mt-12 max-w-6xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-sand shadow-[var(--shadow-lift)]">
            <Img image={post.image} sizes="(min-width: 1200px) 1150px, 100vw" preload />
          </div>
        </div>
      )}

      <div className="container-page mt-14 max-w-3xl">
        <PortableBody value={post.body} />
        <div className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-8">
          <p className="text-sm text-muted">
            Written by <span className="font-medium text-ink">{site.author}</span>
          </p>
          <ShareActions title={post.title} />
        </div>
      </div>

      {more.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeader eyebrow="Keep reading" title="More stories" href="/stories" linkLabel="All stories" />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <StoryCard key={p._id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
