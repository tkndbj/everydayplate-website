import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Img } from "@/components/Img";
import { PortableBody } from "@/components/PortableBody";
import { SocialLinks } from "@/components/SocialLinks";
import { JsonLd } from "@/components/ui";
import { getSettings } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Mustafa",
  description: "Meet Mustafa Özdeşer — the self-taught Cypriot cook behind Everyday Plate.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSettings();
  const sameAs = Object.entries(settings.social)
    .filter(([key, value]) => key !== "email" && value)
    .map(([, value]) => value);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.author,
          jobTitle: "Self-taught chef",
          url: `${site.url}/about`,
          sameAs,
        }}
      />
      <section className="container-page grid gap-12 pb-8 pt-12 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand shadow-[var(--shadow-lift)]">
            <Img image={settings.portrait} sizes="(min-width: 1024px) 40vw, 100vw" preload />
          </div>
          <SocialLinks social={settings.social} className="mt-6 text-ink" />
        </div>

        <div>
          <p className="eyebrow animate-fade-up">About</p>
          <h1 className="mt-3 animate-fade-up text-5xl leading-[1.05] text-ink sm:text-6xl">
            Hello, I’m Mustafa<span className="text-terracotta">.</span>
          </h1>
          {settings.aboutShort && (
            <p className="mt-6 animate-fade-up font-serif text-2xl leading-snug text-ink-soft">{settings.aboutShort}</p>
          )}
          <PortableBody value={settings.aboutBody} className="mt-10" />
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/recipes" className="btn btn-primary">
              Start cooking <ArrowRight className="size-4" />
            </Link>
            <Link href="/videos" className="btn btn-ghost">
              Watch my videos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
