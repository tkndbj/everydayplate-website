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

export interface IngredientItem {
  block: PortableTextBlock;
  /** "1." for numbered ingredients. */
  number?: string;
  /** 0 for a normal line, 1+ for nested bullets. */
  indent: number;
}

export interface IngredientSection {
  title?: PortableTextBlock;
  items: IngredientItem[];
}

const isHeading = (block: PortableTextBlock) =>
  ((block as TextBlock).style ?? "").startsWith("h") || blockText(block).trim().startsWith("#");

const headingBlock = (block: PortableTextBlock) => (blockText(block).trim().startsWith("#") ? stripHash(block) : block);

/** Splits the ingredient list into sections at each heading line (or a line starting with #). */
export function ingredientSections(value?: RichText | null): IngredientSection[] {
  const sections: IngredientSection[] = [];
  let current: IngredientSection = { items: [] };
  const counters: number[] = [];
  for (const block of toBlocks(value)) {
    const { listItem, level = 1 } = block as TextBlock & { listItem?: string; level?: number };
    if (isHeading(block)) {
      if (current.items.length || current.title) sections.push(current);
      current = { title: headingBlock(block), items: [] };
      counters.length = 0;
      continue;
    }
    // Numbering runs per list level and restarts after a heading, a plain line or a bullet.
    counters.length = listItem ? level : 0;
    if (listItem) counters[level - 1] = listItem === "number" ? (counters[level - 1] ?? 0) + 1 : 0;
    const number = listItem === "number" ? `${counters[level - 1]}.` : undefined;
    current.items.push({
      block: blockText(block).match(/^\s*[-•*·]\s/) ? stripBullet(block) : block,
      number,
      indent: listItem ? level - 1 : 0,
    });
  }
  if (current.items.length || current.title) sections.push(current);
  return sections;
}

export interface MethodSection {
  title?: PortableTextBlock;
  /** Each step is its paragraph plus any bullet or numbered lines written right under it. */
  steps: PortableTextBlock[][];
}

/** Splits the method into numbered steps, grouped under any headings (or lines starting with #). */
export function methodSections(value?: RichText | null): MethodSection[] {
  const sections: MethodSection[] = [];
  let current: MethodSection = { steps: [] };
  let previous: PortableTextBlock | undefined;
  for (const block of toBlocks(value)) {
    if (isHeading(block)) {
      if (current.steps.length || current.title) sections.push(current);
      current = { title: headingBlock(block), steps: [] };
    } else if ((block as { listItem?: string }).listItem && previous && !isHeading(previous) && current.steps.length) {
      current.steps[current.steps.length - 1].push(block);
    } else {
      current.steps.push([block]);
    }
    previous = block;
  }
  if (current.steps.length || current.title) sections.push(current);
  return sections;
}

function mapFirstSpan(block: PortableTextBlock, fn: (text: string) => string): PortableTextBlock {
  const children = [...((block as TextBlock).children ?? [])];
  if (children[0]) children[0] = { ...children[0], text: fn(children[0].text ?? "") };
  return { ...block, children } as PortableTextBlock;
}

const stripHash = (block: PortableTextBlock) => mapFirstSpan(block, (t) => t.replace(/^\s*#+\s*/, ""));
const stripBullet = (block: PortableTextBlock) => mapFirstSpan(block, (t) => t.replace(/^\s*[-•*·]\s*/, ""));
