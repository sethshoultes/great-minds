import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;

const minuteLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:chat:min" })
  : null;
const dayLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(200, "1 d"), prefix: "rl:chat:day" })
  : null;

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // unset → skip in dev
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json().catch(() => ({}));
  return Boolean(data?.success);
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").split(",")[0].trim();

  let body: {
    messages?: Array<{ role: "user" | "assistant"; content: string }>;
    system?: string;
    model?: string;
    max_tokens?: number;
    turnstileToken?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { messages, system, model, max_tokens, turnstileToken } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(turnstileToken, ip);
    if (!ok) return NextResponse.json({ error: "turnstile verification failed" }, { status: 403 });
  }

  if (minuteLimiter && dayLimiter) {
    const [perMin, perDay] = await Promise.all([
      minuteLimiter.limit(ip),
      dayLimiter.limit(ip),
    ]);
    if (!perMin.success) {
      return NextResponse.json(
        { error: "rate limit: too many requests this minute", retryAfter: Math.ceil((perMin.reset - Date.now()) / 1000) },
        { status: 429 },
      );
    }
    if (!perDay.success) {
      return NextResponse.json(
        { error: "rate limit: daily quota exceeded", retryAfter: Math.ceil((perDay.reset - Date.now()) / 1000) },
        { status: 429 },
      );
    }
  }

  try {
    const response = await anthropic.messages.create({
      model: model || "claude-sonnet-4-5",
      max_tokens: Math.min(Math.max(max_tokens || 1024, 64), 4096),
      ...(system ? { system } : {}),
      messages,
    });
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");
    return NextResponse.json({ text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "upstream error";
    return NextResponse.json({ error: "upstream", detail: msg }, { status: 502 });
  }
}
