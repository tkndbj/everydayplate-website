import { defineQuery } from "next-sanity";

/* Reusable projections */

const IMAGE = `{ alt, caption, hotspot, crop, asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }`;
const CATEGORY_REF = `title, "slug": slug.current, "parent": parent->{ title, "slug": slug.current }`;
const CATEGORIES = `"categories": coalesce(categories[]->{ ${CATEGORY_REF} }, [])`;
const PUBLISHED = `defined(slug.current) && defined(publishedAt)`;
/** Tagged with the category itself or one of its sub-categories (inside a category projection). */
const IN_CATEGORY = `(references(^._id) || ^._id in categories[]->parent._ref)`;
/** Same, for a category given by its slug. */
const IN_CATEGORY_SLUG = `($category in categories[]->slug.current || $category in categories[]->parent->slug.current)`;

const RECIPE_FIELDS = `
  _id, title, "slug": slug.current, excerpt, "image": mainImage${IMAGE},
  prepTime, cookTime, difficulty, publishedAt, ${CATEGORIES},
  "hasVideo": defined(youtubeUrl) || count(moreVideos) > 0
`;
const RECIPE_CARD = `{${RECIPE_FIELDS}}`;

const VIDEO_FIELDS = `
  _id, title, "slug": slug.current, youtubeUrl, format, "thumbnail": thumbnail${IMAGE}, publishedAt
`;
const VIDEO_CARD = `{${VIDEO_FIELDS}}`;

const POST_FIELDS = `
  _id, title, "slug": slug.current, excerpt, "image": mainImage${IMAGE}, publishedAt, ${CATEGORIES}
`;
const POST_CARD = `{${POST_FIELDS}}`;

const SETTINGS = `*[_type == "siteSettings"][0]{
  tagline, heroTitle, heroText, "heroImage": heroImage${IMAGE}, "portrait": portrait${IMAGE},
  aboutIntro, aboutShort, aboutBody[]{ ..., _type == "image" => ${IMAGE} }, youtube, instagram, tiktok, facebook, email
}`;

const CATEGORY_LIST = `*[_type == "category" && defined(slug.current) && ($homeOnly == false || showOnHome != false)]
  | order(coalesce(order, 999) asc, title asc){
    ${CATEGORY_REF}, description, "image": image${IMAGE},
    "count": count(*[_type in ["recipe", "video", "post"] && ${PUBLISHED} && ${IN_CATEGORY}])
  }`;

/* Queries */

export const settingsQuery = defineQuery(SETTINGS);

export const homeQuery = defineQuery(`{
  "settings": ${SETTINGS},
  "featured": *[_type == "recipe" && ${PUBLISHED} && featured == true] | order(publishedAt desc)[0]${RECIPE_CARD},
  "recipes": *[_type == "recipe" && ${PUBLISHED}] | order(publishedAt desc)[0...7]${RECIPE_CARD},
  "shorts": *[_type == "video" && ${PUBLISHED}] | order(publishedAt desc)[0...16]${VIDEO_CARD},
  "posts": *[_type == "post" && ${PUBLISHED}] | order(publishedAt desc)[0...3]${POST_CARD},
  "categories": ${CATEGORY_LIST}
}`);

export const categoriesQuery = defineQuery(CATEGORY_LIST);

export const recipesQuery = defineQuery(`{
  "items": *[_type == "recipe" && ${PUBLISHED} && ($category == "" || ${IN_CATEGORY_SLUG})]
    | order(publishedAt desc)[$start...$end]${RECIPE_CARD},
  "total": count(*[_type == "recipe" && ${PUBLISHED} && ($category == "" || ${IN_CATEGORY_SLUG})])
}`);

export const recipeQuery = defineQuery(`*[_type == "recipe" && slug.current == $slug && defined(publishedAt)][0]{
  ${RECIPE_FIELDS}, "categoryIds": coalesce(categories[]._ref, []),
  servings, ingredients, steps, tips, youtubeUrl, moreVideos, "updatedAt": _updatedAt,
  intro[]{ ..., _type == "image" => ${IMAGE} }
}`);

