import { defineArrayMember, defineField } from "sanity";
import { AlignedBlock } from "../components/AlignedBlock";

/**
 * The formatting toolbar shared by every text box in the admin:
 * bold / italic / underline, links, and left / centred / right alignment.
 *
 * Portable Text has no alignment of its own, so it is stored as the block
 * style ("center", "h2-center", …) and AlignedBlock shows it in the editor.
 */

type Style = { title: string; value: string };

const alignedParagraphs: Style[] = [
  { title: "Normal text", value: "normal" },
  { title: "Centred text", value: "center" },
  { title: "Right-aligned text", value: "right" },
];

const headings: Style[] = [
  { title: "Heading", value: "h2" },
  { title: "Heading (centred)", value: "h2-center" },
  { title: "Small heading", value: "h3" },
  { title: "Small heading (centred)", value: "h3-center" },
  { title: "Quote", value: "blockquote" },
];

const decorators = [
  { title: "Bold", value: "strong" },
  { title: "Italic", value: "em" },
  { title: "Underline", value: "underline" },
];

const link = defineArrayMember({
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "href",
      type: "url",
      title: "Link address",
      validation: (rule) => rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
});

const lists = [
  { title: "Bullets", value: "bullet" },
  { title: "Numbers", value: "number" },
];

/** A text block with the shared toolbar. */
export const textBlock = ({ withHeadings = false, withLists = true, withAlign = true, styles }: {
  withHeadings?: boolean;
  withLists?: boolean;
  withAlign?: boolean;
  styles?: Style[];
} = {}) =>
  defineArrayMember({
    type: "block",
    styles: styles ?? [...(withAlign ? alignedParagraphs : alignedParagraphs.slice(0, 1)), ...(withHeadings ? headings : [])],
    lists: withLists ? lists : [],
    marks: { decorators, annotations: [link] },
    components: { block: AlignedBlock },
  });

/** Plain text of a Portable Text value, for length checks. */
const plainText = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((block) => (Array.isArray(block?.children) ? block.children.map((c: { text?: string }) => c.text ?? "").join("") : ""))
        .join("\n")
    : "";

/** A short formatted text box (summaries, descriptions, tips…). */
export const richTextField = ({
  name,
  title,
  description,
  maxLength,
  withLists = true,
}: {
  name: string;
  title: string;
  description?: string;
  maxLength?: number;
  withLists?: boolean;
}) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [textBlock({ withLists })],
    validation: maxLength
      ? (rule) =>
          rule.custom((value) =>
            plainText(value).length > maxLength
              ? `Keep it under ${maxLength} characters so it fits on cards.`
              : true,
          ).warning()
      : undefined,
  });
