import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { toImage, type RawImage } from "@/sanity/image";
import {
  categoriesQuery,
  categoryPageQuery,
  homeQuery,
  morePostsQuery,
  moreVideosQuery,
  postQuery,
  postsQuery,
  recipeQuery,
  recipesQuery,
  relatedRecipesQuery,
  searchQuery,
  settingsQuery,
  sitemapQuery,
  slugsQuery,
  videoQuery,
  videosQuery,
} from "@/sanity/queries";
import {
  sampleCategories,
  samplePosts,
  sampleRecipes,
  sampleSettings,
  sampleVideos,
} from "./sample-data";
import type {
  Category,
  CategoryRef,
  Paged,
  Post,
  PostCard,
  Recipe,
  RecipeCard,
  SearchResult,
  SiteSettings,
  Video,
  VideoCard,
} from "./types";
import type { RichText } from "./rich-text";
import { toPlainText } from "./rich-text";
import { getYouTubeId, isYouTubeShort, youTubeThumbnail } from "./youtube";

/**
 * Every function here is cached with the "content" profile (see next.config.ts)
 * and tagged "sanity", so publishing in the admin refreshes the whole site:
 * within a minute on its own, or instantly via the /api/revalidate webhook.
 */
export const CONTENT_TAG = "sanity";

export const PAGE_SIZE = { recipes: 12, videos: 18, posts: 9 } as const;

/* ---------------------------------------------------------------- mapping */

type RawCard = { image?: RawImage | null; title: string; categories?: CategoryRef[] | null };
type RawVideo = {
  _id: string;
  title: string;
  slug: string;
  youtubeUrl?: string;
  format?: string;
  thumbnail?: RawImage | null;
  publishedAt: string;
};

function mapCard<T extends RawCard>(raw: T) {
  return { ...raw, image: toImage(raw.image, raw.title), categories: raw.categories ?? [] };
}

function mapVideo(raw: RawVideo): VideoCard {
  const youtubeId = getYouTubeId(raw.youtubeUrl);
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    publishedAt: raw.publishedAt,
    youtubeId,
    isShort: raw.format === "short" || isYouTubeShort(raw.youtubeUrl),
    thumbnail:
      toImage(raw.thumbnail, raw.title) ??
      (youtubeId ? { src: youTubeThumbnail(youtubeId), alt: raw.title, width: 480, height: 360 } : null),
  };
}

function mapBlocks(blocks?: PortableTextBlock[] | null): PortableTextBlock[] | undefined {
  // Resolve inline images to our SiteImage shape so the renderer stays simple.
  return blocks?.map((block) =>
    block._type === "image" ? ({ ...block, image: toImage(block as unknown as RawImage) } as PortableTextBlock) : block,
  );
}

function pageOf<T>(items: T[], total: number, page: number, size: number): Paged<T> {
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / size)) };
}

const range = (page: number, size: number) => ({ start: (page - 1) * size, end: page * size });

/* --------------------------------------------------------------- settings */

type RawSettings = Partial<Omit<SiteSettings, "heroImage" | "portrait" | "social">> & {
  aboutIntro?: RichText;
  heroImage?: RawImage;
  portrait?: RawImage;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  email?: string;
} | null;

function mapSettings(raw: RawSettings): SiteSettings {
  return {
    tagline: raw?.tagline || sampleSettings.tagline,
    heroTitle: raw?.heroTitle || sampleSettings.heroTitle,
    heroText: raw?.heroText || undefined,
    heroImage: toImage(raw?.heroImage, "Everyday Plate"),
    portrait: toImage(raw?.portrait, "Mustafa Özdeşer"),
    aboutShort: raw?.aboutIntro?.length ? raw.aboutIntro : raw?.aboutShort || undefined,
    aboutBody: mapBlocks(raw?.aboutBody),
    social: {
      youtube: raw?.youtube,
      instagram: raw?.instagram,
      tiktok: raw?.tiktok,
      facebook: raw?.facebook,
      email: raw?.email,
    },
  };
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  if (!isSanityConfigured) return sampleSettings;
  return mapSettings(await client.fetch(settingsQuery));
}

