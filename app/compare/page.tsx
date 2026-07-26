"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { useLists } from "@/components/providers/ListsProvider";
import { StarRating } from "@/components/StarRating";
import { BuyNowButton } from "@/components/BuyNowButton";
import { formatPrice } from "@/lib/utils";
import { X } from "lucide-react";

export default function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useLists();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compare.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: compare }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [compare]);

  return (
    <div className="container-lux py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">⚖️ Compare Products</h1>
          <p className="mt-2 text-onyx/60 dark:text-pearl/60">Up to 4 products side by side.</p>
        </div>
        {products.length > 0 && (
          <button onClick={clearCompare} className="btn-outline text-xs">
            Clear all
          </button>
        )}
      </div>

      {loading ? (
        <p className="mt-8 text-onyx/50">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-onyx/15 py-20 text-center text-onyx/50">
          Add products to compare using the scale icon on any product card.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-32" />
                {products.map((p) => (
                  <th key={p.id} className="p-4">
                    <div className="relative mb-3 flex justify-end">
                      <button onClick={() => toggleCompare(p.id)} aria-label="Remove from comparison">
                        <X className="h-4 w-4 text-onyx/40" />
                      </button>
                    </div>
                    <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-xl bg-champagne/40">
                      <Image src={p.image_url} alt={p.name} fill sizes="112px" className="object-cover" />
                    </div>
                    <Link href={`/product/${p.slug}`} className="mt-3 block font-display text-base hover:text-gold-dark">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-onyx/5 dark:divide-pearl/10">
              <tr>
                <td className="p-4 font-semibold text-onyx/50">Category</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">{p.categories?.name ?? "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-onyx/50">Price</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 font-mono">{formatPrice(p.price, p.currency) ?? "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-onyx/50">Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <StarRating rating={p.rating} count={p.rating_count} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-onyx/50">Description</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-onyx/70 dark:text-pearl/70">{p.short_description}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4" />
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <BuyNowButton productId={p.id} affiliateLink={p.affiliate_link} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
