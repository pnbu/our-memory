// Manually trigger the morning push from your local machine.
// Usage:  npm run push:test
// Optional: TO=her|him|both npm run push:test

import { getWeather, outfitAdvice } from "../lib/weather";
import { morningMessage, pickDailyMessage } from "../lib/messages";
import { wxpush } from "../lib/wxpusher";

async function loadEnv() {
  // Minimal .env.local loader (no extra deps)
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  try {
    const text = await fs.readFile(path.resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  } catch {
    /* no .env.local — ignore */
  }
}

async function main() {
  await loadEnv();
  const to = (process.env.TO as "her" | "him" | "both") || "her";
  const w = await getWeather();
  const outfit = outfitAdvice(w.today.tempMax, w.today.tempMin, w.today.textDay);
  const content = morningMessage({
    city: w.city,
    text: w.today.textDay,
    tempMin: w.today.tempMin,
    tempMax: w.today.tempMax,
    outfit,
    warm: pickDailyMessage(),
  });
  console.log("--- Will send ---\n" + content + "\n-----------------");
  const res = await wxpush({ content, summary: `早安｜${w.today.tempMin}~${w.today.tempMax}°C`, to });
  console.log("Sent:", res);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
