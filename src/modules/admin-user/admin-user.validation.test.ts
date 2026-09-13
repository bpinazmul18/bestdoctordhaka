import { describe, expect, it } from "vitest";
import { loginInputSchema } from "./admin-user.validation";

describe("loginInputSchema", () => {
  it("should accept a valid email/password and lowercase the email", () => {
    const result = loginInputSchema.parse({ email: "Admin@Example.com", password: "secret123" });

    expect(result).toEqual({ email: "admin@example.com", password: "secret123" });
  });

  it("should reject an invalid email", () => {
    expect(() => loginInputSchema.parse({ email: "not-an-email", password: "secret123" })).toThrow();
  });

  it("should reject an empty password", () => {
    expect(() => loginInputSchema.parse({ email: "admin@example.com", password: "" })).toThrow();
  });
});
