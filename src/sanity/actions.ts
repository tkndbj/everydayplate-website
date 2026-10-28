import { LaunchIcon } from "@sanity/icons/Launch";
import type { DocumentActionComponent } from "sanity";

const PATHS: Record<string, string> = {
  recipe: "/recipes",
  video: "/videos",
  post: "/stories",
  category: "/categories",
};

/** Adds a "View on website" button to published recipes, videos, stories and categories. */
export const viewOnSiteAction: DocumentActionComponent = (props) => {
  const base = PATHS[props.type];
  const doc = props.published as { slug?: { current?: string } } | null;
  const slug = doc?.slug?.current;
  if (!base) return null;

  return {
    label: "View on website",
    icon: LaunchIcon,
    title: slug ? undefined : "Publish first to view it on the website",
    disabled: !slug,
    onHandle: () => {
      window.open(`${base}/${slug}`, "_blank", "noopener");
      props.onComplete();
    },
  };
};
