import { describe, expect, it } from "vitest";
import { buildPaginatedResult, toSkipTake } from "./pagination";

describe("toSkipTake", () => {
  it("should compute skip/take for the first page", () => {
    expect(toSkipTake({ page: 1, pageSize: 12 })).toEqual({ skip: 0, take: 12 });
  });

  it("should compute skip/take for a later page", () => {
    expect(toSkipTake({ page: 3, pageSize: 12 })).toEqual({ skip: 24, take: 12 });
  });
});

describe("buildPaginatedResult", () => {
  it("should compute totalPages from totalItems and pageSize", () => {
    const result = buildPaginatedResult([1, 2], 25, { page: 1, pageSize: 12 });

    expect(result).toEqual({
      items: [1, 2],
      page: 1,
      pageSize: 12,
      totalItems: 25,
      totalPages: 3,
    });
  });

  it("should report a single page when there are no items", () => {
    const result = buildPaginatedResult([], 0, { page: 1, pageSize: 12 });

    expect(result.totalPages).toBe(1);
  });

  it("should report exact page counts with no remainder", () => {
    const result = buildPaginatedResult([], 24, { page: 1, pageSize: 12 });

    expect(result.totalPages).toBe(2);
  });
});
