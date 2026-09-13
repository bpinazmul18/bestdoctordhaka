import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSpecialtyBySlug, listAllSpecialtySlugs, listSpecialties } from "./specialty.service";
import { findAllSpecialties, findAllSpecialtySlugs, findSpecialtyBySlug } from "./specialty.repository";

vi.mock("./specialty.repository", () => ({
  findAllSpecialties: vi.fn(),
  findSpecialtyBySlug: vi.fn(),
  findAllSpecialtySlugs: vi.fn(),
}));

describe("listSpecialties", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should map repository rows to DTOs", async () => {
    vi.mocked(findAllSpecialties).mockResolvedValue([
      {
        id: "1",
        slug: "cardiology",
        name: "Cardiology",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await listSpecialties();

    expect(result).toEqual([{ slug: "cardiology", name: "Cardiology", description: null }]);
  });
});

describe("getSpecialtyBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null without querying the repository for a malformed slug", async () => {
    const result = await getSpecialtyBySlug("Not A Slug!");

    expect(result).toBeNull();
    expect(findSpecialtyBySlug).not.toHaveBeenCalled();
  });

  it("should return null when no specialty matches", async () => {
    vi.mocked(findSpecialtyBySlug).mockResolvedValue(null);

    const result = await getSpecialtyBySlug("cardiology");

    expect(result).toBeNull();
  });

  it("should return a mapped DTO when found", async () => {
    vi.mocked(findSpecialtyBySlug).mockResolvedValue({
      id: "1",
      slug: "cardiology",
      name: "Cardiology",
      description: "Heart care",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await getSpecialtyBySlug("cardiology");

    expect(result).toEqual({ slug: "cardiology", name: "Cardiology", description: "Heart care" });
  });
});

describe("listAllSpecialtySlugs", () => {
  it("should delegate to the repository", async () => {
    vi.mocked(findAllSpecialtySlugs).mockResolvedValue(["cardiology", "dermatology"]);

    const result = await listAllSpecialtySlugs();

    expect(result).toEqual(["cardiology", "dermatology"]);
  });
});
