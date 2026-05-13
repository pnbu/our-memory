export default function GamesPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">无聊小游戏</h1>
      <div className="card p-6 text-muted">
        🚧 预计会做：
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>每日一问（轮流出题）</li>
          <li>你画我猜（实时）</li>
          <li>关于彼此的小测试（"我最喜欢的食物是？"）</li>
          <li>2048 / 数独 等单机摸鱼小游戏</li>
        </ul>
      </div>
    </div>
  );
}
