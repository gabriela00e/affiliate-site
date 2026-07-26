import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i <= Math.round(rating) ? "fill-gold text-gold" : "fill-transparent text-onyx/20 dark:text-pearl/20"
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-onyx/50 dark:text-pearl/50">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
