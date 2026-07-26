"use client";

import { Heart } from "lucide-react";
import { useLists } from "@/components/providers/ListsProvider";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { isWishlisted, toggleWishlist } = useLists();
  const active = isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleWishlist(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lux transition-transform hover:scale-110 dark:bg-onyx2/90",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", active ? "fill-blush text-blush" : "text-onyx/50 dark:text-pearl/60")} />
    </button>
  );
}
