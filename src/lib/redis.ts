import { Redis } from "@upstash/redis";

export function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Redis env vars not set (UPSTASH_REDIS_REST_URL/KV_REST_API_URL)");
  }
  return new Redis({ url, token });
}
