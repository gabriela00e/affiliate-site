import { getCategories, searchProducts, getAllProducts } from "@/lib/queries";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = { title: "Search products" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const term = searchParams.q?.trim() ?? "";
  const [categories, products] = await Promise.all([
    getCategories(),
    term ? searchProducts(term) : getAllProducts(),
  ]);

  return (
    <div className="container-lux py-10">
      <h1 className="font-display text-3xl">
        {term ? `Results for “${term}”` : "All products"}
      </h1>
      <p className="mt-2 text-sm text-onyx/50 dark:text-pearl/50">{products.length} products</p>

      <div className="my-8">
        <CategoryFilter categories={categories} />
      </div>

      <ProductGrid products={products} emptyMessage="No products matched your search. Try a different term." />
    </div>
  );
}
