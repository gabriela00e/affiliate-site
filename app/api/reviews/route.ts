import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { productId, authorName, rating, comment } = await request.json();

  if (!productId || !authorName || !rating) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    author_name: authorName,
    rating,
    comment: comment ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: "Thanks for your review!" });
}
