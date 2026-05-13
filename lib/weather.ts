// QWeather (和风天气) free-tier client.
// Docs: https://dev.qweather.com/docs/api/

export type WeatherNow = {
  temp: number;
  feelsLike: number;
  text: string;
  icon: string;
  windDir: string;
  windScale: string;
  humidity: number;
};

export type WeatherDaily = {
  tempMin: number;
  tempMax: number;
  textDay: string;
  textNight: string;
  uvIndex: number;
};

const NOW = "https://devapi.qweather.com/v7/weather/now";
const DAILY = "https://devapi.qweather.com/v7/weather/3d";

export async function getWeather(): Promise<{ now: WeatherNow; today: WeatherDaily; city: string }> {
  const key = process.env.QWEATHER_KEY;
  const location = process.env.QWEATHER_LOCATION_ID || "101010100";
  const city = process.env.QWEATHER_CITY_NAME || "你的城市";
  if (!key) throw new Error("QWEATHER_KEY is not set");

  const headers = { "Accept-Encoding": "identity" };
  const [nowRes, dailyRes] = await Promise.all([
    fetch(`${NOW}?location=${location}&key=${key}`, { headers }),
    fetch(`${DAILY}?location=${location}&key=${key}`, { headers }),
  ]);
  const nowData = await nowRes.json();
  const dailyData = await dailyRes.json();
  if (nowData.code !== "200" || dailyData.code !== "200") {
    throw new Error(`QWeather error: now=${nowData.code} daily=${dailyData.code}`);
  }

  const n = nowData.now;
  const d = dailyData.daily[0];
  return {
    city,
    now: {
      temp: Number(n.temp),
      feelsLike: Number(n.feelsLike),
      text: n.text,
      icon: n.icon,
      windDir: n.windDir,
      windScale: n.windScale,
      humidity: Number(n.humidity),
    },
    today: {
      tempMin: Number(d.tempMin),
      tempMax: Number(d.tempMax),
      textDay: d.textDay,
      textNight: d.textNight,
      uvIndex: Number(d.uvIndex),
    },
  };
}

export function outfitAdvice(tempMax: number, tempMin: number, textDay: string): string {
  const tips: string[] = [];
  const lowerText = textDay;
  if (/雨/.test(lowerText)) tips.push("今天会下雨，记得带伞 ☔");
  if (/雪/.test(lowerText)) tips.push("有雪，路滑慢点走 ❄️");
  if (/雷|暴/.test(lowerText)) tips.push("天气不太好，路上小心 ⚡");

  // Outfit based on max temp; pick min for outerwear suggestion
  if (tempMax >= 30) tips.push("短袖短裤，注意防晒，水水带够");
  else if (tempMax >= 25) tips.push("一件短袖就够啦，体感舒服");
  else if (tempMax >= 20) tips.push("短袖+薄外套，早晚有点凉");
  else if (tempMax >= 15) tips.push("长袖+薄外套，穿暖点");
  else if (tempMax >= 10) tips.push("外套+毛衣，注意保暖");
  else if (tempMax >= 5) tips.push("厚外套必备，最好加件围巾");
  else if (tempMax >= 0) tips.push("羽绒服上身，手套帽子安排起来");
  else tips.push("冰天雪地，能裹多厚裹多厚 🥶");

  if (tempMax - tempMin >= 10) tips.push("早晚温差大，建议带件外套");
  return tips.join("；");
}
