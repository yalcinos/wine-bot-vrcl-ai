import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export async function rateLimitRequest(ip: any): Promise<{
  success: boolean;
  limit: number;
  reset: number;
  remaining: number;
}> {
  const ratelimit = new Ratelimit({
    redis: kv,
    // rate limit to 5 requests per 10 seconds
    limiter: Ratelimit.slidingWindow(5, "10s"),
  });

  return await ratelimit.limit(`ratelimit_${ip}`);
}
