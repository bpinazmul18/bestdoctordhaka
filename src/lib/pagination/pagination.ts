export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;
export const MAX_PAGE = 1000;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function toSkipTake({ page, pageSize }: PaginationParams): { skip: number; take: number } {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function buildPaginatedResult<T>(
  items: T[],
  totalItems: number,
  params: PaginationParams,
): PaginatedResult<T> {
  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 1 : Math.ceil(totalItems / params.pageSize),
  };
}
