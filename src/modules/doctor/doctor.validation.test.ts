import { describe, expect, it } from "vitest";
import { createDoctorInputSchema, doctorListQuerySchema, parseDoctorListQuery } from "./doctor.validation";

describe("doctorListQuerySchema", () => {
  it("should default to page 1 with no filters", () => {
    expect(doctorListQuerySchema.parse({})).toEqual({ page: 1, pageSize: 12 });
  });

  it("should accept valid filters", () => {
    const result = doctorListQuerySchema.parse({
      specialty: "cardiology",
      location: "dhanmondi",
      q: "Rahman",
      page: "2",
    });

    expect(result).toEqual({
      specialty: "cardiology",
      location: "dhanmondi",
      q: "Rahman",
      page: 2,
      pageSize: 12,
    });
  });

  it("should reject a malformed specialty slug", () => {
    expect(doctorListQuerySchema.safeParse({ specialty: "Not A Slug!" }).success).toBe(false);
  });
});

describe("parseDoctorListQuery", () => {
  it("should fall back to page 1 defaults on invalid input", () => {
    expect(parseDoctorListQuery({ specialty: "Not A Slug!" })).toEqual({ page: 1, pageSize: 12 });
  });

  it("should pass through valid input", () => {
    expect(parseDoctorListQuery({ q: "Rahman" })).toEqual({ page: 1, pageSize: 12, q: "Rahman" });
  });
});

describe("createDoctorInputSchema", () => {
  const basePayload = {
    slug: "dr-test-rahman",
    fullName: "Dr. Test Rahman",
    status: "PUBLISHED" as const,
    primarySpecialtyId: "specialty-1",
    specialtyIds: ["specialty-1"],
  };

  it("should accept a valid payload where primarySpecialtyId is in specialtyIds", () => {
    expect(() => createDoctorInputSchema.parse(basePayload)).not.toThrow();
  });

  it("should accept multiple specialties including the primary one", () => {
    const payload = { ...basePayload, specialtyIds: ["specialty-2", "specialty-1"] };

    expect(() => createDoctorInputSchema.parse(payload)).not.toThrow();
  });

  it("should reject when primarySpecialtyId is not in specialtyIds", () => {
    const payload = { ...basePayload, specialtyIds: ["specialty-2"] };

    const result = createDoctorInputSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["primarySpecialtyId"]);
    }
  });

  it("should reject an empty specialtyIds list", () => {
    const payload = { ...basePayload, specialtyIds: [] };

    expect(createDoctorInputSchema.safeParse(payload).success).toBe(false);
  });

  it("should reject a malformed slug", () => {
    const payload = { ...basePayload, slug: "Not A Slug!" };

    expect(createDoctorInputSchema.safeParse(payload).success).toBe(false);
  });
});
