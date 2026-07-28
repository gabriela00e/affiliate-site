import { getBestSellers } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = {
  title: "Best Sellers",
  description: "The most-clicked, most-loved Amazon beauty picks from our readers.",
};
export const revalidate = 3600;

export default async function BestSellersPage() {
  const products = await getBestSellers(24);

  return (
    <div className="container-lux py-10">
      <h1 className="font-display text-3xl">🏆 Best Sellers</h1>
      <p className="mt-2 max-w-xl text-onyx/60 dark:text-pearl/60">
        Ranked by reader engagement — the products our community clicks and buys the most.
      </p>
      <div className="mt-8">
        <ProductGrid products={products} emptyMessage="Mark products as Best Sellers from the admin dashboard to feature them here." />
      </div>
    </div>
  );
}
