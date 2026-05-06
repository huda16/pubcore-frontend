import { DEFAULT_TABLE_SORTING, VIEW_MODES } from "@/constants/app-constants";
import {
  parseAsBoolean,
  parseAsJson,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

import {
  MRT_ColumnFilterFnsStateSchema,
  MRT_ColumnFilterFnsStateType,
  MRT_ColumnFiltersStateSchema,
  MRT_ColumnFiltersStateType,
  MRT_PaginationStateSchema,
  MRT_SortingStateSchema,
  MRT_SortingStateType,
} from "@/validations/common/data-table";

type UseTableFilterProps = {
  defaultSorting?: MRT_SortingStateType;
  defaultColumnFilter?: MRT_ColumnFiltersStateType;
  defaultColumnFilterFns: MRT_ColumnFilterFnsStateType;
};

const DEFAULT_PAGINATION = { pageIndex: 0, pageSize: 10 };
const DEFAULT_GLOBAL_FILTER = "";
const DEFAULT_IS_TRASH = false;
const DEFAULT_VIEW = "list";

export const useTableFilter = ({
  defaultSorting,
  defaultColumnFilter,
  defaultColumnFilterFns,
}: UseTableFilterProps) => {
  const [filter, setFilter] = useQueryStates(
    {
      sorting: parseAsJson(MRT_SortingStateSchema.parse).withDefault(
        defaultSorting ?? DEFAULT_TABLE_SORTING,
      ),
      columnFilters: parseAsJson(
        MRT_ColumnFiltersStateSchema.parse,
      ).withDefault(defaultColumnFilter ?? []),
      columnFilterFns: parseAsJson(
        MRT_ColumnFilterFnsStateSchema.parse,
      ).withDefault(defaultColumnFilterFns),
      pagination: parseAsJson(MRT_PaginationStateSchema.parse).withDefault(
        DEFAULT_PAGINATION,
      ),
      globalFilter: parseAsString.withDefault(DEFAULT_GLOBAL_FILTER),
      isTrash: parseAsBoolean.withDefault(DEFAULT_IS_TRASH),
      view: parseAsStringLiteral(VIEW_MODES).withDefault(DEFAULT_VIEW),
    },
    {
      urlKeys: {
        sorting: "sorting",
        columnFilters: "column-filters",
        columnFilterFns: "column-filter-fns",
        pagination: "pagination",
        globalFilter: "global-filter",
        isTrash: "is-trash",
        view: "view",
      },
    },
  );

  const resetFilter = () => {
    setFilter({
      sorting: defaultSorting ?? DEFAULT_TABLE_SORTING,
      columnFilters: defaultColumnFilter ?? [],
      columnFilterFns: defaultColumnFilterFns,
      pagination: DEFAULT_PAGINATION,
      globalFilter: DEFAULT_GLOBAL_FILTER,
      isTrash: DEFAULT_IS_TRASH,
      view: DEFAULT_VIEW,
    });
  };

  return { filter, setFilter, resetFilter };
};
