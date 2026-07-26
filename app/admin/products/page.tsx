"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Pencil, Plus } from "lucide-react";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-gold text-xs">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="card-lux overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-onyx/5 text-xs uppercase tracking-wider text-onyx/40 dark:border-pearl/10 dark:text-pearl/40">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Clicks</th>
              <th className="p-4">Flags</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-onyx/5 dark:divide-pearl/10">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-champagne/40">
                    <Image src={product.image_url} alt={product.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="p-4 text-onyx/60 dark:text-pearl/60">{product.categories?.name ?? "—"}</td>
                <td className="p-4 font-mono">{product.price ? `$${product.price}` : "—"}</td>
                <td className="p-4">{product.click_count}</td>
                <td className="p-4 space-x-1">
                  {product.is_featured && <span className="seal">Featured</span>}
                  {product.is_best_seller && <span className="seal">Best Seller</span>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} aria-label="Edit">
                      <Pencil className="h-4 w-4 text-onyx/50 hover:text-gold-dark" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-onyx/50 hover:text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && products.length === 0 && (
          <p className="p-10 text-center text-sm text-onyx/50">No products yet — add your first one.</p>
        )}
        {loading && <p className="p-10 text-center text-sm text-onyx/50">Loading…</p>}
      </div>
    </div>
  );
}
