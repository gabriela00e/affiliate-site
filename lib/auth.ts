import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const alg = "HS256";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export async function verifyAdminSession(token?: string) {
  const raw = token ?? cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, getSecret());
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
