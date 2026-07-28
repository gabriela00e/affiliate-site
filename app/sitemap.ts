import type { MetadataRoute } from "next";
import { getAllProducts, getCategories, getBlogPosts } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    getAllProducts().catch(() => []),
    getCategories().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const staticRoutes = [
    "",
    "/search",
    "/best-sellers",
    "/top-10",
    "/blog",
    "/compare",
    "/wishlist",
    "/privacy-policy",
    "/affiliate-disclosure",
  ].map((path) => ({
    url: siteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const productRoutes = products.map((p) => ({
    url: siteUrl(`/product/${p.slug}`),
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: siteUrl(`/category/${c.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: siteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
