import { NextResponse } from "next/server";
import { COOKIE_NAME, checkPassword, createSessionToken } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password) return NextResponse.json({ error: "缺少密码" }, { status: 400 });

  const role = checkPassword(password);
  if (!role) return NextResponse.json({ error: "密码不对" }, { status: 401 });

  const token = await createSessionToken(role);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
