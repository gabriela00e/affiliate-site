import { createClient } from "@/lib/supabase/server";
import type { Product, Category, Review, BlogPost } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getBestSellers(limit = 12): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_best_seller", true)
    .order("click_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getTop10(categorySlug?: string): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .not("top_10_rank", "is", null)
    .order("top_10_rank", { ascending: true })
    .limit(10);

  if (categorySlug) {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const supabase = createClient();
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

export async function getSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function searchProducts(term: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .or(`name.ilike.%${term}%,short_description.ilike.%${term}%`)
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .in("id", ids);
  if (error) throw error;
  return data ?? [];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}
