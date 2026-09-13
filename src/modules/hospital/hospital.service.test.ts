import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createHospital,
  getHospitalBySlug,
  listAllHospitalSlugs,
  listHospitalOptions,
  listHospitals,
} from "./hospital.service";
import {
  countHospitals,
  createHospitalRecord,
  findAllHospitalSlugs,
  findAllHospitals,
  findHospitalBySlug,
  findManyHospitals,
} from "./hospital.repository";

vi.mock("./hospital.repository", () => ({
  createHospitalRecord: vi.fn(),
  findManyHospitals: vi.fn(),
  findAllHospitals: vi.fn(),
  countHospitals: vi.fn(),
  findHospitalBySlug: vi.fn(),
  findAllHospitalSlugs: vi.fn(),
}));

const location = { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" };

describe("listHospitals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should translate the query into filters/pagination and map results", async () => {
    vi.mocked(findManyHospitals).mockResolvedValue([
      { slug: "square-hospital-test", name: "Square Hospital (Test)", location } as never,
    ]);
    vi.mocked(countHospitals).mockResolvedValue(1);

    const result = await listHospitals({ page: 1, pageSize: 12, location: "dhanmondi" });

    expect(findManyHospitals).toHaveBeenCalledWith({ locationSlug: "dhanmondi" }, { page: 1, pageSize: 12 });
    expect(countHospitals).toHaveBeenCalledWith({ locationSlug: "dhanmondi" });
    expect(result.items).toEqual([
      { slug: "square-hospital-test", name: "Square Hospital (Test)", location },
    ]);
    expect(result.totalItems).toBe(1);
  });
});

describe("getHospitalBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null without querying the repository for a malformed slug", async () => {
    const result = await getHospitalBySlug("Not A Slug!");

    expect(result).toBeNull();
    expect(findHospitalBySlug).not.toHaveBeenCalled();
  });

  it("should return null when no hospital matches", async () => {
    vi.mocked(findHospitalBySlug).mockResolvedValue(null);

    const result = await getHospitalBySlug("square-hospital-test");

    expect(result).toBeNull();
  });

  it("should return a mapped DTO when found", async () => {
    vi.mocked(findHospitalBySlug).mockResolvedValue({
      slug: "square-hospital-test",
      name: "Square Hospital (Test)",
      location,
    } as never);

    const result = await getHospitalBySlug("square-hospital-test");

    expect(result).toEqual({ slug: "square-hospital-test", name: "Square Hospital (Test)", location });
  });
});

describe("listAllHospitalSlugs", () => {
  it("should delegate to the repository", async () => {
    vi.mocked(findAllHospitalSlugs).mockResolvedValue(["square-hospital-test", "apollo-hospital-test"]);

    const result = await listAllHospitalSlugs();

    expect(result).toEqual(["square-hospital-test", "apollo-hospital-test"]);
  });
});

describe("listHospitalOptions", () => {
  it("should map repository rows to id/name option DTOs", async () => {
    vi.mocked(findAllHospitals).mockResolvedValue([
      {
        id: "1",
        slug: "square-hospital-test",
        name: "Square Hospital (Test)",
        locationId: "loc-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await listHospitalOptions();

    expect(result).toEqual([{ id: "1", name: "Square Hospital (Test)" }]);
  });
});

describe("createHospital", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = { slug: "square-hospital-test", name: "Square Hospital (Test)", locationId: "loc-1" };

  it("should persist a valid hospital", async () => {
    vi.mocked(createHospitalRecord).mockResolvedValue({
      id: "1",
      ...validInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createHospital(validInput);

    expect(createHospitalRecord).toHaveBeenCalledWith(validInput);
  });

  it("should reject a missing locationId without touching the repository", async () => {
    await expect(
      createHospital({ slug: "square-hospital-test", name: "Square Hospital (Test)", locationId: "" }),
    ).rejects.toThrow();
    expect(createHospitalRecord).not.toHaveBeenCalled();
  });
});
