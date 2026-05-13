"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

const items = [
  { href: "/", label: "首页", emoji: "🏠" },
  { href: "/recipes", label: "点菜", emoji: "🍱" },
  { href: "/anniversaries", label: "纪念日", emoji: "💝" },
  { href: "/map", label: "足迹", emoji: "🗺️" },
  { href: "/memories", label: "回忆", emoji: "📷" },
  { href: "/games", label: "小游戏", emoji: "🎮" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-bg/80 border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-display text-lg font-bold mr-2">
          💕 Our Memory
        </Link>
        <nav className="hidden md:flex gap-1 flex-1">
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-3 py-1.5 rounded text-sm transition ${
                  active ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"
                }`}
              >
                <span className="mr-1">{it.emoji}</span>
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </div>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border flex justify-around py-1.5">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center text-[10px] px-2 py-1 ${active ? "text-accent" : "text-muted"}`}
            >
              <span className="text-lg leading-none">{it.emoji}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