/* ------------------------------------------------------------------- home */

export interface HomeData {
  settings: SiteSettings;
  featured: RecipeCard | null;
  recipes: RecipeCard[];
  shorts: VideoCard[];
  longVideos: VideoCard[];
  posts: PostCard[];
  categories: Category[];
}

export async function getHome(): Promise<HomeData> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);

  if (!isSanityConfigured) {
    const featured = sampleRecipes.find((r) => r.featured) ?? null;
    const videos = sampleVideos;
    return {
      settings: sampleSettings,
      featured,
      recipes: sampleRecipes.filter((r) => r._id !== featured?._id).slice(0, 6),
      shorts: videos.filter((v) => v.isShort).slice(0, 10),
      longVideos: videos.filter((v) => !v.isShort).slice(0, 2),
      posts: samplePosts.slice(0, 3),
      categories: sampleCategories.filter((c) => c.count > 0),
    };
  }

  const data = await client.fetch(homeQuery, { homeOnly: true });
  const all = (data.recipes ?? []).map(mapCard) as RecipeCard[];
  const featured = data.featured ? (mapCard(data.featured) as RecipeCard) : (all[0] ?? null);
  const videos = (data.shorts ?? []).map((v: RawVideo) => mapVideo(v));

  return {
    settings: mapSettings(data.settings),
    featured,
    recipes: all.filter((r) => r._id !== featured?._id).slice(0, 6),
    shorts: videos.filter((v: VideoCard) => v.isShort).slice(0, 10),
    longVideos: videos.filter((v: VideoCard) => !v.isShort).slice(0, 2),
    posts: (data.posts ?? []).map(mapCard) as PostCard[],
    categories: mapCategories(data.categories).filter((c) => c.count > 0),
  };
}

/* -------------------------------------------------------------- categories */

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  if (!isSanityConfigured) return sampleCategories;
  return mapCategories(await client.fetch(categoriesQuery, { homeOnly: false }));
}

function mapCategories(raw: (Omit<Category, "image"> & { image?: RawImage })[] | null): Category[] {
  return (raw ?? []).map((c) => ({ ...c, description: c.description ?? undefined, image: toImage(c.image, c.title) }));
}

export interface CategoryPage {
  title: string;
  slug: string;
  description?: RichText;
  recipes: RecipeCard[];
  recipeTotal: number;
  videos: VideoCard[];
  posts: PostCard[];
}

export async function getCategoryPage(slug: string): Promise<CategoryPage | null> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);

  if (!isSanityConfigured) {
    const category = sampleCategories.find((c) => c.slug === slug);
    if (!category) return null;
    const has = (item: { categories: CategoryRef[] }) => item.categories.some((c) => c.slug === slug);
    const recipes = sampleRecipes.filter(has);
    return { ...category, recipes, recipeTotal: recipes.length, videos: sampleVideos.filter(has), posts: samplePosts.filter(has) };
  }

  const raw = await client.fetch(categoryPageQuery, { slug });
  if (!raw) return null;
  return {
    title: raw.title,
    slug: raw.slug,
    description: raw.description ?? undefined,
    recipes: (raw.recipes ?? []).map(mapCard) as RecipeCard[],
    recipeTotal: raw.recipeTotal ?? 0,
    videos: (raw.videos ?? []).map((v: RawVideo) => mapVideo(v)),
    posts: (raw.posts ?? []).map(mapCard) as PostCard[],
  };
}

/* ---------------------------------------------------------------- recipes */

export async function getRecipes(page = 1, category = ""): Promise<Paged<RecipeCard>> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  const size = PAGE_SIZE.recipes;

  if (!isSanityConfigured) {
    const filtered = sampleRecipes.filter((r) => !category || r.categories.some((c) => c.slug === category));
    const { start, end } = range(page, size);
    return pageOf(filtered.slice(start, end), filtered.length, page, size);
  }

  const data = await client.fetch(recipesQuery, { category, ...range(page, size) });
  return pageOf((data.items ?? []).map(mapCard) as RecipeCard[], data.total ?? 0, page, size);
}

