-- ============================================================
-- Lumière Picks — Amazon Affiliate Store schema (Supabase/Postgres)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- categories ----------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz default now()
);

-- ---------- products ----------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  short_description text not null,
  long_description text,
  image_url text not null,
  gallery_urls text[] default '{}',
  price numeric(10,2),
  currency text default 'USD',
  rating numeric(2,1) default 0 check (rating >= 0 and rating <= 5),
  rating_count integer default 0,
  affiliate_link text not null,
  category_id uuid references categories(id) on delete set null,
  is_featured boolean default false,
  is_best_seller boolean default false,
  top_10_rank integer, -- 1-10 within its category for "Top 10" pages, null = not ranked
  click_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_products_best_seller on products(is_best_seller);

-- ---------- reviews ----------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  approved boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_reviews_product on reviews(product_id);

-- ---------- clicks (affiliate link click tracking) ----------
create table if not exists clicks (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_clicks_product on clicks(product_id);
create index if not exists idx_clicks_date on clicks(created_at);

-- ---------- blog posts ----------
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  published boolean default true,
  created_at timestamptz default now()
);

-- ---------- newsletter subscribers ----------
create table if not exists subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz default now()
);

-- ---------- trigger: keep updated_at fresh ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
before update on products
for each row execute function set_updated_at();

-- ---------- trigger: recompute rating aggregate on new review ----------
create or replace function refresh_product_rating()
returns trigger as $$
begin
  update products p
  set rating = coalesce((select avg(rating)::numeric(2,1) from reviews where product_id = p.id and approved = true), 0),
      rating_count = (select count(*) from reviews where product_id = p.id and approved = true)
  where p.id = coalesce(new.product_id, old.product_id);
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_reviews_rating on reviews;
create trigger trg_reviews_rating
after insert or update or delete on reviews
for each row execute function refresh_product_rating();

-- ---------- Row Level Security ----------
alter table categories enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;
alter table clicks enable row level security;
alter table blog_posts enable row level security;
alter table subscribers enable row level security;

-- Public read access (storefront is public)
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read approved reviews" on reviews for select using (approved = true);
create policy "public read published posts" on blog_posts for select using (published = true);

-- Public can submit reviews & subscribe, but not read/modify others' rows arbitrarily
create policy "public insert reviews" on reviews for insert with check (true);
create policy "public insert subscribers" on subscribers for insert with check (true);
create policy "public insert clicks" on clicks for insert with check (true);

-- All writes to products/categories/blog_posts happen via the service-role key
-- from server-side admin routes only (service role bypasses RLS), so no
-- public write policies are defined for those tables.

-- ---------- seed categories ----------
insert into categories (name, slug, description, icon) values
  ('Skincare', 'skincare', 'Cleansers, serums, moisturizers and treatments.', '✨'),
  ('Hair Care', 'hair-care', 'Shampoos, conditioners, styling & treatments.', '💇'),
  ('Body Care', 'body-care', 'Body wash, lotions, scrubs and self-care.', '🛁'),
  ('Makeup', 'makeup', 'Face, eyes, lips and complexion essentials.', '💄'),
  ('Fragrance', 'fragrance', 'Perfumes, mists and scented body care.', '🌸')
on conflict (slug) do nothing;
