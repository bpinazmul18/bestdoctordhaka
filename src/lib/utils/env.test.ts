import { afterEach, describe, expect, it } from "vitest";
import { getRequiredEnv } from "./env";

describe("getRequiredEnv", () => {
  const originalValue = process.env.TEST_REQUIRED_ENV_VAR;

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env.TEST_REQUIRED_ENV_VAR;
    } else {
      process.env.TEST_REQUIRED_ENV_VAR = originalValue;
    }
  });

  it("should return the value when the environment variable is set", () => {
    process.env.TEST_REQUIRED_ENV_VAR = "hello";

    expect(getRequiredEnv("TEST_REQUIRED_ENV_VAR")).toBe("hello");
  });

  it("should reject a missing environment variable", () => {
    delete process.env.TEST_REQUIRED_ENV_VAR;

    expect(() => getRequiredEnv("TEST_REQUIRED_ENV_VAR")).toThrow(
      "Missing required environment variable: TEST_REQUIRED_ENV_VAR",
    );
  });

  it("should reject an empty string value", () => {
    process.env.TEST_REQUIRED_ENV_VAR = "";

    expect(() => getRequiredEnv("TEST_REQUIRED_ENV_VAR")).toThrow(
      "Missing required environment variable: TEST_REQUIRED_ENV_VAR",
    );
  });
});
