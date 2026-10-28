import { blockContent } from "./blockContent";
import { category } from "./category";
import { post } from "./post";
import { recipe } from "./recipe";
import { siteSettings } from "./siteSettings";
import { video } from "./video";

export const schemaTypes = [recipe, video, post, category, siteSettings, blockContent];

/** Document types that only ever have one instance. */
export const singletonTypes = new Set(["siteSettings"]);
