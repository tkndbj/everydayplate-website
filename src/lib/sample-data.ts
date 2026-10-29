/**
 * Demo content shown only while the Sanity project isn't connected yet
 * (NEXT_PUBLIC_SANITY_PROJECT_ID is empty). Once connected, everything on the
 * site comes from the admin panel and this file is never used.
 */
import type { PortableTextBlock } from "next-sanity";
import type {
  Category,
  CategoryRef,
  Post,
  Recipe,
  SiteImage,
  SiteSettings,
  Video,
} from "./types";

const photo = (id: string, alt: string): SiteImage => ({
  src: `https://images.unsplash.com/${id}`,
  alt,
  width: 1600,
  height: 1067,
});

const IMG = {
  souvla: photo("photo-1555939594-58d7cb561ad1", "Charcoal-grilled souvla and sheftalia on a wooden board"),
  halloumi: photo("photo-1476224203421-9ac39bcb3327", "Grilled halloumi sticks with a dipping sauce"),
  pasta: photo("photo-1473093295043-cdd812d0e601", "Farfalle with basil pesto and cherry tomatoes"),
  bowl: photo("photo-1512621776951-a57141f2eefd", "A colourful bowl of fresh vegetables and chickpeas"),
  salad: photo("photo-1540189549336-e6e99c3679fe", "Village salad with red onion and feta"),
  brunch: photo("photo-1490645935967-10de6ba17061", "Brunch plate with eggs, avocado and greens"),
  toast: photo("photo-1482049016688-2d3e1b311543", "Soft-boiled eggs with avocado on a dark plate"),
  chicken: photo("photo-1546069901-ba9599a7e63c", "Lemon chicken bowl with vegetables"),
  pancakes: photo("photo-1567620905732-2d1ec7ab7445", "Stack of pancakes with carob syrup"),
  table: photo("photo-1504674900247-0877df9cc836", "A table full of shared dishes"),
  restaurant: photo("photo-1414235077428-338989a2e8c0", "A plated dish in a warm dining room"),
  pizza: photo("photo-1565299624946-b28f40a0ae38", "Homemade pizza with fresh basil"),
};

const pt = (...paragraphs: string[]): PortableTextBlock[] =>
  paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: text.startsWith("## ") ? "h2" : "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text: text.replace(/^## /, ""), marks: [] }],
  }));

const cat = {
  classics: { title: "Cypriot Classics", slug: "cypriot-classics" },
  meze: { title: "Meze & Sharing", slug: "meze-and-sharing" },
  quick: { title: "Quick Dinners", slug: "quick-dinners" },
  grill: { title: "From the Grill", slug: "from-the-grill" },
  sweet: { title: "Sweet Things", slug: "sweet-things" },
  brunch: { title: "Breakfast & Brunch", slug: "breakfast-and-brunch" },
} satisfies Record<string, CategoryRef>;

const day = (n: number) => new Date(Date.UTC(2026, 9, 26) - n * 86_400_000).toISOString();

