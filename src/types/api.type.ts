export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
}

export type SortOrder = "asc" | "desc";

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  searchTerm?: string;
}
