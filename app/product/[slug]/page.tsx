import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getSimilarProducts,
  getReviewsForProduct,
  getAllProducts,
} from "@/lib/queries";
import { StarRating } from "@/components/StarRating";
import { BuyNowButton } from "@/components/BuyNowButton";
import { WishlistButton } from "@/components/WishlistButton";
import { ShareButtons } from "@/components/ShareButtons";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { ProductGrid } from "@/components/ProductGrid";
import { formatPrice, siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    // If Supabase is unreachable at build time, skip prebuilding product
    // pages — they'll still render correctly on-demand at request time.
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.short_description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [{ url: product.image_url }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [similar, reviews] = await Promise.all([
    getSimilarProducts(product),
    getReviewsForProduct(product.id),
  ]);

  const price = formatPrice(product.price, product.currency);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: product.image_url,
    aggregateRating: product.rating_count > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.rating_count,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: product.price ?? undefined,
      priceCurrency: product.currency,
      url: product.affiliate_link,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="container-lux py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-onyx/50 dark:text-pearl/50">
        <Link href="/">Home</Link> /{" "}
        {product.categories && (
          <>
            <Link href={`/category/${product.categories.slug}`}>{product.categories.name}</Link> /{" "}
          </>
        )}
        <span className="text-onyx dark:text-pearl">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-champagne/40">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {(product.is_best_seller || product.is_featured) && (
            <span className="seal absolute left-4 top-4">
              {product.is_best_seller ? "Best Seller" : "Editor's Pick"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {product.categories && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
              {product.categories.name}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl">{product.name}</h1>
          <StarRating rating={product.rating} count={product.rating_count} size="md" />
          {price && <p className="font-mono text-2xl font-semibold">{price}</p>}
          <p className="text-onyx/70 dark:text-pearl/70">{product.short_description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <BuyNowButton productId={product.id} affiliateLink={product.affiliate_link} />
            <WishlistButton productId={product.id} className="static" />
          </div>

          <div className="pt-2">
            <ShareButtons
              url={siteUrl(`/product/${product.slug}`)}
              title={product.name}
              image={product.image_url}
            />
          </div>

          {product.long_description && (
            <div className="prose prose-sm mt-4 max-w-none text-onyx/70 dark:text-pearl/70">
              <h3 className="font-display text-lg text-onyx dark:text-pearl">Details</h3>
              <p>{product.long_description}</p>
            </div>
          )}

          <p className="mt-4 rounded-xl bg-champagne/40 p-3 text-xs text-onyx/50 dark:bg-onyx2 dark:text-pearl/50">
            As an Amazon Associate, we earn from qualifying purchases made through the Buy Now link above.
          </p>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-2xl">Customer reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
        <div>
          <ReviewForm productId={product.id} />
        </div>
      </section>

      {/* Similar products */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl">You may also like</h2>
          <ProductGrid products={similar} />
        </section>
      )}
    </div>
  );
}
