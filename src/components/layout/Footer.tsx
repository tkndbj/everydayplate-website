import { cacheLife } from "next/cache";
import Link from "next/link";
import { getCategories, getSettings } from "@/lib/data";
import { nav, site } from "@/lib/site";
import { Logo } from "../Logo";
import { SocialLinks } from "../SocialLinks";

export async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const topCategories = categories.filter((c) => c.count > 0).slice(0, 6);

  return (
    <footer className="mt-24 bg-ink text-paper/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-paper/70">{settings.tagline}</p>
          <SocialLinks social={settings.social} className="mt-6 text-paper" />
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-paper">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search" className="transition hover:text-paper">
                Search
              </Link>
            </li>
          </ul>
        </div>

        {topCategories.length > 0 && (
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Categories</h2>
            <ul className="mt-4 space-y-2.5">
              {topCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="transition hover:text-paper">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.name} · {site.author}
          </p>
          <Link href="/studio" className="transition hover:text-paper" prefetch={false}>
            Kitchen login
          </Link>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
