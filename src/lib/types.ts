import type { PortableTextBlock } from "next-sanity";

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  /** CSS object-position derived from the editor's chosen focal point. */
  position?: string;
  caption?: string;
}

export interface CategoryRef {
  title: string;
  slug: string;
}

export interface Category extends CategoryRef {
  description?: string;
  image?: SiteImage;
  count: number;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface RecipeCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: SiteImage;
  prepTime?: number;
  cookTime?: number;
  difficulty?: Difficulty;
  publishedAt: string;
  categories: CategoryRef[];
  hasVideo: boolean;
}

export interface Recipe extends RecipeCard {
  servings?: number;
  ingredients: string;
  steps: string[];
  tips?: string;
  youtubeUrl?: string;
  intro?: PortableTextBlock[];
  updatedAt: string;
}

export interface VideoCard {
  _id: string;
  title: string;
  slug: string;
  youtubeId: string | null;
  isShort: boolean;
  thumbnail: SiteImage | null;
  publishedAt: string;
}

export interface Video extends VideoCard {
  description?: string;
  categories: CategoryRef[];
  recipe?: RecipeCard;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: SiteImage;
  publishedAt: string;
  categories: CategoryRef[];
}

export interface Post extends PostCard {
  body: PortableTextBlock[];
  updatedAt: string;
}

export interface SiteSettings {
  tagline: string;
  heroTitle: string;
  heroText?: string;
  heroImage?: SiteImage;
  portrait?: SiteImage;
  aboutShort?: string;
  aboutBody?: PortableTextBlock[];
  social: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    email?: string;
  };
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
}

export interface SearchResult {
  _id: string;
  _type: "recipe" | "post" | "video";
  title: string;
  slug: string;
  excerpt?: string;
  image?: SiteImage;
}
