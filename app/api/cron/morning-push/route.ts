import { NextResponse } from "next/server";
import { getWeather, outfitAdvice } from "@/lib/weather";
import { morningMessage, pickDailyMessage } from "@/lib/messages";
import { wxpush } from "@/lib/wxpusher";

// Trigger via:  curl -H "x-cron-secret: $CRON_SECRET" https://your-domain/api/cron/morning-push
// Or via Vercel Cron / cron-job.org / Cloudflare Workers Cron, with the secret in env.

export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-cron-secret");
  if (header && header === secret) return true;
  // Vercel Cron passes Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization");
  if (auth && auth === `Bearer ${secret}`) return true;
  // Allow ?secret= for very simple external cron services
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

async function run(req: Request, audience: "her" | "him" | "both" = "her") {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const w = await getWeather();
    const outfit = outfitAdvice(w.today.tempMax, w.today.tempMin, w.today.textDay);
    const warm = pickDailyMessage();
    const content = morningMessage({
      city: w.city,
      text: w.today.textDay,
      tempMin: w.today.tempMin,
      tempMax: w.today.tempMax,
      outfit,
      warm,
    });
    await wxpush({ content, summary: `早安｜${w.today.tempMin}~${w.today.tempMax}°C`, to: audience });
    return NextResponse.json({ ok: true, content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return run(req, "her");
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const to = (url.searchParams.get("to") as "her" | "him" | "both" | null) ?? "her";
  return run(req, to);
}
