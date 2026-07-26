import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const supabase = createAdminClient();

  const [{ count: productCount }, { count: subscriberCount }, { count: reviewCount }, { data: topProducts }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("id, name, slug, click_count, image_url")
        .order("click_count", { ascending: false })
        .limit(10),
    ]);

  const { count: totalClicks } = await supabase
    .from("clicks")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    productCount: productCount ?? 0,
    subscriberCount: subscriberCount ?? 0,
    reviewCount: reviewCount ?? 0,
    totalClicks: totalClicks ?? 0,
    topProducts: topProducts ?? [],
  });
}
