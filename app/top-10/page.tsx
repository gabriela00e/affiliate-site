import Link from "next/link";
import { getCategories, getTop10 } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = {
  title: "Top 10 Products",
  description: "Our editors' top 10 picks across every category, ranked and updated regularly.",
};
export const revalidate = 3600;

export default async function Top10Page() {
  const [categories, overall] = await Promise.all([getCategories(), getTop10()]);

  return (
    <div className="container-lux py-10">
      <h1 className="font-display text-3xl">🥇 Top 10 Products</h1>
      <p className="mt-2 max-w-xl text-onyx/60 dark:text-pearl/60">
        Ranked picks across the board — or jump into a category-specific Top 10 below.
      </p>

      <div className="my-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/top-10/${c.slug}`}
            className="rounded-full border border-onyx/10 px-4 py-2 text-sm font-medium hover:border-gold dark:border-pearl/15"
          >
            {c.icon} Top 10 {c.name}
          </Link>
        ))}
      </div>

      <ProductGrid products={overall} emptyMessage="Assign a Top 10 rank to products from the admin dashboard to build this list." />
    </div>
  );
}
