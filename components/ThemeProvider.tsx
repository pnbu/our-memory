"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "pink" | "minimal" | "retro";

export const THEMES: { id: ThemeId; name: string; emoji: string }[] = [
  { id: "pink", name: "少女粉", emoji: "🌸" },
  { id: "minimal", name: "极简白", emoji: "⚪" },
  { id: "retro", name: "复古胶片", emoji: "🎞️" },
];

type Ctx = { theme: ThemeId; setTheme: (t: ThemeId) => void; cycle: () => void };
const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("pink");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) setThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (t: ThemeId) => setThemeState(t);
  const cycle = () => {
    const i = THEMES.findIndex((t) => t.id === theme);
    setThemeState(THEMES[(i + 1) % THEMES.length].id);
  };

  return <ThemeContext.Provider value={{ theme, setTheme, cycle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
