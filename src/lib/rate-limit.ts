import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash ratelimit if credentials exist, otherwise fallback safely
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? Redis.fromEnv() 
  : null;

const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"), // 20 requests per 10 seconds
  analytics: true,
}) : null;

export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!ratelimit) return true; // Bypass if Redis isn't configured yet
  const { success } = await ratelimit.limit(identifier);
  return success;
}