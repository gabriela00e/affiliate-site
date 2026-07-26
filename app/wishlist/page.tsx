"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useLists } from "@/components/providers/ListsProvider";
import { ProductGrid } from "@/components/ProductGrid";

export default function WishlistPage() {
  const { wishlist } = useLists();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: wishlist }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="container-lux py-10">
      <h1 className="font-display text-3xl">💗 Your Wishlist</h1>
      <p className="mt-2 text-onyx/60 dark:text-pearl/60">Saved on this device — items stay here until you remove them.</p>

      <div className="mt-8">
        {loading ? (
          <p className="text-onyx/50">Loading…</p>
        ) : (
          <ProductGrid products={products} emptyMessage="Your wishlist is empty. Tap the heart icon on any product to save it here." />
        )}
      </div>
    </div>
  );
}
