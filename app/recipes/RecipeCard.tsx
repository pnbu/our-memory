"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function order() {
    setStatus("sending");
    setErrMsg(null);
    try {
      const res = await fetch("/api/recipes/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recipe.id, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "下单失败");
      setStatus("done");
      setOpen(false);
      setNote("");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e: unknown) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "下单失败");
    }
  }

  return (
    <div className="card overflow-hidden flex flex-col">
      <div
        className="aspect-[4/3] bg-bg bg-cover bg-center"
        style={{ backgroundImage: `url(${recipe.image})` }}
        aria-label={recipe.name}
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{recipe.name}</h3>
          <span className="text-xs text-muted">· {recipe.minutes} 分钟</span>
        </div>
        <p className="text-sm text-muted mt-1 flex-1">{recipe.desc}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {recipe.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        {!open ? (
          <button className="btn mt-4" onClick={() => setOpen(true)}>
            点这道 🍽️
          </button>
        ) : (
          <div className="mt-4 space-y-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="想说点什么（可选）"
              className="w-full px-3 py-2 rounded border bg-bg outline-none focus:border-accent text-sm"
            />
            <div className="flex gap-2">
              <button className="btn flex-1" onClick={order} disabled={status === "sending"}>
                {status === "sending" ? "下单中…" : "确认下单"}
              </button>
              <button className="btn-ghost btn" onClick={() => setOpen(false)}>
                取消
              </button>
            </div>
          </div>
        )}

        {status === "done" && <div className="text-xs text-accent mt-2">✅ 已通知厨师啦</div>}
        {status === "error" && <div className="text-xs text-red-500 mt-2">{errMsg}</div>}
      </div>
    </div>
  );
}
