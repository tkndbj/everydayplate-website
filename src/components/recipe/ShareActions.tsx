"use client";

import { Check, Printer, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareActions({ title, print = false }: { title: string; print?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User closed the share sheet.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button type="button" onClick={share} className="btn btn-ghost !py-2.5 text-sm">
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
        {copied ? "Link copied" : "Share"}
      </button>
      {print && (
        <button type="button" onClick={() => window.print()} className="btn btn-ghost !py-2.5 text-sm">
          <Printer className="size-4" /> Print
        </button>
      )}
    </div>
  );
}
