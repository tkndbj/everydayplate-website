import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export { metadata, viewport } from "next-sanity/studio";

/** The admin panel lives here: /studio */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream p-6">
        <div className="max-w-lg rounded-[var(--radius-card)] bg-paper p-8 shadow-[var(--shadow-soft)] ring-1 ring-line">
          <h1 className="text-3xl text-ink">Admin panel not connected yet</h1>
          <p className="mt-4 leading-relaxed text-muted">
            Add <code className="rounded bg-sand px-1.5 py-0.5 text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to the
            environment variables (see README → “Connect the admin panel”) and redeploy. Until then the website shows
            demo content.
          </p>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
