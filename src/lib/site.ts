const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "Everyday Plate",
  author: "Mustafa Özdeşer",
  description:
    "Honest, home-cooked recipes, short videos and kitchen stories from Mustafa Özdeşer — a self-taught Cypriot chef.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")).replace(
    /\/$/,
    "",
  ),
  locale: "en_GB",
};

export const nav = [
  { href: "/recipes", label: "Recipes" },
  { href: "/videos", label: "Videos" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
] as const;
