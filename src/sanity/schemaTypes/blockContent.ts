import { ImageIcon } from "@sanity/icons/Image";
import { PlayIcon } from "@sanity/icons/Play";
import { defineArrayMember, defineField, defineType } from "sanity";
import { YouTubeInput } from "../components/YouTubeInput";

/** Rich text used for stories, the recipe intro and the About page. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Small heading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbers", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "Link address",
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      name: "image",
      title: "Photo",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Short description" }),
        defineField({ name: "caption", type: "string", title: "Caption (optional)" }),
      ],
    }),
    defineArrayMember({
      type: "object",
      name: "youtube",
      title: "YouTube video",
      icon: PlayIcon,
      fields: [
        defineField({
          name: "url",
          type: "url",
          title: "YouTube link",
          components: { input: YouTubeInput },
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { url: "url" },
        prepare: ({ url }) => ({ title: "YouTube video", subtitle: url, media: PlayIcon }),
      },
    }),
  ],
});
