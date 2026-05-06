import { ROLE_ADMIN, ROLE_SUPERUSER } from "@/constants/app-constants";
import { DATE_FIELDS } from "@/constants/app-constants";
import parsePhoneNumber from "libphonenumber-js";
import {
  MRT_ColumnDef,
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";
import mime from "mime-types";

import { QueryTaskDto, TaskStatusEnum } from "@/validations/dashboard";

export type DataTableQuery = {
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState;
  columnFilterFns: MRT_ColumnFilterFnsState;
  sorting: MRT_SortingState;
  globalFilter: string;
  isTrash?: boolean;
};

export function convertDataTableParamsToApiQuery(
  feParams: DataTableQuery,
): ApiQuery {
  const {
    pagination,
    globalFilter,
    columnFilters,
    columnFilterFns,
    sorting,
    isTrash = false,
  } = feParams;
  const { pageSize: limit, pageIndex: page } = pagination;

  const filters: ApiQuery = {
    table: true,
    page: page + 1,
    limit: limit === Number.MAX_SAFE_INTEGER ? 0 : limit,
    trash: isTrash,
    includeDeleted: undefined,
    search: globalFilter || undefined,
    sort: sorting.map(({ id, desc }) => ({
      [id]: desc ? "desc" : "asc",
    })),
    like: [],
    where: [],
    notEqual: [],
    greaterThan: [],
    lessThan: [],
    between: [],
    in: [],
    notin: [],
    isNull: [],
    isNotNull: [],
    select: [],
    relation: [],
    distinct: [],
  };

  columnFilters.forEach(({ id, value }) => {
    // console.log({ id, value });

    let filterFn = columnFilterFns[id] ?? "equals";

    if (DATE_FIELDS.includes(id)) {
      filterFn = "between";
    }

    // const isString = typeof value === "string";

    switch (filterFn) {
      case "contains":
        filters.like.push({ [id]: value });
        break;
      case "equals":
        if (Array.isArray(value) && value.length && value.every(Boolean)) {
          filters.in.push({ [id]: value });
        } else {
          filters.where.push({ [id]: value });
        }
        break;
      case "notEquals":
        if (Array.isArray(value) && value.length && value.every(Boolean)) {
          filters.notin.push({ [id]: value });
        } else {
          filters.notEqual.push({ [id]: value });
        }
        break;
      case "greaterThan":
        filters.greaterThan.push({ [id]: value });
        break;
      case "lessThan":
        filters.lessThan.push({ [id]: value });
        break;
      case "between":
        if (
          Array.isArray(value) &&
          value.length === 2 &&
          value.every(Boolean)
        ) {
          filters.between.push({ [id]: value });
        }
        break;
      case "arrIncludes":
        if (Array.isArray(value) && value.length && value.every(Boolean)) {
          filters.in.push({ [id]: value });
        }
        break;
      case "empty":
        filters.isNull.push(id as never);
        break;
      case "notEmpty":
        filters.isNotNull.push(id as never);
        break;
      default:
        console.warn(`Unknown filter function: ${filterFn}`);
    }
  });

  return filters;
}

export function convertDataTableParamsToTaskQuery(
  feParams: DataTableQuery,
): QueryTaskDto {
  const { pageSize: limit, pageIndex: page } = feParams.pagination;

  const statusFilter = feParams.columnFilters?.find(
    (filter) => filter.id === "status",
  );

  const allowedStatuses = TaskStatusEnum.options as readonly [
    "TO_DO",
    "IN_PROGRESS",
    "DONE",
  ];
  const statusValue = statusFilter?.value;
  const status =
    typeof statusValue === "string" &&
    allowedStatuses.includes(statusValue as any)
      ? (statusValue as "TO_DO" | "IN_PROGRESS" | "DONE")
      : undefined;

  const taskQuery: QueryTaskDto = {
    page: page + 1, // TanStack Table is 0-indexed, APIs are usually 1-indexed
    limit: limit,
    status,
  };

  return taskQuery;
}

export function textToSlug(text: string): string {
  return text
    .split("/")
    .map((part) =>
      part
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase(),
    )
    .join("/");
}

export function capitalizeText(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function kebabToTitleCase(input: string): string {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function camelToPascalWithSpaces(camelCase: string): string {
  return camelCase
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const isObject = (value: unknown): value is object => {
  return !!value && value.constructor === Object;
};

export const assign = <X extends Record<string | symbol | number, any>>(
  initial: X,
  override: X,
): X => {
  if (!initial || !override) return initial ?? override ?? {};

  return Object.entries({ ...initial, ...override }).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [key]: (() => {
          if (isObject(initial[key])) return assign(initial[key], value);
          return value;
        })(),
      };
    },
    {} as X,
  );
};

export const getColumnFilterFns = (columns: MRT_ColumnDef<any>[]) => {
  return Object.fromEntries(
    columns.map(({ accessorKey, id, filterFn }) => {
      return [id ?? accessorKey, filterFn ?? "contains"];
    }),
  );
};

export const emptyStringToNull = (value: string): string | null => {
  return value === "" ? null : value;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
  return !!(parsedPhoneNumber && parsedPhoneNumber.isValid());
};

export const getIsSuperUser = (roleName: string | undefined): boolean => {
  return [ROLE_SUPERUSER, ROLE_ADMIN].includes(roleName ?? "");
};

export const difference = ({ a, b }: { a: any[]; b: any[] }) =>
  a.filter((x) => !b.includes(x));

export const isImageFile = (file: string | File): boolean => {
  if (!file) return false;

  if (typeof file === "string") {
    const mimeType = mime.lookup(file);
    return !!(mimeType && mimeType.startsWith("image/"));
  } else if (file instanceof File) {
    return file.type.startsWith("image/");
  }

  return false;
};

export const getCurrencySymbol = (
  locale: Intl.LocalesArgument,
  currency: string | undefined,
) => {
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
};

export const getPathnameToTitle = (pathname: string): string => {
  const path = pathname.split("/").filter(Boolean);
  return path.map(kebabToTitleCase)?.[0];
};

export const getPreviousPathname = (pathname: string): string => {
  return pathname.split("/").slice(0, -1).join("/");
};
