/**
 * Run: npx tsx scripts/seed.ts
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Populates a handful of demo products so the site isn't empty on first run.
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: categories } = await supabase.from("categories").select("*");
  if (!categories || categories.length === 0) {
    console.error("No categories found — run supabase/schema.sql first.");
    return;
  }
  const bySlug = (slug: string) => categories.find((c) => c.slug === slug)!.id;

  const products = [
    {
      name: "Vitamin C Brightening Serum",
      slug: "vitamin-c-brightening-serum",
      short_description: "A lightweight serum that visibly brightens and evens skin tone.",
      long_description: "Formulated with 15% vitamin C and ferulic acid to fade dark spots and boost radiance over 4–6 weeks of daily use.",
      image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      price: 24.99,
      affiliate_link: "https://www.amazon.com/dp/B00EXAMPLE1?tag=yourtag-20",
      category_id: bySlug("skincare"),
      is_featured: true,
      is_best_seller: true,
      top_10_rank: 1,
    },
    {
      name: "Silk Repair Hair Mask",
      slug: "silk-repair-hair-mask",
      short_description: "Deep-conditioning mask for dry, damaged or color-treated hair.",
      image_url: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800",
      price: 18.5,
      affiliate_link: "https://www.amazon.com/dp/B00EXAMPLE2?tag=yourtag-20",
      category_id: bySlug("hair-care"),
      is_featured: true,
      top_10_rank: 1,
    },
    {
      name: "Whipped Shea Body Butter",
      slug: "whipped-shea-body-butter",
      short_description: "Rich, fast-absorbing body butter for all-day hydration.",
      image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
      price: 14.0,
      affiliate_link: "https://www.amazon.com/dp/B00EXAMPLE3?tag=yourtag-20",
      category_id: bySlug("body-care"),
      is_best_seller: true,
    },
    {
      name: "Matte Longwear Foundation",
      slug: "matte-longwear-foundation",
      short_description: "Buildable, transfer-resistant coverage that lasts 12+ hours.",
      image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
      price: 32.0,
      affiliate_link: "https://www.amazon.com/dp/B00EXAMPLE4?tag=yourtag-20",
      category_id: bySlug("makeup"),
      is_featured: true,
    },
  ];

  for (const product of products) {
    const { error } = await supabase.from("products").upsert(product, { onConflict: "slug" });
    if (error) console.error(`Failed to seed ${product.name}:`, error.message);
    else console.log(`Seeded: ${product.name}`);
  }

  await supabase.from("blog_posts").upsert(
    {
      title: "5 Signs Your Skincare Routine Needs a Refresh",
      slug: "skincare-routine-refresh",
      excerpt: "How to tell it's time to swap products — and what to reach for instead.",
      content:
        "Your skin changes with the seasons, your hormones, and your environment — and your routine should too. Here are five signs it's time for an update, and where to start.",
      published: true,
    },
    { onConflict: "slug" }
  );

  console.log("Seed complete.");
}

main();
