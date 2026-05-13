// Minimal WxPusher client. Docs: https://wxpusher.zjiecode.com/docs/

type Audience = "her" | "him" | "both";

const ENDPOINT = "https://wxpusher.zjiecode.com/api/send/message";

export type SendOptions = {
  content: string;
  summary?: string;
  /** 1=text, 2=html, 3=markdown */
  contentType?: 1 | 2 | 3;
  to?: Audience;
  /** Optional URL the message links to */
  url?: string;
};

export async function wxpush(opts: SendOptions) {
  const appToken = process.env.WXPUSHER_APP_TOKEN;
  if (!appToken) throw new Error("WXPUSHER_APP_TOKEN is not set");

  const uidHer = process.env.WXPUSHER_UID_HER;
  const uidHim = process.env.WXPUSHER_UID_HIM;
  const to = opts.to ?? "both";
  const uids: string[] = [];
  if ((to === "her" || to === "both") && uidHer) uids.push(uidHer);
  if ((to === "him" || to === "both") && uidHim) uids.push(uidHim);
  if (uids.length === 0) throw new Error("No WxPusher UID configured for audience: " + to);

  const body = {
    appToken,
    content: opts.content,
    summary: (opts.summary ?? opts.content).slice(0, 100),
    contentType: opts.contentType ?? 1,
    uids,
    url: opts.url,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.code !== 1000) {
    throw new Error(`WxPusher send failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}
