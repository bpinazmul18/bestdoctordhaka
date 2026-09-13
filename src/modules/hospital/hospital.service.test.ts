import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHospitalBySlug, listAllHospitalSlugs, listHospitals } from "./hospital.service";
import { countHospitals, findAllHospitalSlugs, findHospitalBySlug, findManyHospitals } from "./hospital.repository";

vi.mock("./hospital.repository", () => ({
  findManyHospitals: vi.fn(),
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
