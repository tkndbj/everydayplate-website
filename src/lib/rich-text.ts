import type { PortableTextBlock } from "next-sanity";

/**
 * Text from the admin's formatted boxes (Portable Text). Plain strings are
 * still accepted — the demo content and anything written before the
 * formatting toolbar existed — and become one paragraph per line.
 */
export type RichText = PortableTextBlock[] | string | string[];

type Span = { _type?: string; text?: string };
type TextBlock = PortableTextBlock & { style?: string; children?: Span[] };

const paragraph = (text: string, i: number): PortableTextBlock =>
  ({
    _type: "block",
    _key: `plain-${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s", text, marks: [] }],
  }) as PortableTextBlock;

export function toBlocks(value?: RichText | null): PortableTextBlock[] {
  if (!value) return [];
  if (typeof value === "string") value = value.split(/\r?\n/);
  return value
    .map((item, i) => (typeof item === "string" ? (item.trim() ? paragraph(item.trim(), i) : null) : item))
    .filter((block): block is PortableTextBlock => Boolean(block) && !isEmptyBlock(block!));
}

export function blockText(block: PortableTextBlock): string {
  const children = (block as TextBlock).children;
  return Array.isArray(children) ? children.map((c) => c.text ?? "").join("") : "";
}

const isEmptyBlock = (block: PortableTextBlock) => block._type === "block" && !blockText(block).trim();

/** One-line plain text, for cards, meta descriptions and structured data. */
export function toPlainText(value?: RichText | null): string {
  return toBlocks(value).map(blockText).join(" ").replace(/\s+/g, " ").trim();
}

export interface IngredientSection {
  title?: PortableTextBlock;
  items: PortableTextBlock[];
}

/** Splits the ingredient list into sections at each heading line (or a line starting with #). */
export function ingredientSections(value?: RichText | null): IngredientSection[] {
  const sections: IngredientSection[] = [];
  let current: IngredientSection = { items: [] };
  for (const block of toBlocks(value)) {
    const text = blockText(block).trim();
    const style = (block as TextBlock).style ?? "";
    if (style.startsWith("h") || text.startsWith("#")) {
      if (current.items.length || current.title) sections.push(current);
      current = { title: text.startsWith("#") ? stripHash(block) : block, items: [] };
    } else {
      current.items.push(text.match(/^[-•*·]\s/) ? stripBullet(block) : block);
    }
  }
  if (current.items.length || current.title) sections.push(current);
  return sections;
}

function mapFirstSpan(block: PortableTextBlock, fn: (text: string) => string): PortableTextBlock {
  const children = [...((block as TextBlock).children ?? [])];
  if (children[0]) children[0] = { ...children[0], text: fn(children[0].text ?? "") };
  return { ...block, children } as PortableTextBlock;
}

const stripHash = (block: PortableTextBlock) => mapFirstSpan(block, (t) => t.replace(/^\s*#+\s*/, ""));
const stripBullet = (block: PortableTextBlock) => mapFirstSpan(block, (t) => t.replace(/^\s*[-•*·]\s*/, ""));
