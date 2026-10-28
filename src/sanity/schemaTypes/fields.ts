import { defineArrayMember, defineField } from "sanity";
import { YouTubeInput } from "../components/YouTubeInput";
import { slugify } from "../lib/slugify";

/** Shared field builders so every content type behaves the same way in the admin. */

export const slugField = (source = "title") =>
  defineField({
    name: "slug",
    title: "Web address",
    type: "slug",
    description: 'Click "Generate" to create it from the title. This becomes the page link.',
    options: { source, maxLength: 96, slugify },
    validation: (rule) => rule.required().error("Click “Generate” to create the web address."),
  });

export const imageField = (name: string, title: string, description?: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Short description (for Google & screen readers)",
        type: "string",
        description: "e.g. “Golden grilled halloumi on a blue plate”",
      }),
    ],
    validation: required ? (rule) => rule.required().error("Please add a photo.") : undefined,
  });

export const publishedAtField = defineField({
  name: "publishedAt",
  title: "Publish date",
  type: "datetime",
  description: "Newest items appear first on the site. Leave as is to use today.",
  initialValue: () => new Date().toISOString(),
  validation: (rule) => rule.required(),
});

export const categoriesField = defineField({
  name: "categories",
  title: "Categories",
  type: "array",
  description: "Pick one or more. You can add new categories in the Categories section.",
  of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
  validation: (rule) => rule.unique(),
});

export const excerptField = (description = "One or two sentences shown on cards and in Google results.") =>
  defineField({
    name: "excerpt",
    title: "Short summary",
    type: "text",
    rows: 3,
    description,
    validation: (rule) => rule.max(240).warning("Keep it under 240 characters so it fits on cards."),
  });

export const youtubeUrlField = (required = false) =>
  defineField({
    name: "youtubeUrl",
    title: "YouTube link",
    type: "url",
    description: "Paste the link from YouTube (Share → Copy link). Shorts links work too.",
    components: { input: YouTubeInput },
    validation: (rule) =>
      (required ? rule.required().error("Paste a YouTube link.") : rule).custom((value) => {
        if (!value) return true;
        return /(youtube\.com|youtu\.be)\//i.test(value) || "This doesn’t look like a YouTube link.";
      }),
  });
