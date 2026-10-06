// Fixed-window rate limiter. Uses Upstash Redis (or Vercel KV, which is Upstash) over REST when
// configured, so the limit holds across serverless instances; otherwise falls back to per-instance memory.

const memory = new Map();

function memoryHit(key, windowMs, now) {
  const recent = (memory.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > 5000) memory.clear();
  return recent.length;
}

function redisConfig(env) {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisHit(cfg, key, windowMs, fetchImpl) {
  const resp = await fetchImpl(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify([["INCR", key], ["PEXPIRE", key, String(windowMs)]]),
    signal: AbortSignal.timeout(1500),
  });
  if (!resp.ok) throw new Error(`rate limit store returned ${resp.status}`);
  const [incr] = await resp.json();
  if (typeof incr?.result !== "number") throw new Error("unexpected rate limit store response");
  return incr.result;
}

// Returns true when the caller is over the limit. If the shared store is down, it fails over to
// memory rather than blocking every user.
export async function isRateLimited(id, { limit, windowMs, env = process.env, fetchImpl = fetch, now = Date.now() }) {
  const cfg = redisConfig(env);
  if (cfg) {
    const key = `peq:rl:${id}:${Math.floor(now / windowMs)}`;
    try {
      return (await redisHit(cfg, key, windowMs, fetchImpl)) > limit;
    } catch (e) {
      console.error("Rate limit store unavailable, using memory:", e.message);
    }
  }
  return memoryHit(id, windowMs, now) > limit;
}

// Vercel sets x-real-ip; x-forwarded-for's first entry is the client elsewhere.
export function clientIp(headers) {
  return headers.get("x-real-ip") || (headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}
