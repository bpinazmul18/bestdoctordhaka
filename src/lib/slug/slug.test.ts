import { describe, expect, it, vi } from "vitest";
import { generateUniqueSlug, slugify } from "./slug";

describe("slugify", () => {
  it("should lowercase and hyphenate a name", () => {
    expect(slugify("Dr. Ahmed Hassan")).toBe("dr-ahmed-hassan");
  });

  it("should collapse repeated separators", () => {
    expect(slugify("Cardiology  &  Heart Disease")).toBe("cardiology-heart-disease");
  });

  it("should strip diacritics", () => {
    expect(slugify("Zoë Café")).toBe("zoe-cafe");
  });

  it("should trim leading and trailing hyphens", () => {
    expect(slugify("--Uttara--")).toBe("uttara");
  });
});

describe("generateUniqueSlug", () => {
  it("should return the base slug when it does not already exist", async () => {
    const exists = vi.fn().mockResolvedValue(false);

    const slug = await generateUniqueSlug("Dhanmondi", exists);

    expect(slug).toBe("dhanmondi");
    expect(exists).toHaveBeenCalledTimes(1);
  });

  it("should append an incrementing suffix on collision", async () => {
    const exists = vi.fn(async (candidate: string) => candidate === "dhanmondi" || candidate === "dhanmondi-2");

    const slug = await generateUniqueSlug("Dhanmondi", exists);

    expect(slug).toBe("dhanmondi-3");
  });
});
