import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLocationBySlug, listAllLocationSlugs, listLocations } from "./location.service";
import { findAllLocationSlugs, findAllLocations, findLocationBySlug } from "./location.repository";

vi.mock("./location.repository", () => ({
  findAllLocations: vi.fn(),
  findLocationBySlug: vi.fn(),
  findAllLocationSlugs: vi.fn(),
}));

describe("listLocations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should map repository rows to DTOs", async () => {
    vi.mocked(findAllLocations).mockResolvedValue([
      {
        id: "1",
        slug: "dhanmondi",
        name: "Dhanmondi",
        city: "Dhaka",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await listLocations();

    expect(result).toEqual([{ slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" }]);
  });
});

describe("getLocationBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null without querying the repository for a malformed slug", async () => {
    const result = await getLocationBySlug("Not A Slug!");

    expect(result).toBeNull();
    expect(findLocationBySlug).not.toHaveBeenCalled();
  });

  it("should return null when no location matches", async () => {
    vi.mocked(findLocationBySlug).mockResolvedValue(null);

    const result = await getLocationBySlug("dhanmondi");

    expect(result).toBeNull();
  });

  it("should return a mapped DTO when found", async () => {
    vi.mocked(findLocationBySlug).mockResolvedValue({
      id: "1",
      slug: "dhanmondi",
      name: "Dhanmondi",
      city: "Dhaka",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await getLocationBySlug("dhanmondi");

    expect(result).toEqual({ slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" });
  });
});

describe("listAllLocationSlugs", () => {
  it("should delegate to the repository", async () => {
    vi.mocked(findAllLocationSlugs).mockResolvedValue(["dhanmondi", "gulshan"]);

    const result = await listAllLocationSlugs();

    expect(result).toEqual(["dhanmondi", "gulshan"]);
  });
});