export async function getRecipe(slug: string): Promise<{ recipe: Recipe; related: RecipeCard[] } | null> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);

  if (!isSanityConfigured) {
    const recipe = sampleRecipes.find((r) => r.slug === slug);
    if (!recipe) return null;
    const slugs = new Set(recipe.categories.map((c) => c.slug));
    const related = sampleRecipes
      .filter((r) => r.slug !== slug)
      .sort((a, b) => score(b.categories.map((c) => c.slug), slugs) - score(a.categories.map((c) => c.slug), slugs))
      .slice(0, 3);
    return { recipe, related };
  }

  const raw = await client.fetch(recipeQuery, { slug });
  if (!raw) return null;
  const ids = new Set<string>(raw.categoryIds ?? []);
  const candidates = await client.fetch(relatedRecipesQuery, { slug });
  const related = [...(candidates ?? [])]
    // Stable sort keeps newest-first among equally related recipes.
    .sort((a, b) => score(b.categoryIds ?? [], ids) - score(a.categoryIds ?? [], ids))
    .slice(0, 3)
    .map(mapCard) as RecipeCard[];

  const recipe: Recipe = {
    ...(mapCard(raw) as RecipeCard),
    servings: raw.servings ?? undefined,
    ingredients: raw.ingredients ?? [],
    steps: raw.steps ?? [],
    tips: raw.tips ?? undefined,
    youtubeUrl: raw.youtubeUrl ?? undefined,
    intro: mapBlocks(raw.intro),
    updatedAt: raw.updatedAt,
  };
  return { recipe, related };
}

const score = (values: string[], wanted: Set<string>) => values.filter((v) => wanted.has(v)).length;

/* ----------------------------------------------------------------- videos */

export type VideoFormat = "short" | "long";

export async function getVideos(
  page = 1,
  format: VideoFormat | "" = "",
): Promise<Paged<VideoCard> & { shortCount: number; longCount: number }> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  const size = PAGE_SIZE.videos;

  if (!isSanityConfigured) {
    const filtered = sampleVideos.filter((v) => !format || v.isShort === (format === "short"));
    const { start, end } = range(page, size);
    return {
      ...pageOf<VideoCard>(filtered.slice(start, end), filtered.length, page, size),
      shortCount: sampleVideos.filter((v) => v.isShort).length,
      longCount: sampleVideos.filter((v) => !v.isShort).length,
    };
  }

  const data = await client.fetch(videosQuery, { format, ...range(page, size) });
  return {
    ...pageOf((data.items ?? []).map((v: RawVideo) => mapVideo(v)), data.total ?? 0, page, size),
    shortCount: data.shortCount ?? 0,
    longCount: data.longCount ?? 0,
  };
}

export async function getVideo(slug: string): Promise<{ video: Video; more: VideoCard[] } | null> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);

  if (!isSanityConfigured) {
    const video = sampleVideos.find((v) => v.slug === slug);
    if (!video) return null;
    return { video, more: sampleVideos.filter((v) => v.slug !== slug) };
  }

  const [raw, more] = await Promise.all([
    client.fetch(videoQuery, { slug }),
    client.fetch(moreVideosQuery, { slug }),
  ]);
  if (!raw) return null;
  return {
    video: {
      ...mapVideo(raw),
      description: raw.description ?? undefined,
      categories: raw.categories ?? [],
      recipe: raw.recipe ? (mapCard(raw.recipe) as RecipeCard) : undefined,
    },
    more: (more ?? []).map((v: RawVideo) => mapVideo(v)),
  };
}

/* ------------------------------------------------------------------ posts */

