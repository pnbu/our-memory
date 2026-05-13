"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "密码不对哦");
      } else {
        router.replace(next);
        router.refresh();
      }
    } catch {
      setError("网络出了点问题");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form onSubmit={submit} className="card p-6 w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">💕</div>
          <h1 className="font-display text-xl font-semibold">我们的小世界</h1>
          <p className="text-sm text-muted mt-1">输入只有我们俩知道的密码</p>
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="悄悄话密码"
          className="w-full px-3 py-2 rounded border bg-bg outline-none focus:border-accent"
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button className="btn w-full" disabled={loading || !password}>
          {loading ? "进来啦…" : "进入"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
