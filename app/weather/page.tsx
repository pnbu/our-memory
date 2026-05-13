export default function WeatherInfoPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">每天的早安推送</h1>
      <div className="card p-6 space-y-3">
        <p>
          每天早上 7 点（可改），我会自动给你发一条微信：
        </p>
        <pre className="bg-bg p-3 rounded text-sm whitespace-pre-wrap">
{`☀️ 早安呀～
北京今天：晴，14~24°C
穿衣建议：短袖+薄外套，早晚有点凉

希望今天的你，少一点工位的烦躁，多一点小确幸 ☕`}
        </pre>
        <p className="text-sm text-muted">
          这条推送通过 WxPusher 公众号发到你的微信。第一次需要扫码关注 WxPusher 并把 UID 填到环境变量里。
        </p>
      </div>
    </div>
  );
}
