# Everyday Plate

The website of **Mustafa Özdeşer**, a self-taught Cypriot chef: recipes, YouTube Shorts and videos, and kitchen stories.

- **Website:** Next.js 16 (App Router, Cache Components, Tailwind CSS v4), hosted on Vercel.
- **Admin panel:** Sanity Studio, built into the site at **`/studio`**.
- **Cost:** €0. Vercel Hobby plus the Sanity free plan. Images are resized by Sanity's CDN (not Vercel's metered image optimizer), and every page is cached, so the site makes very few API requests.

Until a Sanity project is connected, the site shows **demo content**, so you can deploy and preview the design right away.

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see step 2)
npm run dev                  # http://localhost:3000  ·  admin: http://localhost:3000/studio
```

## 2. Connect the admin panel (Sanity, free)

1. Go to <https://www.sanity.io/manage> and sign up (Google sign-in works).
2. Click **Create new project**, name it `Everyday Plate`, and choose the **Free** plan. If it asks for a dataset, use **production** (public).
3. Copy the **Project ID** into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
4. In the project, open **API → CORS origins → Add CORS origin** and add each address below with **"Allow credentials" ticked**:
   - `http://localhost:3000`
   - `https://<your-vercel-domain>` (and your custom domain later)
5. Invite Mustafa: **Members → Invite**, using his email, with the **Administrator** role.
6. Open `/studio`, sign in, go to **Site settings**, add the photos and social links, then **Publish**.

## 3. Deploy (GitHub → Vercel)

1. Push this folder to a new GitHub repository.
2. On <https://vercel.com/new>, import the repository. The framework is detected automatically.
3. Under **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | from step 2 |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain` (no trailing slash) |
   | `SANITY_REVALIDATE_SECRET` | a long random string (optional, see step 4) |

4. Click **Deploy**. Then add the Vercel domain to Sanity's CORS origins (step 2.4).

Every push to `main` redeploys automatically. **Content changes never need a redeploy.**

## 4. Instant updates (optional, recommended)

Even without this step, new posts appear on the site **within about a minute**. To make them appear instantly:

1. Sanity Manage → **API → Webhooks → Create webhook**
   - **URL:** `https://your-domain/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["recipe", "video", "post", "category", "siteSettings"]`
   - **HTTP method:** POST
   - **Secret:** the same value as `SANITY_REVALIDATE_SECRET`
2. Save.

---

## How it fits together

```
src/
  app/
    (site)/            public pages: home, recipes, videos, stories, categories, about, search
    studio/            the admin panel (Sanity Studio) at /studio
    api/revalidate/    webhook: Sanity → refresh cached pages instantly
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  components/          UI (cards, layout, YouTube player, rich text, recipe widgets)
  lib/
    data.ts            all data fetching, cached with 'use cache' + cacheTag("sanity")
    sample-data.ts     demo content, used only while Sanity isn't connected
    image-loader.ts    sends image resizing to the Sanity/Unsplash CDNs
  sanity/
    schemaTypes/       content types: recipe, video, post (story), category, siteSettings
    structure.ts       the admin panel's menu
    queries.ts         GROQ queries
sanity.config.ts       Studio configuration (theme, menu, "View on website" button)
```

**Caching:** every data function uses the `content` cache profile in `next.config.ts` (refresh at most once a minute) and the `sanity` tag. The webhook expires that tag, so the next visit re-renders with fresh content.

**Home page stays small:** it always shows the newest **6 recipes, 10 Shorts, 2 long videos and 3 stories**, with "View all" links. Full lists are paginated.

**SEO:** per-page metadata and Open Graph images, Recipe / VideoObject / BlogPosting structured data (rich results in Google), plus `sitemap.xml` and `robots.txt`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | local development |
| `npm run build` | production build |
| `npm run start` | serve the production build |
| `npm run lint` | ESLint |

See **[GUIDE-FOR-MUSTAFA.md](./GUIDE-FOR-MUSTAFA.md)** for the plain-language guide to posting content.
