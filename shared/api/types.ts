export type Pagination = {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type ApiSuccess<T> = {
  status: "success";
  data: T;
  message?: string;
};

export type PaginatedSuccess<T> = ApiSuccess<T> & {
  pagination: Pagination;
};

export type ListParams = {
  page: number;
  limit: number;
  search?: string;
};
