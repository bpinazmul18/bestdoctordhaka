import { describe, expect, it } from "vitest";
import {
  createDoctorInputSchema,
  doctorListQuerySchema,
  parseChamberRowsFromFormData,
  parseConditionsTreatedText,
  parseDoctorListQuery,
} from "./doctor.validation";

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

describe("parseChamberRowsFromFormData", () => {
  function buildFormData(rows: Record<string, string>[]): FormData {
    const formData = new FormData();
    const fields = [
      "chamberLocationId",
      "chamberHospitalId",
      "chamberName",
      "chamberAddressLine",
      "chamberContactPhone",
      "chamberWhatsappNumber",
      "chamberVisitingHours",
      "chamberClosedDay",
    ];
    for (const row of rows) {
      for (const field of fields) {
        formData.append(field, row[field] ?? "");
      }
    }
    return formData;
  }

  it("should return an empty list when no rows are provided", () => {
    const result = parseChamberRowsFromFormData(new FormData());

    expect(result).toEqual({ ok: true, chambers: [] });
  });

  it("should drop a fully blank row", () => {
    const formData = buildFormData([{}]);

    const result = parseChamberRowsFromFormData(formData);

    expect(result).toEqual({ ok: true, chambers: [] });
  });

  it("should parse a filled row, combining visiting hours and closed day", () => {
    const formData = buildFormData([
      {
        chamberLocationId: "loc-1",
        chamberHospitalId: "hosp-1",
        chamberName: "Popular Diagnostic Center",
        chamberAddressLine: "77/1, Jail Road, Rangpur",
        chamberContactPhone: "+8809666787813",
        chamberWhatsappNumber: "+8809666787813",
        chamberVisitingHours: "5pm to 9pm",
        chamberClosedDay: "Friday",
      },
    ]);

    const result = parseChamberRowsFromFormData(formData);

    expect(result).toEqual({
      ok: true,
      chambers: [
        {
          locationId: "loc-1",
          hospitalId: "hosp-1",
          name: "Popular Diagnostic Center",
          addressLine: "77/1, Jail Road, Rangpur",
          contactPhone: "+8809666787813",
          whatsappNumber: "+8809666787813",
          visitingHoursNote: "5pm to 9pm · Closed Friday",
        },
      ],
    });
  });

  it("should omit optional fields left blank", () => {
    const formData = buildFormData([{ chamberLocationId: "loc-1", chamberAddressLine: "1 Road" }]);

    const result = parseChamberRowsFromFormData(formData);

    expect(result).toEqual({
      ok: true,
      chambers: [{ locationId: "loc-1", addressLine: "1 Road" }],
    });
  });

  it("should reject a row missing the required location", () => {
    const formData = buildFormData([{ chamberAddressLine: "1 Road" }]);

    const result = parseChamberRowsFromFormData(formData);

    expect(result).toEqual({ ok: false, error: "Each chamber must have a location and an address." });
  });

  it("should reject a row missing the required address", () => {
    const formData = buildFormData([{ chamberLocationId: "loc-1" }]);

    const result = parseChamberRowsFromFormData(formData);

    expect(result).toEqual({ ok: false, error: "Each chamber must have a location and an address." });
  });

  it("should parse multiple rows and skip blank ones in between", () => {
    const formData = buildFormData([
      { chamberLocationId: "loc-1", chamberAddressLine: "1 Road" },
      {},
      { chamberLocationId: "loc-2", chamberAddressLine: "2 Avenue" },
    ]);

    const result = parseChamberRowsFromFormData(formData);

    expect(result).toEqual({
      ok: true,
      chambers: [
        { locationId: "loc-1", addressLine: "1 Road" },
        { locationId: "loc-2", addressLine: "2 Avenue" },
      ],
    });
  });
});

describe("parseConditionsTreatedText", () => {
  it("should return an empty list for blank input", () => {
    expect(parseConditionsTreatedText("")).toEqual([]);
    expect(parseConditionsTreatedText("   \n  \n")).toEqual([]);
  });

  it("should split on newlines and trim each line", () => {
    expect(parseConditionsTreatedText("Migraine\n  Epilepsy  \nStroke")).toEqual([
      "Migraine",
      "Epilepsy",
      "Stroke",
    ]);
  });

  it("should drop blank lines between entries", () => {
    expect(parseConditionsTreatedText("Migraine\n\n\nEpilepsy")).toEqual(["Migraine", "Epilepsy"]);
  });

  it("should dedupe case-insensitively, keeping the first casing seen", () => {
    expect(parseConditionsTreatedText("Migraine\nmigraine\nMIGRAINE")).toEqual(["Migraine"]);
  });
});

describe("createDoctorInputSchema conditionsTreated", () => {
  const basePayload = {
    slug: "dr-test-rahman",
    fullName: "Dr. Test Rahman",
    status: "PUBLISHED" as const,
    primarySpecialtyId: "specialty-1",
    specialtyIds: ["specialty-1"],
  };

  it("should accept a payload without conditionsTreated", () => {
    expect(createDoctorInputSchema.safeParse(basePayload).success).toBe(true);
  });

  it("should accept a valid conditionsTreated list", () => {
    const payload = { ...basePayload, conditionsTreated: ["Migraine", "Epilepsy"] };

    expect(createDoctorInputSchema.safeParse(payload).success).toBe(true);
  });

  it("should reject more than 30 conditions", () => {
    const payload = { ...basePayload, conditionsTreated: Array.from({ length: 31 }, (_, i) => `Condition ${i}`) };

    expect(createDoctorInputSchema.safeParse(payload).success).toBe(false);
  });

  it("should reject a blank condition entry", () => {
    const payload = { ...basePayload, conditionsTreated: [""] };

    expect(createDoctorInputSchema.safeParse(payload).success).toBe(false);
  });
});
