import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL;
  const validHash = process.env.ADMIN_PASSWORD_HASH;

  if (!validEmail || !validHash) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 }
    );
  }

  if (email !== validEmail || !verifyPassword(password ?? "", validHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createAdminSession(email);
  return NextResponse.json({ ok: true });
}
