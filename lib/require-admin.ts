import "server-only";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await verifyAdminSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}
