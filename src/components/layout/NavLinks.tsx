"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-1 md:flex">
      {nav.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors",
                active ? "text-terracotta" : "text-ink-soft hover:text-ink",
              )}
            >
              {label}
              {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-terracotta" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
