"use client";

import { Scale } from "lucide-react";
import { useLists } from "@/components/providers/ListsProvider";
import { cn } from "@/lib/utils";

export function CompareToggle({ productId, className }: { productId: string; className?: string }) {
  const { isComparing, toggleCompare } = useLists();
  const active = isComparing(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleCompare(productId);
      }}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      aria-pressed={active}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lux transition-transform hover:scale-110 dark:bg-onyx2/90",
        className
      )}
    >
      <Scale className={cn("h-4 w-4", active ? "text-gold-dark" : "text-onyx/50 dark:text-pearl/60")} />
    </button>
  );
}
