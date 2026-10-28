import type { PortableTextBlock } from "next-sanity";
import type { RichText } from "./rich-text";

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
  description?: RichText;
  image?: SiteImage;
  count: number;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface RecipeCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: RichText;
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
  ingredients: RichText;
  steps: RichText;
  tips?: RichText;
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
  description?: RichText;
  categories: CategoryRef[];
  recipe?: RecipeCard;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: RichText;
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
  heroText?: RichText;
  heroImage?: SiteImage;
  portrait?: SiteImage;
  aboutShort?: RichText;
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
