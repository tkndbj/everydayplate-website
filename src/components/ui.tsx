import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  className,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-6", className)}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold text-ink-soft transition hover:text-terracotta"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container-page pb-10 pt-12 sm:pt-16", className)}>
      {eyebrow && <p className="eyebrow animate-fade-up">{eyebrow}</p>}
      <h1 className="mt-3 max-w-3xl animate-fade-up text-4xl leading-[1.08] text-ink sm:text-6xl">{title}</h1>
      {children && (
        <div className="mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted [animation-delay:80ms]">
          {children}
        </div>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-sand-deep bg-paper/60 px-6 py-16 text-center">
      <p className="font-serif text-2xl text-ink">{title}</p>
      {children && <div className="mx-auto mt-3 max-w-md text-muted">{children}</div>}
    </div>
  );
}

/** Builds pagination links while keeping other query params (e.g. category). */
export function Pagination({
  page,
  pageCount,
  basePath,
  params = {},
}: {
  page: number;
  pageCount: number;
  basePath: string;
  params?: Record<string, string>;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams({ ...params, ...(p > 1 ? { page: String(p) } : {}) });
    for (const [k, v] of [...qs]) if (!v) qs.delete(k);
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  const linkCls =
    "grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold transition ring-1 ring-line bg-paper hover:ring-ink-soft";

  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 && (
        <Link href={href(page - 1)} className={linkCls} aria-label="Previous page">
          <ArrowLeft className="size-4" />
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(linkCls, p === page && "bg-ink text-paper ring-ink hover:ring-ink")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pageCount && (
        <Link href={href(page + 1)} className={linkCls} aria-label="Next page">
          <ArrowRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}

export function GridSkeleton({ count = 6, aspect = "aspect-[4/3]" }: { count?: number; aspect?: string }) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className={cn(aspect, "animate-pulse rounded-[var(--radius-card)] bg-sand")} />
          <div className="mt-4 h-3 w-24 animate-pulse rounded bg-sand" />
          <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-sand" />
        </div>
      ))}
    </div>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inlined; "<" is escaped so content can't break out of the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
