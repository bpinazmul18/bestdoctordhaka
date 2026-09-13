import { describe, expect, it } from "vitest";
import { optionalSlugParam, paginationQuerySchema, slugSchema, toOptionalString } from "./common";

describe("slugSchema", () => {
  it("should accept a lowercase hyphenated slug", () => {
    expect(slugSchema.parse("cardiology")).toBe("cardiology");
    expect(slugSchema.parse("dr-ahmed-hassan")).toBe("dr-ahmed-hassan");
  });

  it("should reject uppercase, spaces, or invalid characters", () => {
    expect(slugSchema.safeParse("Cardiology").success).toBe(false);
    expect(slugSchema.safeParse("dr ahmed").success).toBe(false);
    expect(slugSchema.safeParse("dr_ahmed").success).toBe(false);
    expect(slugSchema.safeParse("").success).toBe(false);
  });
});

describe("toOptionalString", () => {
  it("should pass through a single string", () => {
    expect(toOptionalString("cardiology")).toBe("cardiology");
  });

  it("should take the first value of a repeated query param", () => {
    expect(toOptionalString(["a", "b"])).toBe("a");
  });

  it("should return undefined for missing values", () => {
    expect(toOptionalString(undefined)).toBeUndefined();
  });
});

describe("optionalSlugParam", () => {
  it("should accept an absent value", () => {
    expect(optionalSlugParam.parse(undefined)).toBeUndefined();
  });

  it("should reject a malformed slug", () => {
    expect(optionalSlugParam.safeParse("Not A Slug!").success).toBe(false);
  });
});

describe("paginationQuerySchema", () => {
  it("should default page and pageSize when absent", () => {
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, pageSize: 12 });
  });

  it("should coerce string query values to numbers", () => {
    expect(paginationQuerySchema.parse({ page: "3", pageSize: "20" })).toEqual({
      page: 3,
      pageSize: 20,
    });
  });

  it("should reject a page below 1", () => {
    expect(paginationQuerySchema.safeParse({ page: "0" }).success).toBe(false);
  });

  it("should reject a non-numeric page", () => {
    expect(paginationQuerySchema.safeParse({ page: "abc" }).success).toBe(false);
  });

  it("should reject a pageSize above the max", () => {
    expect(paginationQuerySchema.safeParse({ pageSize: "500" }).success).toBe(false);
  });
});