export async function getPosts(page = 1): Promise<Paged<PostCard>> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  const size = PAGE_SIZE.posts;

  if (!isSanityConfigured) {
    const { start, end } = range(page, size);
    return pageOf(samplePosts.slice(start, end), samplePosts.length, page, size);
  }

  const data = await client.fetch(postsQuery, range(page, size));
  return pageOf((data.items ?? []).map(mapCard) as PostCard[], data.total ?? 0, page, size);
}

export async function getPost(slug: string): Promise<{ post: Post; more: PostCard[] } | null> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);

  if (!isSanityConfigured) {
    const post = samplePosts.find((p) => p.slug === slug);
    if (!post) return null;
    return { post, more: samplePosts.filter((p) => p.slug !== slug) };
  }

  const [raw, more] = await Promise.all([client.fetch(postQuery, { slug }), client.fetch(morePostsQuery, { slug })]);
  if (!raw) return null;
  return {
    post: { ...(mapCard(raw) as PostCard), body: mapBlocks(raw.body) ?? [], updatedAt: raw.updatedAt },
    more: (more ?? []).map(mapCard) as PostCard[],
  };
}

/* ----------------------------------------------------------------- search */

export async function search(term: string): Promise<SearchResult[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  const q = term.trim().slice(0, 80);
  if (!q) return [];

  if (!isSanityConfigured) {
    const needle = q.toLocaleLowerCase();
    const hit = (...fields: (string | undefined)[]) => fields.some((f) => f?.toLocaleLowerCase().includes(needle));
    return [
      ...sampleRecipes
        .filter((r) => hit(r.title, toPlainText(r.excerpt), toPlainText(r.ingredients)))
        .map((r) => ({ _id: r._id, _type: "recipe" as const, title: r.title, slug: r.slug, excerpt: toPlainText(r.excerpt), image: r.image })),
      ...sampleVideos
        .filter((v) => hit(v.title, toPlainText(v.description)))
        .map((v) => ({ _id: v._id, _type: "video" as const, title: v.title, slug: v.slug, image: v.thumbnail ?? undefined })),
      ...samplePosts
        .filter((p) => hit(p.title, toPlainText(p.excerpt)))
        .map((p) => ({ _id: p._id, _type: "post" as const, title: p.title, slug: p.slug, excerpt: toPlainText(p.excerpt), image: p.image })),
    ];
  }

  // Each word must match (as a prefix), e.g. "halloumi fri" finds "Halloumi Fries".
  const words = q.split(/\s+/).filter(Boolean).map((w) => `${w.replace(/[*"\\]/g, "")}*`);
  const raw = await client.fetch(searchQuery, { term: words });
  return (raw ?? []).map(
    (r: SearchResult & { image?: RawImage; youtubeUrl?: string }) => {
      const id = getYouTubeId(r.youtubeUrl);
      return {
        _id: r._id,
        _type: r._type,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt ?? undefined,
        image:
          toImage(r.image as RawImage, r.title) ??
          (id ? { src: youTubeThumbnail(id), alt: r.title, width: 480, height: 360 } : undefined),
      };
    },
  );
}

/* ------------------------------------------------------------ build / SEO */

export async function getSlugs(type: "recipe" | "video" | "post", limit = 50): Promise<string[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  if (!isSanityConfigured) {
    const source = type === "recipe" ? sampleRecipes : type === "video" ? sampleVideos : samplePosts;
    return source.slice(0, limit).map((d) => d.slug);
  }
  return ((await client.fetch(slugsQuery, { type, limit })) ?? []).filter(Boolean);
}

export async function getSitemapEntries() {
  "use cache";
  cacheLife("content");
  cacheTag(CONTENT_TAG);
  type Entry = { slug: string; _updatedAt?: string };
  if (!isSanityConfigured) {
    const map = (items: { slug: string }[]): Entry[] => items.map((i) => ({ slug: i.slug }));
    return {
      recipes: map(sampleRecipes),
      videos: map(sampleVideos),
      posts: map(samplePosts),
      categories: map(sampleCategories),
    };
  }
  return (await client.fetch(sitemapQuery)) as Record<"recipes" | "videos" | "posts" | "categories", Entry[]>;
}
