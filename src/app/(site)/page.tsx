import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { RecipeCard } from "@/components/cards/RecipeCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { YouTubeIcon } from "@/components/icons";
import { Img } from "@/components/Img";
import { RichText } from "@/components/RichText";
import { EmptyState, JsonLd, SectionHeader } from "@/components/ui";
import { getHome } from "@/lib/data";
import { toPlainText } from "@/lib/rich-text";
import { site } from "@/lib/site";
import { formatMinutes } from "@/lib/utils";

export default async function HomePage() {
  const { settings, featured, recipes, shorts, longVideos, posts, categories } = await getHome();
  const heroImage = settings.heroImage ?? featured?.image;
  const isEmpty = !featured && !recipes.length && !shorts.length && !posts.length;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          author: { "@type": "Person", name: site.author },
          potentialAction: {
            "@type": "SearchAction",
            target: `${site.url}/search?q={query}`,
            "query-input": "required name=query",
          },
        }}
      />

      {/* ------------------------------------------------------------ Hero */}
      <section className="container-page grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <div className="animate-fade-up">
          <p className="eyebrow">Cypriot home cooking · Self-taught</p>
          <h1 className="mt-4 text-[2.75rem] leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
            {settings.heroTitle}
          </h1>
          <RichText
            value={toPlainText(settings.heroText) ? settings.heroText : settings.tagline}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/recipes" className="btn btn-primary">
              Browse recipes <ArrowRight className="size-4" />
            </Link>
            <Link href="/videos" className="btn btn-ghost">
              Watch videos
            </Link>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative aspect-[4/3.6] overflow-hidden rounded-[2rem] bg-sand shadow-[var(--shadow-lift)] sm:aspect-[4/3.4]">
            <Img image={heroImage} sizes="(min-width: 1024px) 45vw, 100vw" preload />
          </div>
          {featured && (
            <Link
              href={`/recipes/${featured.slug}`}
              className="group absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-2xl bg-paper/95 p-3 pr-5 shadow-[var(--shadow-lift)] ring-1 ring-line backdrop-blur sm:left-auto sm:right-6 sm:w-[22rem]"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                <Img image={featured.image} sizes="64px" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-terracotta">Featured recipe</p>
                <p className="mt-0.5 truncate font-serif text-lg text-ink group-hover:text-terracotta-dark">
                  {featured.title}
                </p>
                {formatMinutes((featured.prepTime ?? 0) + (featured.cookTime ?? 0)) && (
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                    <Clock className="size-3" /> {formatMinutes((featured.prepTime ?? 0) + (featured.cookTime ?? 0))}
                  </p>
                )}
              </div>
              <ArrowRight className="ml-auto size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-terracotta" />
            </Link>
          )}
        </div>
      </section>

      {isEmpty && (
        <section className="container-page pb-16">
          <EmptyState title="The kitchen is warming up">
            New recipes, videos and stories are on their way. Check back soon!
          </EmptyState>
        </section>
      )}

      {/* ------------------------------------------------------ Categories */}
      {categories.length > 0 && (
        <section className="container-page pb-20 pt-6" aria-labelledby="categories-title">
          <h2 id="categories-title" className="sr-only">
            Categories
          </h2>
          <ul className="rail auto-cols-[9.5rem] sm:auto-cols-[11rem] lg:grid-flow-row lg:grid-cols-6 lg:auto-cols-auto">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="group block text-center">
                  <div className="relative mx-auto aspect-square overflow-hidden rounded-full bg-sand ring-4 ring-paper shadow-[var(--shadow-soft)] transition duration-300 group-hover:shadow-[var(--shadow-lift)] group-hover:ring-terracotta-soft">
                    <Img
                      image={c.image}
                      sizes="176px"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-3 font-serif text-lg leading-tight text-ink group-hover:text-terracotta-dark">
                    {c.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {c.count} {c.count === 1 ? "post" : "posts"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --------------------------------------------------- Latest recipes */}
      {recipes.length > 0 && (
        <section className="container-page pb-24">
          <SectionHeader eyebrow="Fresh from the kitchen" title="Latest recipes" href="/recipes" linkLabel="All recipes" />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- Videos */}
      {(shorts.length > 0 || longVideos.length > 0) && (
        <section className="bg-sand/70 py-20">
          <div className="container-page">
            <SectionHeader eyebrow="Watch & cook along" title="Latest videos" href="/videos" linkLabel="All videos" />
            {shorts.length > 0 && (
              <div className="rail -mx-4 auto-cols-[44%] px-4 sm:-mx-6 sm:auto-cols-[28%] sm:px-6 lg:mx-0 lg:auto-cols-[calc((100%-4rem)/5)] lg:px-0">
                {shorts.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
            {longVideos.length > 0 && (
              <div className={longVideos.length > 1 ? "mt-10 grid gap-6 md:grid-cols-2" : "mt-10 max-w-3xl"}>
                {longVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
            {settings.social.youtube && (
              <a
                href={settings.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-10"
              >
                <YouTubeIcon className="size-5 text-[#e62117]" /> Subscribe on YouTube
              </a>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ About */}
      {toPlainText(settings.aboutShort) && (
        <section className="container-page grid items-center gap-10 py-24 md:grid-cols-[0.8fr_1fr] lg:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-sand shadow-[var(--shadow-lift)] md:max-w-none">
            <Img image={settings.portrait} sizes="(min-width: 768px) 40vw, 90vw" />
          </div>
          <div>
            <p className="eyebrow">Hello, I’m Mustafa</p>
            <h2 className="mt-3 text-4xl leading-tight text-ink sm:text-5xl">
              A self-taught cook from <em className="text-terracotta">Cyprus</em>
            </h2>
            <RichText value={settings.aboutShort} className="mt-6 text-lg leading-relaxed text-muted" />
            <Link href="/about" className="btn btn-ghost mt-8">
              Read my story <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- Stories */}
      {posts.length > 0 && (
        <section className="container-page pb-8">
          <SectionHeader eyebrow="From the blog" title="Kitchen stories" href="/stories" linkLabel="All stories" />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StoryCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
