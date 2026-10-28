import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { categoriesField, excerptField, imageField, publishedAtField, slugField } from "./fields";

export const post = defineType({
  name: "post",
  title: "Story",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("Give your story a title."),
    }),
    slugField(),
    imageField("mainImage", "Cover photo", "Shown on cards and at the top of the story.", true),
    excerptField(),
    defineField({
      name: "body",
      title: "Story",
      type: "blockContent",
      description: "Write freely. Use the + button to add photos or YouTube videos between paragraphs.",
      validation: (rule) => rule.required().error("Write something for your story."),
    }),
    categoriesField,
    publishedAtField,
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", media: "mainImage", date: "publishedAt" },
    prepare: ({ title, media, date }) => ({
      title,
      media,
      subtitle: date ? new Date(date).toLocaleDateString("en-GB", { dateStyle: "medium" }) : "Draft",
    }),
  },
});
