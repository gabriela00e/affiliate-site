"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types";
import slugify from "slugify";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    short_description: product?.short_description ?? "",
    long_description: product?.long_description ?? "",
    image_url: product?.image_url ?? "",
    price: product?.price?.toString() ?? "",
    affiliate_link: product?.affiliate_link ?? "",
    category_id: product?.category_id ?? "",
    is_featured: product?.is_featured ?? false,
    is_best_seller: product?.is_best_seller ?? false,
    top_10_rank: product?.top_10_rank?.toString() ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.name, { lower: true, strict: true }),
      price: form.price ? Number(form.price) : null,
      top_10_rank: form.top_10_rank ? Number(form.top_10_rank) : null,
    };

    try {
      const res = await fetch(
        product ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save product");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-lux max-w-2xl space-y-5 p-8">
      <div>
        <label className="mb-1 block text-sm font-medium">Product name</label>
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug (auto-generated if blank)</label>
        <input
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="e.g. vitamin-c-serum"
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Short description</label>
        <textarea
          required
          rows={2}
          value={form.short_description}
          onChange={(e) => update("short_description", e.target.value)}
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Long description</label>
        <textarea
          rows={4}
          value={form.long_description}
          onChange={(e) => update("long_description", e.target.value)}
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Image URL</label>
        <input
          required
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="https://…"
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Price (optional)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Top 10 rank (optional)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={form.top_10_rank}
            onChange={(e) => update("top_10_rank", e.target.value)}
            className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Amazon affiliate link</label>
        <input
          required
          type="url"
          value={form.affiliate_link}
          onChange={(e) => update("affiliate_link", e.target.value)}
          placeholder="https://www.amazon.com/dp/XXXXXXX?tag=yourtag-20"
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          required
          value={form.category_id}
          onChange={(e) => update("category_id", e.target.value)}
          className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => update("is_featured", e.target.checked)}
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_best_seller}
            onChange={(e) => update("is_best_seller", e.target.checked)}
          />
          Best seller
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
