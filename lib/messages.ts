// Pool of warm morning messages. Pick one deterministically per day so
// you don't see the same one twice in a row by accident.

const MESSAGES = [
  "早安宝贝，新的一天也要被你撒娇 🥺",
  "睁开眼睛的第一秒，就开始想你了 💭",
  "希望今天的你，少一点工位的烦躁，多一点小确幸 ☕",
  "天再冷，也冷不过我不在你身边的时候。今天也要好好的 🤍",
  "今天也是被你独占的一天，别让别人惹你不开心",
  "我把今天的好心情，提前打包寄给你了，签收一下 📦",
  "希望你今天遇到的事都好搞定，遇到的人都好相处",
  "如果今天有点累，记得：晚上有我等你回家 🏠",
  "你早上喝水了吗？没喝的话现在去倒一杯，听话 💧",
  "今天也请允许我，做你最大的小迷弟/小迷妹",
  "代表月亮把今天份的爱送到你工位上，签收一下",
  "无论今天的天气怎么样，你都是我的晴天 ☀️",
  "希望你今天的会议都很短，老板都很客气",
  "我们离下次见面又近了一天，开心一下 ☺️",
  "Worst case 今天是糟糕的一天，但你回来还有我。",
];

export function pickDailyMessage(date = new Date()): string {
  // Day-of-year index → stable per day, different across days.
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  const day = Math.floor(diff / 86400000);
  return MESSAGES[day % MESSAGES.length];
}

export function morningMessage(opts: {
  city: string;
  text: string;
  tempMin: number;
  tempMax: number;
  outfit: string;
  warm: string;
}): string {
  const { city, text, tempMin, tempMax, outfit, warm } = opts;
  return [
    "☀️ 早安呀～",
    `${city}今天：${text}，${tempMin}~${tempMax}°C`,
    `穿衣建议：${outfit}`,
    "",
    warm,
  ].join("\n");
}
