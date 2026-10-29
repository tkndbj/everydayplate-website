import { defineArrayMember, defineField } from "sanity";
import { CategoryPicker } from "../components/CategoryPicker";
import { YouTubeInput } from "../components/YouTubeInput";
import { slugify } from "../lib/slugify";
import { richTextField } from "./richText";

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
  description:
    "Choose a category, then a sub-category if it has any (marked ›), and click Add. Add as many as you like. You can create new ones in the Categories section.",
  of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
  // Categories are added with the two-step menu below the list instead of the usual "Add item".
  components: { input: CategoryPicker },
  options: { disableActions: ["add", "addBefore", "addAfter", "duplicate"] },
  validation: (rule) => rule.unique(),
});

export const excerptField = (description = "One or two sentences shown on cards and in Google results.") =>
  richTextField({ name: "excerpt", title: "Short summary", description, maxLength: 240, withLists: false });

const checkYouTubeLink = (value?: string) =>
  !value || /(youtube\.com|youtu\.be)\//i.test(value) || "This doesn’t look like a YouTube link.";

export const youtubeUrlField = (required = false) =>
  defineField({
    name: "youtubeUrl",
    title: "YouTube link",
    type: "url",
    description: "Paste the link from YouTube (Share → Copy link). Shorts links work too.",
    components: { input: YouTubeInput },
    validation: (rule) => (required ? rule.required().error("Paste a YouTube link.") : rule).custom(checkYouTubeLink),
  });

/** Several YouTube links, each with the same thumbnail preview as a single link. */
export const youtubeUrlsField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [
      defineArrayMember({
        type: "url",
        title: "YouTube link",
        components: { input: YouTubeInput },
        validation: (rule) => rule.custom(checkYouTubeLink),
      }),
    ],
    validation: (rule) => rule.unique(),
  });
