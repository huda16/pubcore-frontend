import { useState } from "react";

import { DEFAULT_TABLE_SORTING } from "@/constants/app-constants";

import {
  MRT_ColumnFilterFnsStateType,
  MRT_ColumnFiltersStateType,
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

export const useBasicStateTableFilter = ({
  defaultSorting,
  defaultColumnFilter,
  defaultColumnFilterFns,
}: UseTableFilterProps) => {
  const [filter, setFilter] = useState({
    sorting: defaultSorting ?? DEFAULT_TABLE_SORTING,
    columnFilters: defaultColumnFilter ?? [],
    columnFilterFns: defaultColumnFilterFns,
    pagination: DEFAULT_PAGINATION,
    globalFilter: DEFAULT_GLOBAL_FILTER,
    isTrash: DEFAULT_IS_TRASH,
    view: DEFAULT_VIEW,
  });

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
