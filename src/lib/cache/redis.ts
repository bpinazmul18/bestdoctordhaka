import Redis from "ioredis";
import { getRequiredEnv } from "@/lib/utils/env";

function createRedisClient() {
  return new Redis(getRequiredEnv("REDIS_URL"));
}

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
