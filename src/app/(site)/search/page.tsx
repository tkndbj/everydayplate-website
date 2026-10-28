import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Suspense } from "react";
import { Img } from "@/components/Img";
import { EmptyState, PageIntro } from "@/components/ui";
import { search } from "@/lib/data";
import type { SearchResult } from "@/lib/types";
import { firstParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

const TYPE = {
  recipe: { label: "Recipe", path: "/recipes" },
  video: { label: "Video", path: "/videos" },
  post: { label: "Story", path: "/stories" },
} as const;

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <PageIntro eyebrow="Search" title="What would you like to cook?" />
      <div className="container-page max-w-3xl">
        <Suspense fallback={<SearchForm />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" role="search" className="relative">
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Try “halloumi”, “chicken” or “dessert”"
        aria-label="Search recipes, videos and stories"
        autoFocus={!defaultValue}
        className="w-full rounded-full bg-paper py-4 pl-14 pr-32 text-lg shadow-[var(--shadow-soft)] ring-1 ring-line placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-terracotta"
      />
      <button type="submit" className="btn btn-primary absolute right-2 top-1/2 -translate-y-1/2 !py-2.5">
        Search
      </button>
    </form>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const q = firstParam((await searchParams).q);
  const results = q ? await search(q) : [];

  return (
    <>
      <SearchForm key={q} defaultValue={q} />
      <div className="mt-10">
        {q && !results.length && (
          <EmptyState title={`Nothing found for “${q}”`}>Try a simpler word, or browse all recipes.</EmptyState>
        )}
        {results.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted">
              {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
            </p>
            <ul className="divide-y divide-line">
              {results.map((r) => (
                <ResultRow key={r._id} result={r} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

function ResultRow({ result }: { result: SearchResult }) {
  const type = TYPE[result._type];
  return (
    <li className="group relative flex items-center gap-5 py-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-sand sm:size-24">
        <Img image={result.image} sizes="96px" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">{type.label}</p>
        <h2 className="mt-1 font-serif text-xl leading-snug text-ink group-hover:text-terracotta-dark">
          <Link href={`${type.path}/${result.slug}`} className="after:absolute after:inset-0">
            {result.title}
          </Link>
        </h2>
        {result.excerpt && <p className="mt-1 line-clamp-1 text-sm text-muted">{result.excerpt}</p>}
      </div>
    </li>
  );
}
