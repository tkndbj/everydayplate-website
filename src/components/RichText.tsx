import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { toBlocks, type RichText as RichTextValue } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/** Bold / italic / underline, links and the alignment styles from the admin's toolbar. */
export const textComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    center: ({ children }) => <p className="text-center">{children}</p>,
    right: ({ children }) => <p className="text-right">{children}</p>,
    "h2-center": ({ children }) => <h2 className="text-center">{children}</h2>,
    "h3-center": ({ children }) => <h3 className="text-center">{children}</h3>,
  },
  marks: {
    underline: ({ children }) => <u className="underline-offset-4">{children}</u>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="text-terracotta underline decoration-1 underline-offset-4 hover:text-terracotta-dark"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
} satisfies PortableTextComponents;

/** Short formatted text (summaries, descriptions, tips) — paragraphs inherit the wrapper's text styles. */
export function RichText({ value, className }: { value?: RichTextValue | null; className?: string }) {
  const blocks = toBlocks(value);
  if (!blocks.length) return null;
  return (
    <div className={cn("[&>*+*]:mt-3 [&_strong]:font-semibold [&_strong]:text-ink", className)}>
      <PortableText value={blocks} components={textComponents} />
    </div>
  );
}

/** A single line of formatted text without its paragraph wrapper (an ingredient, a step, a heading). */
export function InlineText({ block }: { block: PortableTextBlock }) {
  return (
    <PortableText
      value={[{ ...block, style: "inline" } as PortableTextBlock]}
      components={{ ...textComponents, block: { inline: ({ children }) => <>{children}</> } }}
    />
  );
}
