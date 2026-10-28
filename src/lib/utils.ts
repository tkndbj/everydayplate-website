export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function formatMinutes(total?: number): string | null {
  if (!total) return null;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/** ISO 8601 duration for recipe structured data, e.g. 90 → "PT1H30M". */
export function isoDuration(minutes?: number): string | undefined {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}

export const difficultyLabel = { easy: "Easy", medium: "Medium", hard: "Challenging" } as const;

export interface IngredientSection {
  title?: string;
  items: string[];
}

/** Parses the "one ingredient per line, # for headings" text into sections. */
export function parseIngredients(text: string): IngredientSection[] {
  const sections: IngredientSection[] = [];
  let current: IngredientSection = { items: [] };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^[\s\-•*·]+/, "").trim();
    if (!line) continue;
    if (raw.trim().startsWith("#")) {
      if (current.items.length || current.title) sections.push(current);
      current = { title: line.replace(/^#+\s*/, ""), items: [] };
    } else {
      current.items.push(line);
    }
  }
  if (current.items.length || current.title) sections.push(current);
  return sections;
}

export function parsePage(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 && n < 10_000 ? n : 1;
}

export function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** generateStaticParams must return at least one entry with Cache Components. */
export function toStaticParams(slugs: string[]): { slug: string }[] {
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "__placeholder__" }];
}
