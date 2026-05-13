import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Our Memory · 我们的回忆",
  description: "属于我们俩的小角落",
};

export const viewport: Viewport = {
  themeColor: "#fff4f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
