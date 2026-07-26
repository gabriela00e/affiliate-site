import Link from "next/link";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export function CategoryFilter({ categories, activeSlug }: { categories: Category[]; activeSlug?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/search"
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-gold bg-gold text-onyx"
            : "border-onyx/10 text-onyx/70 hover:border-gold dark:border-pearl/15 dark:text-pearl/70"
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeSlug === category.slug
              ? "border-gold bg-gold text-onyx"
              : "border-onyx/10 text-onyx/70 hover:border-gold dark:border-pearl/15 dark:text-pearl/70"
          )}
        >
          {category.icon} {category.name}
        </Link>
      ))}
    </div>
  );
}
