export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string | null;
  image_url: string;
  gallery_urls: string[];
  price: number | null;
  currency: string;
  rating: number;
  rating_count: number;
  affiliate_link: string;
  category_id: string | null;
  is_featured: boolean;
  is_best_seller: boolean;
  top_10_rank: number | null;
  click_count: number;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
};

export type Review = {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
};

export type ClickStat = {
  product_id: string;
  count: number;
  product?: Product;
};

export type ProductFormInput = {
  name: string;
  slug: string;
  short_description: string;
  long_description?: string;
  image_url: string;
  gallery_urls?: string[];
  price?: number | null;
  rating?: number;
  affiliate_link: string;
  category_id: string;
  is_featured?: boolean;
  is_best_seller?: boolean;
  top_10_rank?: number | null;
};
