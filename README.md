# Our Memory 💕

属于我们俩的小角落。Next.js (App Router) + Tailwind + 三套可切换主题，PWA 友好（iPhone 也能加到桌面）。

## 已经能跑的功能

- 🌸 **三种主题**：少女粉 / 极简白 / 复古胶片，右上角一键切换，记忆在浏览器本地
- 🔒 **共享密码登录**：两人各自一个密码，cookie 持久一年，HMAC 签名
- 🍱 **点菜模块**：菜谱卡片网格 + "点这道" → 通过微信推送通知对方
- 🌤️ **每天早上推送**：天气 + 穿衣建议 + 暖心话，发到女朋友微信
- 🏠 首页 + 占位的纪念日 / 足迹 / 回忆 / 小游戏页面

## 第一次启动

```powershell
cd C:\Users\Administrator\our-memory
copy .env.local.example .env.local
# 然后用编辑器把 .env.local 里的值填上（见下面）
npm run dev
```

打开 http://localhost:3000 → 用 `HER_PASSWORD` 或 `HIS_PASSWORD` 登录。

## 需要申请的三个东西

### 1. WxPusher (微信推送 · 免费)

> 文档：<https://wxpusher.zjiecode.com/docs/>

1. 进官网 → 微信扫码登录
2. 创建一个应用 → 拿到 **APP_TOKEN** → 填入 `WXPUSHER_APP_TOKEN`
3. 你和女朋友各自扫这个应用的关注二维码（关注后会拿到一个 **UID**）
4. UID 填进 `WXPUSHER_UID_HER` / `WXPUSHER_UID_HIM`

### 2. 和风天气 (QWeather · 免费)

> 文档：<https://dev.qweather.com/docs/>

1. 注册账号 → 控制台 → 创建项目 → 创建 KEY（选择"Web API"）
2. KEY 填到 `QWEATHER_KEY`
3. 找你所在城市的 LocationID：<https://github.com/qwd/LocationList>
   - 例：北京 `101010100`、上海 `101020100`、广州 `101280101`
4. 填到 `QWEATHER_LOCATION_ID` 和 `QWEATHER_CITY_NAME`

### 3. 登录密码 / 签名密钥 / Cron 密钥

随便设置三个长随机字符串，分别填到 `HER_PASSWORD` / `HIS_PASSWORD` / `AUTH_SECRET` / `CRON_SECRET`。

## 测试早安推送

`.env.local` 填好后：

```powershell
npm run push:test       # 默认推给老婆 (her)
$env:TO="him"; npm run push:test    # 推给老公
$env:TO="both"; npm run push:test   # 两人都推
```

如果配置没问题，几秒后微信里就会收到一条"早安"消息。

## 让它每天 7 点自动推送

`/api/cron/morning-push` 这条 API 接受 GET 请求，带上 `x-cron-secret` 头部或 `?secret=` 查询参数即可触发。三种部署方式：

### A. 部署到 Vercel（推荐，免费）

```powershell
npm i -g vercel
vercel
```

仓库里已经有 `vercel.json`，里面写了：

```json
{ "crons": [{ "path": "/api/cron/morning-push", "schedule": "0 23 * * *" }] }
```

> **注意**：Vercel cron 用 UTC，`0 23 * * *` = 北京时间次日 **07:00**。
> Vercel 会自动用 `Authorization: Bearer $CRON_SECRET` 调用，注意把 `CRON_SECRET` 加到 Vercel 环境变量里。

### B. 用免费 cron-job.org

1. 注册 <https://cron-job.org>
2. 新建任务：
   - URL：`https://你的域名/api/cron/morning-push?secret=填CRON_SECRET`
   - 时区：Asia/Shanghai
   - 时间：每天 07:00
3. 保存即可

### C. 部署在自己的服务器/电脑上

用 Windows 任务计划程序或 Linux crontab，每天 07:00 执行：

```powershell
curl -H "x-cron-secret: 你的CRON_SECRET" https://你的域名/api/cron/morning-push
```

## 项目结构

```
our-memory/
├── app/                # Next.js App Router 页面
│   ├── api/            # 后端路由（登录、点菜、cron）
│   ├── recipes/        # 点菜模块
│   ├── login/          # 登录页
│   └── ...             # 其他模块占位
├── components/         # 共享组件（导航、主题）
├── lib/                # 工具函数
│   ├── auth.ts         # HMAC cookie session（Edge 兼容）
│   ├── wxpusher.ts     # 微信推送
│   ├── weather.ts      # 和风天气 + 穿衣建议
│   ├── messages.ts     # 暖心话池子
│   └── recipes.ts      # 菜谱数据
├── data/recipes.json   # 菜谱列表（改这里加菜）
├── scripts/test-push.ts# 本地测试推送
└── middleware.ts       # 强制登录
```

## 接下来可以加的

- **纪念日**：用 JSON 或简单数据库存日期，倒计时 + 当天弹回忆
- **足迹地图**：接高德地图 JS API，每个标点带照片和小作文
- **回忆相册**：图片上传到 Cloudflare R2 / 阿里云 OSS，时间轴展示
- **小游戏**：每日一问、关于彼此的小测试、你画我猜（需要 websocket）
- **数据库**：现在菜谱是 JSON，加更多动态内容时换成 Supabase 或 SQLite
- **PWA manifest**：让她能"添加到主屏幕"，体验更像 App

## 暖心话池子在哪改

[lib/messages.ts](lib/messages.ts) 顶部的 `MESSAGES` 数组。按天循环挑选，所以加得越多重复得越少。

可以考虑写满 30~50 条，再分类（普通早安 / 加班日 / 周一 / 周末 / 周五），按场景挑——这一步我没做，留给你按你俩的相处方式调。
