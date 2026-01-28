export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems?: number;
  total?: number;
  totalPages?: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

