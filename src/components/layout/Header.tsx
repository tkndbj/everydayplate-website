import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "../Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur-md supports-[backdrop-filter]:bg-cream/75">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <nav className="container-page flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
        <Logo />
        <div className="flex items-center gap-1">
          <NavLinks />
          <Link
            href="/search"
            aria-label="Search"
            className="grid size-11 place-items-center rounded-full text-ink-soft transition hover:bg-sand hover:text-ink"
          >
            <Search className="size-5" />
          </Link>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
