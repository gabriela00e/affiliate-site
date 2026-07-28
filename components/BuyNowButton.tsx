"use client";

import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function BuyNowButton({
  productId,
  affiliateLink,
  className,
  full,
}: {
  productId: string;
  affiliateLink: string;
  className?: string;
  full?: boolean;
}) {
  function handleClick() {
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <a
      href={affiliateLink}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={cn("btn-gold", full && "w-full", className)}
    >
      <ShoppingBag className="h-4 w-4" />
      Buy Now on Amazon
    </a>
  );
}
