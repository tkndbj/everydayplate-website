import { LemonIcon } from "@sanity/icons/Lemon";
import { defineField, defineType } from "sanity";
import {
  categoriesField,
  excerptField,
  imageField,
  publishedAtField,
  slugField,
  youtubeUrlField,
  youtubeUrlsField,
} from "./fields";
import { richTextField, textBlock } from "./richText";

export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  icon: LemonIcon,
  groups: [
    { name: "basics", title: "1. Basics", default: true },
    { name: "cooking", title: "2. Ingredients & method" },
    { name: "extras", title: "3. Extras" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Recipe name",
      type: "string",
      group: "basics",
      validation: (rule) => rule.required().error("Give your recipe a name."),
    }),
    { ...slugField(), group: "basics" },
    { ...imageField("mainImage", "Main photo", "The photo shown on cards and at the top of the recipe.", true), group: "basics" },
    { ...excerptField(), group: "basics" },
    { ...categoriesField, group: "basics" },
    defineField({
      name: "prepTime",
      title: "Prep time (minutes)",
      type: "number",
      group: "basics",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "cookTime",
      title: "Cooking time (minutes)",
      type: "number",
      group: "basics",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "servings",
      title: "Serves",
      type: "number",
      group: "basics",
      initialValue: 4,
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      group: "basics",
      options: {
        list: [
          { title: "Easy", value: "easy" },
          { title: "Medium", value: "medium" },
          { title: "Challenging", value: "hard" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "easy",
    }),

    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      group: "cooking",
      description:
        "One ingredient per line (press Enter for the next one). For a small heading like “For the sauce”, choose “Heading” in the text style menu. Bullets and numbers are in the toolbar.",
      of: [
        textBlock({
          styles: [
            { title: "Ingredient", value: "normal" },
            { title: "Heading", value: "h3" },
          ],
        }),
      ],
      validation: (rule) => rule.required().error("Add at least one ingredient."),
    }),
    defineField({
      name: "steps",
      title: "Method",
      type: "array",
      group: "cooking",
      description:
        "One paragraph per step (press Enter for the next step). Steps are numbered automatically. For a small heading like “Make the sauce”, choose “Heading” in the text style menu. Bullets or numbers right under a step are shown as part of that step.",
      of: [
        textBlock({
          styles: [
            { title: "Step", value: "normal" },
            { title: "Centred text", value: "center" },
            { title: "Right-aligned text", value: "right" },
            { title: "Heading", value: "h3" },
          ],
        }),
      ],
      validation: (rule) => rule.required().error("Add at least one step."),
    }),
    {
      ...richTextField({
        name: "tips",
        title: "Chef’s tips (optional)",
        description: "Little secrets, swaps or storage advice. One tip per paragraph, or use bullets or numbers from the toolbar.",
      }),
      group: "cooking",
    },

    { ...youtubeUrlField(), title: "Main recipe video (optional)", group: "extras" },
    {
      ...youtubeUrlsField(
        "moreVideos",
        "More videos (optional)",
        "Extra YouTube links for this recipe (a Short, a side dish, a technique…). Click “Add item” for each one; drag to change the order. They’re shown under the main video.",
      ),
      group: "extras",
    },
    defineField({
      name: "intro",
      title: "The story behind this dish (optional)",
      type: "blockContent",
      group: "extras",
      description: "A few words about where this recipe comes from. Shown above the ingredients.",
    }),
    defineField({
      name: "featured",
      title: "Feature on the home page",
      type: "boolean",
      group: "extras",
      description: "Turn on to show this recipe in the big spot at the top of the home page.",
      initialValue: false,
    }),
    { ...publishedAtField, group: "extras" },
  ],
  orderings: [
    { title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Name A–Z", name: "title", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      category: "categories.0.title",
      featured: "featured",
      prep: "prepTime",
      cook: "cookTime",
    },
    prepare({ title, media, category, featured, prep, cook }) {
      const total = (prep || 0) + (cook || 0);
      const parts = [featured ? "★ Featured" : null, category, total ? `${total} min` : null];
      return { title, media, subtitle: parts.filter(Boolean).join(" · ") };
    },
  },
});
