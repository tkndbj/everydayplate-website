import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";
import { imageField, slugField } from "./fields";

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
    slugField(),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "text",
      rows: 2,
    }),
    imageField("image", "Photo (optional)", "Shown on the category tile on the home page."),
    defineField({
      name: "showOnHome",
      title: "Show on the home page",
      type: "boolean",
      initialValue: true,
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
    select: { title: "title", media: "image", showOnHome: "showOnHome" },
    prepare: ({ title, media, showOnHome }) => ({
      title,
      media: media ?? TagIcon,
      subtitle: showOnHome === false ? "Hidden from home page" : undefined,
    }),
  },
});
