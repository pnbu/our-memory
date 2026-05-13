"use client";

import { useTheme, THEMES } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, cycle } = useTheme();
  const current = THEMES.find((t) => t.id === theme)!;
  return (
    <button
      onClick={cycle}
      className="btn-ghost btn"
      title="点击切换风格"
      aria-label="切换主题"
    >
      <span>{current.emoji}</span>
      <span className="text-sm">{current.name}</span>
    </button>
  );
}
