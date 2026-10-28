import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";
import { LegacyTextInput } from "../components/LegacyTextInput";
import { imageField } from "./fields";
import { richTextField } from "./richText";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "home", title: "Home page", default: true },
    { name: "about", title: "About me" },
    { name: "social", title: "Social links" },
  ],
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "home",
      description: "Short line under the logo and in Google results.",
      initialValue: "Honest, home-cooked food from a Cypriot kitchen",
    }),
    defineField({
      name: "heroTitle",
      title: "Big headline",
      type: "string",
      group: "home",
      initialValue: "Real food for every day",
    }),
    { ...richTextField({ name: "heroText", title: "Text under the headline", withLists: false }), group: "home" },
    { ...imageField("heroImage", "Home page photo", "The large photo at the top of the home page."), group: "home" },

    { ...imageField("portrait", "Your photo", "A friendly photo of you for the About section."), group: "about" },
    {
      ...richTextField({
        name: "aboutIntro",
        title: "Short introduction",
        description: "Two or three sentences shown on the home page.",
        withLists: false,
      }),
      group: "about",
      components: { input: LegacyTextInput },
    },
    // Plain-text version from before the formatting toolbar; hidden, and copied into aboutIntro on request.
    defineField({ name: "aboutShort", type: "text", hidden: true }),
    defineField({
      name: "aboutBody",
      title: "Full About page",
      type: "blockContent",
      group: "about",
    }),

    defineField({ name: "youtube", title: "YouTube channel link", type: "url", group: "social" }),
    defineField({ name: "instagram", title: "Instagram link", type: "url", group: "social" }),
    defineField({ name: "tiktok", title: "TikTok link", type: "url", group: "social" }),
    defineField({ name: "facebook", title: "Facebook link", type: "url", group: "social" }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "social",
      validation: (rule) => rule.email(),
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
