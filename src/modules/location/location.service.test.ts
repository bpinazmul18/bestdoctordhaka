import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLocation,
  getLocationBySlug,
  listAllLocationSlugs,
  listLocationOptions,
  listLocations,
} from "./location.service";
import {
  createLocationRecord,
  findAllLocationSlugs,
  findAllLocations,
  findLocationBySlug,
} from "./location.repository";

vi.mock("./location.repository", () => ({
  createLocationRecord: vi.fn(),
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

describe("listLocationOptions", () => {
  it("should map repository rows to id/name/city option DTOs", async () => {
    vi.mocked(findAllLocations).mockResolvedValue([
      { id: "1", slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka", createdAt: new Date(), updatedAt: new Date() },
    ]);

    const result = await listLocationOptions();

    expect(result).toEqual([{ id: "1", name: "Dhanmondi", city: "Dhaka" }]);
  });
});

describe("createLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" };

  it("should persist a valid location", async () => {
    vi.mocked(createLocationRecord).mockResolvedValue({
      id: "1",
      ...validInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createLocation(validInput);

    expect(createLocationRecord).toHaveBeenCalledWith(validInput);
  });

  it("should reject a missing city without touching the repository", async () => {
    await expect(createLocation({ slug: "dhanmondi", name: "Dhanmondi", city: "" })).rejects.toThrow();
    expect(createLocationRecord).not.toHaveBeenCalled();
  });
});
