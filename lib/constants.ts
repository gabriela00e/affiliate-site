export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Lumière Picks";
export const SITE_DESCRIPTION =
  "Curated beauty picks, honest reviews, and the best Amazon finds in skincare, hair, body care and makeup.";

export const NAV_LINKS = [
  { label: "Shop", href: "/category/skincare" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Top 10", href: "/top-10" },
  { label: "Blog", href: "/blog" },
  { label: "Compare", href: "/compare" },
];

export const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

export const WISHLIST_STORAGE_KEY = "lumiere_wishlist";
export const COMPARE_STORAGE_KEY = "lumiere_compare";
export const COMPARE_MAX_ITEMS = 4;