export const sampleSettings: SiteSettings = {
  tagline: "Honest, home-cooked food from a Cypriot kitchen",
  heroTitle: "Real food for every day",
  heroText:
    "Recipes, short videos and kitchen stories from Mustafa Özdeşer — a self-taught Cypriot cook who believes the best meals are the simple ones, made with care and shared generously.",
  heroImage: IMG.souvla,
  portrait: IMG.table,
  aboutShort:
    "I’m Mustafa — a self-taught cook from Cyprus. I learned in my family’s kitchen, by watching, tasting and getting it wrong plenty of times. Everyday Plate is where I share the food I actually cook at home.",
  aboutBody: pt(
    "I’m Mustafa Özdeşer, a self-taught cook from Cyprus. I never went to culinary school. I learned the way most of us on this island do: standing next to my mother and grandmother, being handed a spoon to taste and told “a little more lemon”.",
    "## Why Everyday Plate",
    "Good food doesn’t have to be complicated. Most of my recipes use ingredients you can find at any market, and most of them are ready in under an hour. I want you to cook them on a Tuesday, not only on special occasions.",
    "## What you’ll find here",
    "Cypriot classics the way my family makes them, meze for sharing with friends, quick dinners for busy evenings, and the occasional sweet thing. I also share short videos so you can see exactly how it’s done.",
    "Thank you for being here. Now — let’s cook.",
  ),
  social: {
    youtube: "https://www.youtube.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },
};

const recipeBase = { hasVideo: false, intro: undefined, tips: undefined, youtubeUrl: undefined };

export const sampleRecipes: (Recipe & { featured?: boolean })[] = [
  {
    ...recipeBase,
    _id: "r1",
    featured: true,
    title: "Souvla & Sheftalia, Sunday Style",
    slug: "souvla-and-sheftalia",
    excerpt: "Slow-turned pork shoulder and caul-wrapped sheftalia over charcoal — the smell of every Cypriot Sunday.",
    image: IMG.souvla,
    prepTime: 30,
    cookTime: 120,
    servings: 6,
    difficulty: "medium",
    publishedAt: day(1),
    updatedAt: day(1),
    categories: [cat.classics, cat.grill],
    hasVideo: true,
    ingredients:
      "# For the souvla\n1.5 kg pork shoulder, cut into large chunks\n2 onions, grated\n2 tbsp dried oregano\n1 tbsp sea salt\nFreshly ground black pepper\n# For the sheftalia\n500 g minced pork\n1 onion, very finely chopped\n1 bunch parsley, chopped\n200 g caul fat, soaked in vinegar water\n# To serve\nPitta bread, lemon wedges, village salad",
    steps: [
      "Mix the pork with grated onion, oregano, salt and pepper. Cover and leave in the fridge for at least 4 hours, ideally overnight.",
      "For the sheftalia, mix the mince, onion, parsley, salt and pepper. Shape into small fingers and wrap each one in a piece of caul fat.",
      "Light the charcoal and wait until the coals are covered in grey ash — patience here is everything.",
      "Thread the pork onto skewers and cook slowly, turning often, for about 1.5–2 hours until deep golden.",
      "Grill the sheftalia for the last 15 minutes until crisp. Rest everything for 5 minutes and serve with warm pitta and lemon.",
    ],
    tips: "Don’t trim all the fat — it keeps the meat juicy.\nGrated onion in the marinade tenderises the pork naturally.",
    intro: pt(
      "In Cyprus, Sunday means souvla. The men argue about the charcoal, the kids sneak pieces of sheftalia, and lunch somehow lasts until evening.",
    ),
  },
  {
    ...recipeBase,
    _id: "r2",
    title: "Crispy Halloumi Fries with Honey & Mint",
    slug: "crispy-halloumi-fries",
    excerpt: "Golden halloumi sticks, a drizzle of thyme honey and fresh mint. Ten minutes, gone in two.",
    image: IMG.halloumi,
    prepTime: 5,
    cookTime: 10,
    servings: 4,
    difficulty: "easy",
    publishedAt: day(3),
    updatedAt: day(3),
    categories: [cat.meze, cat.quick],
    hasVideo: true,
    ingredients:
      "2 blocks halloumi (about 500 g)\n3 tbsp plain flour\n1 tsp smoked paprika\nOlive oil, for frying\n2 tbsp thyme honey\nA handful of fresh mint\n1 lemon",
    steps: [
      "Cut the halloumi into thick fries and pat dry with kitchen paper.",
      "Toss in flour mixed with smoked paprika.",
      "Fry in hot olive oil for 2–3 minutes until golden on all sides.",
      "Drain, drizzle with honey, scatter with mint and finish with a squeeze of lemon.",
    ],
  },
  {
    ...recipeBase,
    _id: "r3",
    title: "Village Salad with Kapari & Feta",
    slug: "village-salad",
    excerpt: "The salad on every Cypriot table — ripe tomatoes, crunchy cucumber, red onion and pickled caper leaves.",
    image: IMG.salad,
    prepTime: 15,
    servings: 4,
    difficulty: "easy",
    publishedAt: day(6),
    updatedAt: day(6),
    categories: [cat.classics, cat.meze],
    ingredients:
      "4 ripe tomatoes\n1 cucumber\n1 red onion, thinly sliced\n1 green pepper\n200 g feta\n1 tbsp pickled caper leaves (kapari)\nA handful of olives\n4 tbsp extra virgin olive oil\n1 tbsp red wine vinegar\nDried oregano",
    steps: [
      "Cut the tomatoes and cucumber into rough chunks.",
      "Add the onion, pepper, olives and caper leaves.",
      "Dress with olive oil, vinegar and a good pinch of oregano. Top with a slab of feta.",
    ],
  },
  {
    ...recipeBase,
    _id: "r4",
    title: "Lemon & Oregano Chicken Bowl",
    slug: "lemon-oregano-chicken-bowl",
    excerpt: "A weeknight bowl with crispy lemon chicken, grains and whatever vegetables you have.",
    image: IMG.chicken,
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "easy",
    publishedAt: day(9),
    updatedAt: day(9),
    categories: [cat.quick],
    ingredients:
      "2 chicken thighs, boneless\n1 lemon, zest and juice\n1 tsp dried oregano\n2 garlic cloves\n150 g bulgur or rice\nCucumber, tomatoes, red cabbage\nGreek yoghurt, to serve",
    steps: [
      "Marinate the chicken in lemon, oregano, garlic and olive oil for 10 minutes.",
      "Cook the bulgur according to the packet.",
      "Pan-fry the chicken skin-side down until crisp, then flip and finish cooking.",
      "Slice and serve over the grains with vegetables and a spoon of yoghurt.",
    ],
  },
  {
    ...recipeBase,
    _id: "r5",
    title: "Carob Syrup Pancakes",
    slug: "carob-syrup-pancakes",
    excerpt: "Fluffy pancakes with Cypriot carob syrup — our island’s “black gold” — and a little tahini.",
    image: IMG.pancakes,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    publishedAt: day(12),
    updatedAt: day(12),
    categories: [cat.sweet, cat.brunch],
    ingredients:
      "200 g plain flour\n2 tsp baking powder\n1 tbsp sugar\n2 eggs\n250 ml milk\n2 tbsp melted butter\n# To serve\nCarob syrup (haroupomelo)\nTahini\nFresh fruit",
    steps: [
      "Whisk the dry ingredients together. In another bowl, whisk eggs, milk and butter.",
      "Combine gently — a few lumps are fine.",
      "Cook ladlefuls in a lightly buttered pan until bubbles appear, then flip.",
      "Stack, then drizzle with carob syrup and a little tahini.",
    ],
  },
  {
    ...recipeBase,
    _id: "r6",
    title: "Basil Farfalle with Cherry Tomatoes",
    slug: "basil-farfalle",
    excerpt: "A bright summer pasta made with garden basil, good olive oil and sweet tomatoes.",
    image: IMG.pasta,
    prepTime: 10,
    cookTime: 12,
    servings: 4,
    difficulty: "easy",
    publishedAt: day(15),
    updatedAt: day(15),
    categories: [cat.quick],
    ingredients:
      "400 g farfalle\n1 large bunch basil\n50 g pine nuts\n1 garlic clove\n60 g grated halloumi or parmesan\n120 ml olive oil\n250 g cherry tomatoes, halved",
    steps: [
      "Blitz basil, pine nuts, garlic, cheese and olive oil into a pesto.",
      "Cook the pasta in well-salted water until al dente.",
      "Toss the pasta with pesto, a splash of cooking water and the tomatoes.",
    ],
  },
  {
    ...recipeBase,
    _id: "r7",
    title: "Weekend Brunch Plate",
    slug: "weekend-brunch-plate",
    excerpt: "Soft eggs, avocado, greens and warm bread — a slow Saturday on a plate.",
    image: IMG.brunch,
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
    publishedAt: day(19),
    updatedAt: day(19),
    categories: [cat.brunch],
    ingredients: "4 eggs\n1 avocado\nA handful of greens\nCherry tomatoes\nRadishes\nSourdough bread",
    steps: ["Boil the eggs for 6½ minutes, then cool in cold water.", "Arrange everything on a plate and season well."],
  },
  {
    ...recipeBase,
    _id: "r8",
    title: "Rainbow Chickpea Bowl",
    slug: "rainbow-chickpea-bowl",
    excerpt: "Roasted chickpeas, avocado and crunchy vegetables with a lemon-tahini dressing.",
    image: IMG.bowl,
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "easy",
    publishedAt: day(24),
    updatedAt: day(24),
    categories: [cat.quick],
    ingredients: "1 tin chickpeas\n1 avocado\nCarrots, cabbage, tomatoes\n2 tbsp tahini\n1 lemon",
    steps: ["Roast the chickpeas with paprika until crisp.", "Whisk tahini with lemon and water.", "Build the bowls."],
  },
];

export const sampleVideos: Video[] = [
  ["v1", "Souvla the way my father taught me", "souvla-short", IMG.souvla, true, cat.grill],
  ["v2", "Halloumi fries in 60 seconds", "halloumi-fries-short", IMG.halloumi, true, cat.meze],
  ["v3", "Why I always salt my tomatoes", "salting-tomatoes", IMG.salad, true, cat.classics],
  ["v4", "Carob syrup — Cyprus’ black gold", "carob-syrup", IMG.pancakes, true, cat.sweet],
  ["v5", "3 dinners from one chicken", "three-dinners-one-chicken", IMG.chicken, true, cat.quick],
  ["v6", "Proper pizza at home", "pizza-at-home", IMG.pizza, true, cat.quick],
  ["v7", "A full Cypriot meze at home — start to finish", "full-cypriot-meze", IMG.table, false, cat.meze],
].map(([id, title, slug, thumbnail, isShort, category], i) => ({
  _id: id as string,
  title: title as string,
  slug: slug as string,
  youtubeId: null,
  isShort: isShort as boolean,
  thumbnail: thumbnail as SiteImage,
  publishedAt: day(i * 2 + 1),
  description: "Demo video — connect the admin panel to show your real YouTube videos here.",
  categories: [category as CategoryRef],
}));

export const samplePosts: Post[] = [
  {
    _id: "p1",
    title: "Why I never trained in a restaurant (and don’t regret it)",
    slug: "self-taught",
    excerpt: "Everything I know about cooking, I learned at a family table. Here’s what that taught me.",
    image: IMG.restaurant,
    publishedAt: day(4),
    updatedAt: day(4),
    categories: [],
    body: pt(
      "People often ask where I trained. The honest answer is: in my grandmother’s kitchen in a small village, mostly by getting in the way.",
      "## Taste, then taste again",
      "She never measured anything. Instead she tasted constantly, and made me taste too. That habit is the single most useful thing I know.",
      "## Simple is hard",
      "A village salad has five ingredients and nowhere to hide. That’s why I love it — and why I still practise it.",
    ),
  },
  {
    _id: "p2",
    title: "Cooking for a crowd without losing your mind",
    slug: "cooking-for-a-crowd",
    excerpt: "My game plan for feeding twenty people — what to make ahead and what to leave for the last minute.",
    image: IMG.table,
    publishedAt: day(11),
    updatedAt: day(11),
    categories: [cat.meze],
    body: pt("Big family gatherings are part of life in Cyprus. Here is how I plan them so that I actually get to sit down and eat."),
  },
  {
    _id: "p3",
    title: "A love letter to Cypriot breakfast",
    slug: "cypriot-breakfast",
    excerpt: "Halloumi, olives, tomatoes, warm bread, and a long conversation. The best meal of the day.",
    image: IMG.toast,
    publishedAt: day(20),
    updatedAt: day(20),
    categories: [cat.brunch],
    body: pt("A Cypriot breakfast isn’t a recipe — it’s a table. Here’s what goes on mine."),
  },
];

export const sampleCategories: Category[] = (
  [
    [cat.classics, IMG.souvla, "The dishes I grew up with, cooked the way my family does."],
    [cat.meze, IMG.halloumi, "Small plates for long evenings with friends."],
    [cat.quick, IMG.chicken, "Proper dinners in 30 minutes or less."],
    [cat.grill, IMG.souvla, "Charcoal, patience and good company."],
    [cat.sweet, IMG.pancakes, "A little something for after."],
    [cat.brunch, IMG.brunch, "Slow mornings and good eggs."],
  ] as const
).map(([ref, image, description]) => ({
  ...ref,
  image,
  description,
  count: [...sampleRecipes, ...sampleVideos, ...samplePosts].filter((item) =>
    item.categories.some((c) => c.slug === ref.slug),
  ).length,
  recipeCount: sampleRecipes.filter((item) => item.categories.some((c) => c.slug === ref.slug)).length,
}));
