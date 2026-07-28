import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ products, emptyMessage }: { products: Product[]; emptyMessage?: string }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-onyx/15 py-20 text-center text-onyx/50 dark:border-pearl/15 dark:text-pearl/50">
        {emptyMessage ?? "No products found yet."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
