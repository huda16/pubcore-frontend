type QueryKeyValue<T = unknown> = { [K in keyof T]?: T[K] };
type QueryKeyValueArray<T = unknown> = { [K in keyof T]?: T[K][] };
type QuerySort<T = unknown> = { [K in keyof T]?: "asc" | "desc" };
type QueryKey<T = unknown> = keyof T extends string ? keyof T : never;

type ApiQuery<T = unknown> = {
  table: boolean;
  trash: boolean;
  includeDeleted: boolean | undefined;
  page: number;
  limit: number;
  search: string | undefined;
  sort: QuerySort<T>[];
  like: QueryKeyValue<T>[];
  where: QueryKeyValue<T>[];
  notEqual: QueryKeyValue<T>[];
  in: QueryKeyValueArray<T>[];
  notin: QueryKeyValueArray<T>[];
  between: QueryKeyValueArray<T>[];
  greaterThan: QueryKeyValue<T>[];
  lessThan: QueryKeyValue<T>[];
  isNull: QueryKey<T>[];
  isNotNull: QueryKey<T>[];
  select: QueryKey<T>[];
  relation: QueryKey<T>[];
  distinct: QueryKey<T>[];
};

type Meta = {
  total: number;
  limit: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
};

type CommonResponse<R> = {
  data: R;
  message: string;
  statusCode: number;
  meta: Meta;
};

type TaskResponse<R> = {
  data: R;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CommonErrorResponse = {
  error: string;
  message: {
    property: string;
    constraints: string[];
    children: {
      property: string;
      constraints: {
        property: string;
        constraints: string[];
      }[];
      children: {
        property: string;
        constraints: {
          property: string;
          constraints: string[];
        }[];
      }[];
    }[];
  }[];
  statusCode: number;
};

type ApiDashboardQuery = {
  /**
   * The start date for the data range in 'YYYY-MM-DD' format.
   * @example '2025-09-01'
   */
  startDate?: string;

  /**
   * The end date for the data range in 'YYYY-MM-DD' format.
   * @example '2025-09-24'
   */
  endDate?: string;
};
