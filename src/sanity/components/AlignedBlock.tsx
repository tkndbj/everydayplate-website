import type { CSSProperties } from "react";
import type { BlockProps } from "sanity";

const headingLook: Record<string, CSSProperties> = {
  "h2-center": { fontSize: "1.6em", fontWeight: 700, lineHeight: 1.25 },
  "h3-center": { fontSize: "1.3em", fontWeight: 700, lineHeight: 1.3 },
};

/** Shows centred / right-aligned text in the editor the way it will look on the site. */
export function AlignedBlock(props: BlockProps) {
  const style = (props.value as { style?: string }).style ?? "";
  const align = style === "right" ? "right" : style === "center" || style.endsWith("-center") ? "center" : undefined;
  if (!align) return props.renderDefault(props);
  return <div style={{ textAlign: align, ...headingLook[style] }}>{props.renderDefault(props)}</div>;
}
