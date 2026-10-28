import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";
import { getYouTubeId, isYouTubeShort, youTubeThumbnail } from "@/lib/youtube";
import { categoriesField, imageField, publishedAtField, slugField, youtubeUrlField } from "./fields";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  icon: PlayIcon,
  fields: [
    youtubeUrlField(true),
    defineField({
      name: "title",
      title: "Video title",
      type: "string",
      validation: (rule) => rule.required().error("Give your video a title."),
    }),
    slugField(),
    defineField({
      name: "format",
      title: "Type of video",
      type: "string",
      description: "Shorts are the vertical videos.",
      options: {
        list: [
          { title: "YouTube Short (vertical)", value: "short" },
          { title: "Regular video (wide)", value: "long" },
        ],
        layout: "radio",
      },
      initialValue: "short",
      validation: (rule) =>
        rule.required().custom((format, context) => {
          const url = String(context.document?.youtubeUrl ?? "");
          if (format === "long" && isYouTubeShort(url)) {
            return "This link is a YouTube Short — please choose “YouTube Short”.";
          }
          return true;
        }),
    }),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "text",
      rows: 4,
    }),
    categoriesField,
    defineField({
      name: "recipe",
      title: "Linked recipe (optional)",
      type: "reference",
      to: [{ type: "recipe" }],
      description: "If this video shows a recipe on the site, pick it so viewers can jump to it.",
    }),
    imageField(
      "thumbnail",
      "Custom thumbnail (optional)",
      "Leave empty to use YouTube’s thumbnail automatically.",
    ),
    publishedAtField,
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", url: "youtubeUrl", format: "format", thumbnail: "thumbnail" },
    prepare({ title, url, format, thumbnail }) {
      const id = getYouTubeId(url);
      const isShort = format === "short" || isYouTubeShort(url);
      return {
        title,
        subtitle: isShort ? "Short" : "Video",
        media:
          thumbnail ??
          (id ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={youTubeThumbnail(id)} alt="" style={{ objectFit: "cover" }} />
          ) : (
            PlayIcon
          )),
      };
    },
  },
});