/** Latest recipes with their category ids; the closest matches are picked in code. */
export const relatedRecipesQuery = defineQuery(`*[_type == "recipe" && ${PUBLISHED} && slug.current != $slug]
  | order(publishedAt desc)[0...24]{ ${RECIPE_FIELDS}, "categoryIds": coalesce(categories[]._ref, []) }`);

export const videosQuery = defineQuery(`{
  "items": *[_type == "video" && ${PUBLISHED} && ($format == "" || format == $format)]
    | order(publishedAt desc)[$start...$end]${VIDEO_CARD},
  "total": count(*[_type == "video" && ${PUBLISHED} && ($format == "" || format == $format)]),
  "shortCount": count(*[_type == "video" && ${PUBLISHED} && format == "short"]),
  "longCount": count(*[_type == "video" && ${PUBLISHED} && format == "long"])
}`);

export const videoQuery = defineQuery(`*[_type == "video" && slug.current == $slug && defined(publishedAt)][0]{
  ${VIDEO_FIELDS}, description, ${CATEGORIES},
  "recipe": recipe->${RECIPE_CARD}
}`);

export const moreVideosQuery = defineQuery(`*[_type == "video" && ${PUBLISHED} && slug.current != $slug]
  | order(publishedAt desc)[0...8]${VIDEO_CARD}`);

export const postsQuery = defineQuery(`{
  "items": *[_type == "post" && ${PUBLISHED}] | order(publishedAt desc)[$start...$end]${POST_CARD},
  "total": count(*[_type == "post" && ${PUBLISHED}])
}`);

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug && defined(publishedAt)][0]{
  ${POST_FIELDS}, "updatedAt": _updatedAt,
  body[]{ ..., _type == "image" => ${IMAGE} }
}`);

export const morePostsQuery = defineQuery(`*[_type == "post" && ${PUBLISHED} && slug.current != $slug]
  | order(publishedAt desc)[0...3]${POST_CARD}`);

export const categoryPageQuery = defineQuery(`*[_type == "category" && slug.current == $slug][0]{
  ${CATEGORY_REF}, description, "image": image${IMAGE},
  "children": *[_type == "category" && parent._ref == ^._id && defined(slug.current)]
    | order(coalesce(order, 999) asc, title asc){
      ${CATEGORY_REF}, description, "image": image${IMAGE},
      "count": count(*[_type in ["recipe", "video", "post"] && ${PUBLISHED} && references(^._id)])
    },
  "recipes": *[_type == "recipe" && ${PUBLISHED} && ${IN_CATEGORY}] | order(publishedAt desc)[0...24]${RECIPE_CARD},
  "videos": *[_type == "video" && ${PUBLISHED} && ${IN_CATEGORY}] | order(publishedAt desc)[0...12]${VIDEO_CARD},
  "posts": *[_type == "post" && ${PUBLISHED} && ${IN_CATEGORY}] | order(publishedAt desc)[0...6]${POST_CARD},
  "recipeTotal": count(*[_type == "recipe" && ${PUBLISHED} && ${IN_CATEGORY}])
}`);

export const searchQuery = defineQuery(`*[_type in ["recipe", "post", "video"] && ${PUBLISHED} && (
    title match $term || pt::text(excerpt) match $term || pt::text(description) match $term ||
    pt::text(ingredients) match $term || pt::text(body) match $term
  )] | score(boost(title match $term, 3), pt::text(excerpt) match $term, pt::text(ingredients) match $term)
  | order(_score desc, publishedAt desc)[0...30]{
    _id, _type, title, "slug": slug.current, "excerpt": coalesce(pt::text(excerpt), pt::text(description)),
    "image": coalesce(mainImage, thumbnail)${IMAGE}, youtubeUrl
  }`);

export const sitemapQuery = defineQuery(`{
  "recipes": *[_type == "recipe" && ${PUBLISHED}]{ "slug": slug.current, _updatedAt },
  "videos": *[_type == "video" && ${PUBLISHED}]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && ${PUBLISHED}]{ "slug": slug.current, _updatedAt },
  "categories": *[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);

export const slugsQuery = defineQuery(`*[_type == $type && ${PUBLISHED}] | order(publishedAt desc)[0...$limit].slug.current`);
