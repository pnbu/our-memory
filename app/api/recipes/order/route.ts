import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";
import { wxpush } from "@/lib/wxpusher";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const role = await verifySessionToken(match?.[1]);
  if (!role) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id, note } = (await req.json().catch(() => ({}))) as { id?: string; note?: string };
  if (!id) return NextResponse.json({ error: "缺少菜品" }, { status: 400 });
  const recipe = getRecipe(id);
  if (!recipe) return NextResponse.json({ error: "找不到这道菜" }, { status: 404 });

  const audience: "her" | "him" = role === "her" ? "him" : "her";
  const who = role === "her" ? "老婆" : "老公";

  const content = [
    `🔔 ${who}下单啦`,
    `想吃：${recipe.name}（${recipe.minutes} 分钟）`,
    recipe.desc ? `备注：${recipe.desc}` : null,
    note ? `留言：${note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await wxpush({ content, summary: `${who}想吃${recipe.name}`, to: audience });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
