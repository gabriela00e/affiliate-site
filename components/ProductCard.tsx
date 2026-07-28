import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { StarRating } from "@/components/StarRating";
import { WishlistButton } from "@/components/WishlistButton";
import { CompareToggle } from "@/components/CompareToggle";
import { formatPrice, truncate } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = formatPrice(product.price, product.currency);

  return (
    <div className="card-lux group relative flex flex-col overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-champagne/40">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(product.is_best_seller || product.is_featured) && (
          <span className="seal absolute left-3 top-3">
            {product.is_best_seller ? "Best Seller" : "Editor's Pick"}
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <WishlistButton productId={product.id} />
          <CompareToggle productId={product.id} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.categories?.name && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
            {product.categories.name}
          </span>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-base leading-snug transition-colors group-hover:text-gold-dark">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-onyx/60 dark:text-pearl/60">{truncate(product.short_description, 80)}</p>
        <StarRating rating={product.rating} count={product.rating_count} />
        <div className="mt-auto flex items-center justify-between pt-2">
          {price ? <span className="font-mono text-sm font-semibold">{price}</span> : <span />}
          <Link
            href={`/product/${product.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-gold-dark hover:underline"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
