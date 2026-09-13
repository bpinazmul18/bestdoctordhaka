import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDoctor, getDoctorProfile, listAllPublishedDoctorSlugs, listDoctors } from "./doctor.service";
import {
  countPublishedDoctors,
  createDoctorRecord,
  findAllPublishedDoctorSlugs,
  findManyPublishedDoctors,
  findPublishedDoctorBySlug,
} from "./doctor.repository";

vi.mock("./doctor.repository", () => ({
  findManyPublishedDoctors: vi.fn(),
  countPublishedDoctors: vi.fn(),
  findPublishedDoctorBySlug: vi.fn(),
  findAllPublishedDoctorSlugs: vi.fn(),
  createDoctorRecord: vi.fn(),
}));

const specialty = { id: "specialty-1", slug: "cardiology", name: "Cardiology" };

describe("listDoctors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should translate the query into filters/pagination and map results", async () => {
    vi.mocked(findManyPublishedDoctors).mockResolvedValue([
      {
        slug: "dr-test-rahman",
        fullName: "Dr. Test Rahman",
        degrees: null,
        designation: null,
        profileImageUrl: null,
        primarySpecialty: specialty,
        chambers: [],
      } as never,
    ]);
    vi.mocked(countPublishedDoctors).mockResolvedValue(1);

    const result = await listDoctors({ page: 1, pageSize: 12, specialty: "cardiology", q: "Rahman" });

    expect(findManyPublishedDoctors).toHaveBeenCalledWith(
      { specialtySlug: "cardiology", locationSlug: undefined, hospitalSlug: undefined, searchTerm: "Rahman" },
      { page: 1, pageSize: 12 },
    );
    expect(countPublishedDoctors).toHaveBeenCalledWith({
      specialtySlug: "cardiology",
      locationSlug: undefined,
      hospitalSlug: undefined,
      searchTerm: "Rahman",
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe("dr-test-rahman");
    expect(result.totalItems).toBe(1);
  });
});

describe("getDoctorProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null without querying the repository for a malformed slug", async () => {
    const result = await getDoctorProfile("Not A Slug!");

    expect(result).toBeNull();
    expect(findPublishedDoctorBySlug).not.toHaveBeenCalled();
  });

  it("should return null when the doctor is not found or not published", async () => {
    vi.mocked(findPublishedDoctorBySlug).mockResolvedValue(null);

    const result = await getDoctorProfile("dr-test-rahman");

    expect(result).toBeNull();
  });

  it("should map a found doctor record to a profile DTO", async () => {
    vi.mocked(findPublishedDoctorBySlug).mockResolvedValue({
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: null,
      designation: null,
      shortBio: null,
      profileImageUrl: null,
      yearsOfExperience: null,
      primarySpecialty: specialty,
      specialties: [],
      hospitals: [],
      chambers: [],
    } as never);

    const result = await getDoctorProfile("dr-test-rahman");

    expect(result?.slug).toBe("dr-test-rahman");
  });
});

describe("listAllPublishedDoctorSlugs", () => {
  it("should delegate to the repository", async () => {
    vi.mocked(findAllPublishedDoctorSlugs).mockResolvedValue(["dr-test-rahman"]);

    const result = await listAllPublishedDoctorSlugs();

    expect(result).toEqual(["dr-test-rahman"]);
  });
});

describe("createDoctor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    slug: "dr-test-rahman",
    fullName: "Dr. Test Rahman",
    status: "PUBLISHED" as const,
    primarySpecialtyId: "specialty-1",
    specialtyIds: ["specialty-1"],
  };

  it("should persist a doctor whose primarySpecialtyId is included in specialtyIds", async () => {
    vi.mocked(createDoctorRecord).mockResolvedValue({ id: "doctor-1", ...validInput } as never);

    await createDoctor(validInput);

    expect(createDoctorRecord).toHaveBeenCalledTimes(1);
  });

  it("should reject a doctor whose primarySpecialtyId is not in specialtyIds without touching the repository", async () => {
    const invalidInput = { ...validInput, specialtyIds: ["specialty-2"] };

    await expect(createDoctor(invalidInput)).rejects.toThrow();
    expect(createDoctorRecord).not.toHaveBeenCalled();
  });
});
