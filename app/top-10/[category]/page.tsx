import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getTop10 } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return {};
  return {
    title: `Top 10 ${category.name} Products`,
    description: `Our ranked top 10 ${category.name.toLowerCase()} picks on Amazon.`,
  };
}

export default async function Top10CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = await getTop10(params.category);

  return (
    <div className="container-lux py-10">
      <h1 className="font-display text-3xl">
        {category.icon} Top 10 {category.name}
      </h1>
      <p className="mt-2 text-onyx/60 dark:text-pearl/60">Ranked #1 to #10, updated regularly by our editors.</p>

      <div className="mt-8 space-y-6">
        {products.map((product, i) => (
          <div key={product.id} className="flex items-start gap-4">
            <span className="font-display text-4xl text-gold/60">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-onyx/15 py-20 text-center text-onyx/50 dark:border-pearl/15">
            No ranked products yet for this category.
          </p>
        )}
      </div>
    </div>
  );
}
