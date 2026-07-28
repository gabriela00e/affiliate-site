import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts, getBestSellers, getBlogPosts } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, featured, bestSellers, posts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getBestSellers(4),
    getBlogPosts(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="container-lux flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <span className="seal">Curated · Tested · Amazon-Verified</span>
        <h1 className="max-w-3xl font-display text-4xl font-medium leading-tight sm:text-6xl">
          The beauty edit worth <em className="italic text-gold-dark">trusting</em>.
        </h1>
        <p className="max-w-xl text-onyx/60 dark:text-pearl/60">
          {SITE_NAME} rounds up the skincare, hair and makeup pieces that actually earn their
          shelf space — every pick linked straight to Amazon.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/best-sellers" className="btn-gold">Shop Best Sellers</Link>
          <Link href="/top-10" className="btn-outline">See Top 10 Lists</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container-lux py-10">
        <h2 className="mb-6 font-display text-2xl">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="card-lux flex flex-col items-center gap-2 px-4 py-8 text-center"
            >
              <span className="text-3xl">{category.icon}</span>
              <span className="text-sm font-semibold">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-lux py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl">Editor’s picks</h2>
          <Link href="/search" className="text-sm font-semibold text-gold-dark hover:underline">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} emptyMessage="Add featured products from the admin dashboard to showcase them here." />
      </section>

      {/* Best sellers band */}
      {bestSellers.length > 0 && (
        <section className="bg-onyx py-14 text-pearl">
          <div className="container-lux">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl">Best sellers this month</h2>
              <Link href="/best-sellers" className="text-sm font-semibold text-gold-light hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {bestSellers.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-onyx2">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      loading="lazy"
                      sizes="25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium">{product.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="container-lux py-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl">From the journal</h2>
            <Link href="/blog" className="text-sm font-semibold text-gold-dark hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card-lux overflow-hidden">
                {post.cover_image && (
                  <div className="relative aspect-video">
                    <Image src={post.cover_image} alt={post.title} fill loading="lazy" sizes="33vw" className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg">{post.title}</h3>
                  {post.excerpt && <p className="mt-2 text-sm text-onyx/60 dark:text-pearl/60">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="container-lux py-16">
        <div className="card-lux flex flex-col items-center gap-4 bg-gradient-to-br from-champagne to-blush-soft px-6 py-14 text-center">
          <h2 className="font-display text-3xl">Never miss a great find</h2>
          <p className="max-w-md text-sm text-onyx/60">
            Join the list for weekly picks, sale alerts, and honest first impressions.
          </p>
          <div className="w-full max-w-sm">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
