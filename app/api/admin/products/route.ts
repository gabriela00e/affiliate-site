import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/require-admin";
import slugify from "slugify";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const supabase = createAdminClient();

  const slug = body.slug?.trim() || slugify(body.name, { lower: true, strict: true });

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: body.name,
      slug,
      short_description: body.short_description,
      long_description: body.long_description ?? null,
      image_url: body.image_url,
      gallery_urls: body.gallery_urls ?? [],
      price: body.price ?? null,
      rating: body.rating ?? 0,
      affiliate_link: body.affiliate_link,
      category_id: body.category_id,
      is_featured: !!body.is_featured,
      is_best_seller: !!body.is_best_seller,
      top_10_rank: body.top_10_rank ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
