import Link from "next/link";

const tiles = [
  { href: "/recipes", title: "今天吃什么", desc: "老婆点菜，厨师收单", emoji: "🍱" },
  { href: "/anniversaries", title: "纪念日", desc: "倒数那些重要的日子", emoji: "💝" },
  { href: "/map", title: "我们去过的地方", desc: "把脚印贴在地图上", emoji: "🗺️" },
  { href: "/memories", title: "回忆相册", desc: "存下每个值得的瞬间", emoji: "📷" },
  { href: "/games", title: "无聊小游戏", desc: "上班摸鱼神器", emoji: "🎮" },
  { href: "/weather", title: "今日天气穿衣", desc: "每天早上推送到你的微信", emoji: "🌤️" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          欢迎来到我们俩的小世界
        </h1>
        <p className="text-muted mt-3">
          记录我们的每一天 · 点右上角可以切换风格
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card p-4 md:p-5 hover:-translate-y-0.5 transition block">
            <div className="text-3xl mb-2">{t.emoji}</div>
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-muted mt-1">{t.desc}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
