import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Uses the service-role client because it also increments a counter on the
// products table, which is not writable by the public anon key.
export async function POST(request: Request) {
  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  await supabase.from("clicks").insert({
    product_id: productId,
    referrer: request.headers.get("referer") ?? null,
    user_agent: request.headers.get("user-agent") ?? null,
  });

  const { data: product } = await supabase
    .from("products")
    .select("click_count")
    .eq("id", productId)
    .single();

  if (product) {
    await supabase
      .from("products")
      .update({ click_count: (product.click_count ?? 0) + 1 })
      .eq("id", productId);
  }

  return NextResponse.json({ ok: true });
}
