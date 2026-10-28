import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { LemonIcon } from "@sanity/icons/Lemon";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon } from "@sanity/icons/Star";
import { TagIcon } from "@sanity/icons/Tag";
import type { StructureResolver } from "sanity/structure";

/** The left-hand menu in the admin panel. Kept short and in plain language on purpose. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Everyday Plate")
    .items([
      S.listItem()
        .title("Recipes")
        .icon(LemonIcon)
        .child(
          S.documentTypeList("recipe")
            .title("Recipes")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Videos & Shorts")
        .icon(PlayIcon)
        .child(
          S.documentTypeList("video")
            .title("Videos & Shorts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Stories (blog)")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("post")
            .title("Stories")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Featured on home page")
        .icon(StarIcon)
        .child(
          S.documentList()
            .title("Featured recipes")
            .apiVersion("2026-10-01")
            .filter('_type == "recipe" && featured == true')
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Categories")
        .icon(TagIcon)
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([
              { field: "order", direction: "asc" },
              { field: "title", direction: "asc" },
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
    ]);
