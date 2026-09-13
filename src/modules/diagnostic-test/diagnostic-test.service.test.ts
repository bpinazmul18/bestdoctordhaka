import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDiagnosticTestBySlug, listAllDiagnosticTestSlugs, listDiagnosticTests } from "./diagnostic-test.service";
import {
  findAllDiagnosticTests,
  findAllDiagnosticTestSlugs,
  findDiagnosticTestBySlug,
} from "./diagnostic-test.repository";

vi.mock("./diagnostic-test.repository", () => ({
  findAllDiagnosticTests: vi.fn(),
  findDiagnosticTestBySlug: vi.fn(),
  findAllDiagnosticTestSlugs: vi.fn(),
}));

describe("listDiagnosticTests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should map repository rows to DTOs", async () => {
    vi.mocked(findAllDiagnosticTests).mockResolvedValue([
      {
        id: "1",
        slug: "x-ray",
        name: "X-Ray",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await listDiagnosticTests();

    expect(result).toEqual([{ slug: "x-ray", name: "X-Ray", description: null }]);
  });
});

describe("getDiagnosticTestBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null without querying the repository for a malformed slug", async () => {
    const result = await getDiagnosticTestBySlug("Not A Slug!");

    expect(result).toBeNull();
    expect(findDiagnosticTestBySlug).not.toHaveBeenCalled();
  });

  it("should return null when no diagnostic test matches", async () => {
    vi.mocked(findDiagnosticTestBySlug).mockResolvedValue(null);

    const result = await getDiagnosticTestBySlug("x-ray");

    expect(result).toBeNull();
  });

  it("should return a mapped DTO when found", async () => {
    vi.mocked(findDiagnosticTestBySlug).mockResolvedValue({
      id: "1",
      slug: "x-ray",
      name: "X-Ray",
      description: "Imaging test",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await getDiagnosticTestBySlug("x-ray");

    expect(result).toEqual({ slug: "x-ray", name: "X-Ray", description: "Imaging test" });
  });
});

describe("listAllDiagnosticTestSlugs", () => {
  it("should delegate to the repository", async () => {
    vi.mocked(findAllDiagnosticTestSlugs).mockResolvedValue(["x-ray", "blood-test"]);

    const result = await listAllDiagnosticTestSlugs();

    expect(result).toEqual(["x-ray", "blood-test"]);
  });
});
