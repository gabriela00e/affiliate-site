import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/queries";

export async function POST(request: Request) {
  const { ids } = await request.json();
  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "ids must be an array" }, { status: 400 });
  }
  const products = await getProductsByIds(ids);
  return NextResponse.json({ products });
}
