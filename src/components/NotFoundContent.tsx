import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NotFoundContent() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-5xl text-ink sm:text-6xl">This plate is empty</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          We couldn’t find that page — it may have moved, or the link might be mistyped.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/recipes" className="btn btn-primary">
            Browse recipes <ArrowRight className="size-4" />
          </Link>
          <Link href="/" className="btn btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
