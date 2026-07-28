import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `Shop the best ${category.name} picks on Amazon.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(params.slug),
  ]);

  return (
    <div className="container-lux py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl">
          {category.icon} {category.name}
        </h1>
        {category.description && <p className="mt-2 max-w-xl text-onyx/60 dark:text-pearl/60">{category.description}</p>}
      </div>
      <div className="mb-8">
        <CategoryFilter categories={categories} activeSlug={category.slug} />
      </div>
      <ProductGrid products={products} emptyMessage="No products in this category yet — check back soon." />
    </div>
  );
}
