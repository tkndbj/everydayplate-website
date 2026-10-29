import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType, type SlugSourceFn } from "sanity";
import { apiVersion } from "../env";
import { imageField, publishedId, slugField } from "./fields";
import { richTextField } from "./richText";

/** Sub-categories include their main category in the web address: "Meat" under "Turkish Cuisine" → turkish-cuisine-meat. */
const slugSource: SlugSourceFn = async (doc, { getClient }) => {
  const parentId = (doc.parent as { _ref?: string } | undefined)?._ref;
  const title = (doc.title as string | undefined) ?? "";
  if (!parentId) return title;
  const parentTitle = await getClient({ apiVersion }).fetch<string | null>(`*[_id == $id][0].title`, { id: parentId });
  return parentTitle ? `${parentTitle} ${title}` : title;
};

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      description: "e.g. Cypriot Classics, Meze, Desserts, Quick Dinners",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Main category (only for sub-categories)",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "Leave empty for a main category. To make a sub-category, pick the main category it belongs under, e.g. “Halloumi dishes” under “Meze”. Recipes, videos and stories in a sub-category also appear on its main category’s page.",
      options: {
        disableNew: true,
        // Only main categories can have sub-categories, and a category can't sit under itself.
        filter: ({ document }) => ({
          filter: "!defined(parent) && !(_id in [$id, $draftId])",
          params: { id: publishedId(document._id), draftId: `drafts.${publishedId(document._id)}` },
        }),
      },
      validation: (rule) =>
        rule.custom(async (value, context) => {
          if (!value || !context.document) return true;
          const id = publishedId(context.document._id);
          const children = await context
            .getClient({ apiVersion })
            .fetch<number>(`count(*[_type == "category" && parent._ref == $id])`, { id });
          return children
            ? "This category already has its own sub-categories, so it can't become a sub-category. Leave this empty."
            : true;
        }),
    }),
    {
      ...slugField(slugSource),
      description:
        'Click "Generate" to create it from the name. For a sub-category, pick the main category first so it’s included (e.g. turkish-cuisine-meat).',
    },
    richTextField({ name: "description", title: "Description (optional)" }),
    imageField("image", "Photo (optional)", "Shown on the category tile on the home page."),
    defineField({
      name: "showOnHome",
      title: "Show on the home page",
      type: "boolean",
      initialValue: true,
      // Only main categories are shown on the home page.
      hidden: ({ document }) => Boolean(document?.parent),
    }),
    defineField({
      name: "order",
      title: "Position",
      type: "number",
      description: "Lower numbers appear first (1, 2, 3…). Leave empty to sort by name.",
    }),
  ],
  orderings: [{ title: "Position", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", media: "image", showOnHome: "showOnHome", parent: "parent.title" },
    prepare: ({ title, media, showOnHome, parent }) => ({
      title: parent ? `${parent} › ${title}` : title,
      media: media ?? TagIcon,
      subtitle: [parent ? `Sub-category of ${parent}` : null, !parent && showOnHome === false ? "Hidden from home page" : null]
        .filter(Boolean)
        .join(" · ") || undefined,
    }),
  },
});
