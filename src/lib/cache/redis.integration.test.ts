import Redis from "ioredis";
import { afterAll, describe, expect, it } from "vitest";
import { getRequiredEnv } from "@/lib/utils/env";

const redis = new Redis(getRequiredEnv("TEST_REDIS_URL"));

afterAll(() => {
  redis.disconnect();
});

describe("Redis test connection", () => {
  it("should respond to ping", async () => {
    const response = await redis.ping();

    expect(response).toBe("PONG");
  });

  it("should set and retrieve a value", async () => {
    await redis.set("phase0-health-check", "ok");

    const value = await redis.get("phase0-health-check");

    expect(value).toBe("ok");

    await redis.del("phase0-health-check");
  });
});
