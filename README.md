# Lumière Picks — Amazon Affiliate Storefront

A production-ready Amazon affiliate marketing site built with **Next.js 14 (App Router)**,
**TypeScript**, **Tailwind CSS**, and **Supabase**. Includes a password-protected admin
dashboard, product CRUD, reviews, wishlist, comparison, blog, SEO (sitemap/robots/JSON-LD),
click-tracking analytics, dark mode, and social sharing.

---

## 1. Stack

- **Framework:** Next.js 14 App Router, React 18, TypeScript
- **Styling:** Tailwind CSS (custom white / gold / black / soft-pink design system)
- **Database & Auth backend:** Supabase (Postgres + Row Level Security)
- **Admin auth:** Custom signed-cookie session (JWT via `jose`) + scrypt password hashing —
  no third-party auth vendor needed
- **Icons:** lucide-react

## 2. Project structure

```
app/                     Routes (App Router)
  admin/                 Password-protected dashboard (products, stats, login)
  api/                   Route handlers (admin CRUD, click tracking, newsletter, reviews)
  product/[slug]/        Product detail page
  category/[slug]/       Category listing
  top-10/, best-sellers/ Curated listing pages
  blog/                  Blog index + post detail
  compare/, wishlist/    Client-side, localStorage-backed pages
  sitemap.ts, robots.ts  SEO
components/              Reusable UI (ProductCard, Header, Footer, forms, etc.)
components/admin/        Admin-only components (ProductForm, LogoutButton)
lib/                     Supabase clients, auth, queries, utils
types/                   Shared TypeScript types
supabase/schema.sql      Full DB schema, RLS policies, triggers, seed categories
scripts/                 Password-hash generator + demo data seeder
```

## 3. Setup

### 3.1 Install dependencies

```bash
npm install
```

### 3.2 Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. In the SQL Editor, paste and run the contents of `supabase/schema.sql`.
   This creates all tables, indexes, triggers, RLS policies, and seeds the
   five default categories (Skincare, Hair Care, Body Care, Makeup, Fragrance).
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep secret, server-only)

### 3.3 Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=...        # see below
SESSION_SECRET=...             # any long random string, e.g. `openssl rand -hex 32`

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Lumière Picks"
NEXT_PUBLIC_GA_ID=             # optional, e.g. G-XXXXXXXXXX
```

Generate your admin password hash (never store the plain password anywhere):

```bash
npx tsx scripts/generate-password-hash.ts "your-strong-password"
```

Copy the printed `salt:hash` string into `ADMIN_PASSWORD_HASH`.

### 3.4 (Optional) Seed demo products

```bash
npx tsx scripts/seed.ts
```

Adds four sample products and one blog post so the site isn't empty on first run.
Replace the placeholder `affiliate_link` values with your real Amazon Associate links
(they contain `?tag=yourtag-20` — swap for your own tracking ID).

### 3.5 Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin/login`
for the dashboard.

## 4. Using the admin dashboard

- **Add a product:** Admin → Add product. Fill in name, description, an image URL
  (upload your image to Supabase Storage, Amazon's own image CDN, or any host, then
  paste the URL), price (optional), your Amazon affiliate link, and category. Toggle
  "Featured" to show it on the homepage, or "Best seller" to include it in that section.
  Set a "Top 10 rank" (1–10) to place it in that category's ranked list.
- **Edit/delete:** Admin → Products → pencil/trash icons.
- **Stats:** Admin → Dashboard shows total products, affiliate clicks, reviews,
  newsletter subscribers, and your most-clicked products — sourced from the `clicks`
  table, which is written every time a visitor hits "Buy Now."

## 5. SEO & performance built in

- Per-product `generateMetadata` (title, description, Open Graph image) + `Product`
  JSON-LD structured data for rich snippets.
- Auto-generated `/sitemap.xml` and `/robots.txt` (excludes `/admin` and `/api`).
- Next.js `<Image>` with `loading="lazy"` on all listing grids, `priority` on the
  first above-the-fold images.
- Static generation (`generateStaticParams`) for product and category pages, with
  a 1-hour revalidation window.

## 6. Deployment (Vercel — recommended)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add all variables from `.env.local` to Vercel → Project → Settings → Environment
   Variables (use production values; set `NEXT_PUBLIC_SITE_URL` to your real domain).
4. Deploy. Vercel builds with `next build` automatically.
5. Point your domain's DNS to Vercel (Settings → Domains) and re-deploy once it's
   verified so `NEXT_PUBLIC_SITE_URL` matches.

Any Node.js host that supports Next.js (Netlify, Render, a VPS with `next start`)
works the same way — just set the same environment variables.

## 7. Extending the project

- **Images:** swap the seeded Unsplash URLs for real product photos — ideally hosted
  in Supabase Storage or pulled from Amazon's own CDN.
- **Payments/checkout:** not needed — this is an affiliate site; "Buy Now" always
  deep-links to Amazon.
- **Multi-admin:** the current auth is single-admin via one email/password pair. For
  multiple editors, swap `lib/auth.ts` for Supabase Auth with a `role` claim check.
- **Image uploads from the admin UI:** currently the form takes an image URL; wiring
  up direct upload to Supabase Storage is a natural next step (`supabase.storage.from(...)`).
- **Email delivery for newsletter:** subscriber emails are stored in the `subscribers`
  table; connect a provider (Resend, Mailchimp, ConvertKit) to actually send campaigns.

## 8. Security notes

- The service-role Supabase key is only ever used inside `lib/supabase/admin.ts` and
  server-only API routes — it is never sent to the browser.
- `/admin/*` routes are protected by `middleware.ts`, which verifies a signed JWT
  cookie before allowing access; the cookie is `httpOnly` and `secure` in production.
- Passwords are hashed with Node's built-in `scrypt` (no external dependency, no
  known-plaintext storage) and compared with a timing-safe check.
