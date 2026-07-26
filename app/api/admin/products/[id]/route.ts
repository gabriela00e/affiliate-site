import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ product: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      name: body.name,
      slug: body.slug,
      short_description: body.short_description,
      long_description: body.long_description ?? null,
      image_url: body.image_url,
      gallery_urls: body.gallery_urls ?? [],
      price: body.price ?? null,
      affiliate_link: body.affiliate_link,
      category_id: body.category_id,
      is_featured: !!body.is_featured,
      is_best_seller: !!body.is_best_seller,
      top_10_rank: body.top_10_rank ?? null,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
