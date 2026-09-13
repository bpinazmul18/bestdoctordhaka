import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createDiagnosticCenter,
  getDiagnosticCenterBySlug,
  listAllDiagnosticCenterSlugs,
  listDiagnosticCenters,
} from "./diagnostic-center.service";
import {
  countDiagnosticCenters,
  createDiagnosticCenterRecord,
  findAllDiagnosticCenterSlugs,
  findDiagnosticCenterBySlug,
  findManyDiagnosticCenters,
} from "./diagnostic-center.repository";

vi.mock("./diagnostic-center.repository", () => ({
  createDiagnosticCenterRecord: vi.fn(),
  findManyDiagnosticCenters: vi.fn(),
  countDiagnosticCenters: vi.fn(),
  findDiagnosticCenterBySlug: vi.fn(),
  findAllDiagnosticCenterSlugs: vi.fn(),
}));

const location = { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" };

describe("listDiagnosticCenters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should translate the query into filters/pagination and map results", async () => {
    vi.mocked(findManyDiagnosticCenters).mockResolvedValue([
      { slug: "test-diagnostic-center", name: "Test Diagnostic Center", location } as never,
    ]);
    vi.mocked(countDiagnosticCenters).mockResolvedValue(1);

    const result = await listDiagnosticCenters({ page: 1, pageSize: 12, location: "dhanmondi", test: "x-ray" });

    expect(findManyDiagnosticCenters).toHaveBeenCalledWith(
      { locationSlug: "dhanmondi", testSlug: "x-ray" },
      { page: 1, pageSize: 12 },
    );
    expect(countDiagnosticCenters).toHaveBeenCalledWith({ locationSlug: "dhanmondi", testSlug: "x-ray" });
    expect(result.items).toEqual([{ slug: "test-diagnostic-center", name: "Test Diagnostic Center", location }]);
    expect(result.totalItems).toBe(1);
  });
});

describe("getDiagnosticCenterBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null without querying the repository for a malformed slug", async () => {
    const result = await getDiagnosticCenterBySlug("Not A Slug!");

    expect(result).toBeNull();
    expect(findDiagnosticCenterBySlug).not.toHaveBeenCalled();
  });

  it("should return null when no diagnostic center matches", async () => {
    vi.mocked(findDiagnosticCenterBySlug).mockResolvedValue(null);

    const result = await getDiagnosticCenterBySlug("test-diagnostic-center");

    expect(result).toBeNull();
  });

  it("should return a mapped DTO with tests when found", async () => {
    vi.mocked(findDiagnosticCenterBySlug).mockResolvedValue({
      slug: "test-diagnostic-center",
      name: "Test Diagnostic Center",
      location,
      tests: [{ diagnosticTest: { slug: "x-ray", name: "X-Ray" } }],
    } as never);

    const result = await getDiagnosticCenterBySlug("test-diagnostic-center");

    expect(result).toEqual({
      slug: "test-diagnostic-center",
      name: "Test Diagnostic Center",
      location,
      tests: [{ slug: "x-ray", name: "X-Ray" }],
    });
  });
});

describe("listAllDiagnosticCenterSlugs", () => {
  it("should delegate to the repository", async () => {
    vi.mocked(findAllDiagnosticCenterSlugs).mockResolvedValue(["test-diagnostic-center"]);

    const result = await listAllDiagnosticCenterSlugs();

    expect(result).toEqual(["test-diagnostic-center"]);
  });
});

describe("createDiagnosticCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = { slug: "test-diagnostic-center", name: "Test Diagnostic Center", locationId: "loc-1" };

  it("should persist a valid diagnostic center", async () => {
    vi.mocked(createDiagnosticCenterRecord).mockResolvedValue({
      id: "1",
      ...validInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createDiagnosticCenter(validInput);

    expect(createDiagnosticCenterRecord).toHaveBeenCalledWith(validInput);
  });

  it("should reject an invalid slug without touching the repository", async () => {
    await expect(
      createDiagnosticCenter({ slug: "Not A Slug!", name: "Test", locationId: "loc-1" }),
    ).rejects.toThrow();
    expect(createDiagnosticCenterRecord).not.toHaveBeenCalled();
  });
});
