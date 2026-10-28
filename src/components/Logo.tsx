import Link from "next/link";
import { cn } from "@/lib/utils";
import { PlateMark } from "./icons";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Everyday Plate — home">
      <PlateMark className="size-8 shrink-0 transition-transform duration-500 group-hover:rotate-[20deg]" />
      <span className="leading-none">
        <span
          className={cn(
            "block font-serif text-[1.35rem] font-semibold tracking-tight",
            tone === "dark" ? "text-ink" : "text-paper",
          )}
        >
          Everyday Plate
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[0.62rem] font-medium uppercase tracking-[0.22em]",
            tone === "dark" ? "text-muted" : "text-paper/70",
          )}
        >
          by Mustafa Özdeşer
        </span>
      </span>
    </Link>
  );
}
