import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { LemonIcon } from "@sanity/icons/Lemon";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon } from "@sanity/icons/Star";
import { AddIcon } from "@sanity/icons/Add";
import { TagIcon } from "@sanity/icons/Tag";
import type { StructureResolver } from "sanity/structure";
import { CategoryTree } from "./components/CategoryTree";

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
          // Main categories with their sub-categories folded underneath.
          S.component(CategoryTree)
            .id("categories")
            .title("Categories")
            .menuItems([
              S.menuItem()
                .title("New category")
                .icon(AddIcon)
                .intent({ type: "create", params: { type: "category" } })
                .showAsAction(true),
            ])
            .child((id) => S.document().schemaType("category").documentId(id)),
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
    ]);
