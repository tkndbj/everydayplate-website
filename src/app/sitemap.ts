import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { recipes, videos, posts, categories } = await getSitemapEntries();
  const entry = (path: string, updated?: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: updated,
    priority,
  });

  return [
    entry("/", undefined, 1),
    entry("/recipes", undefined, 0.9),
    entry("/videos", undefined, 0.8),
    entry("/stories", undefined, 0.7),
    entry("/about", undefined, 0.5),
    ...recipes.map((r) => entry(`/recipes/${r.slug}`, r._updatedAt, 0.8)),
    ...videos.map((v) => entry(`/videos/${v.slug}`, v._updatedAt)),
    ...posts.map((p) => entry(`/stories/${p.slug}`, p._updatedAt)),
    ...categories.map((c) => entry(`/categories/${c.slug}`, c._updatedAt, 0.5)),
  ];
}
