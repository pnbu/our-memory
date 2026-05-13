// Edge-runtime compatible: uses Web Crypto API (no node:crypto).

export type Role = "her" | "him";
export const COOKIE_NAME = "om_session";

function secret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
}

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, "0");
  return s;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  return out;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function sign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufToHex(sig);
}

export async function createSessionToken(role: Role): Promise<string> {
  const payload = `${role}.${Date.now()}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<Role | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [role, ts, sig] = parts;
  if (role !== "her" && role !== "him") return null;
  const expected = await sign(`${role}.${ts}`);
  if (!timingSafeEqualBytes(hexToBytes(sig), hexToBytes(expected))) return null;
  return role;
}

export function checkPassword(input: string): Role | null {
  if (process.env.HER_PASSWORD && input === process.env.HER_PASSWORD) return "her";
  if (process.env.HIS_PASSWORD && input === process.env.HIS_PASSWORD) return "him";
  return null;
}
