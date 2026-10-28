import { ImageIcon } from "@sanity/icons/Image";
import { PlayIcon } from "@sanity/icons/Play";
import { defineArrayMember, defineField, defineType } from "sanity";
import { YouTubeInput } from "../components/YouTubeInput";
import { textBlock } from "./richText";

/** Rich text used for stories, the recipe intro and the About page. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Text",
  type: "array",
  of: [
    textBlock({ withHeadings: true }),
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
