"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";

import { Stack } from "@mui/material";

import { BaseSkeleton } from "@/components/common/skeleton";
import { HeaderMenuTypography } from "@/components/common/typography/header-menu-typography";

import { useTableFilter } from "@/hooks/nuqs/table-filter";
import { useDeleteTask, useGetTasks } from "@/hooks/react-query/dashboard";

import {
  convertDataTableParamsToTaskQuery,
  getColumnFilterFns,
} from "@/utils/helpers/server";

import { useGetColumns } from "./columns";

const DataTable = dynamic(
  () =>
    import("@/components/common/data-table/base").then(
      ({ DataTable: DataTableTwo }) => DataTableTwo,
    ),
  { ssr: false, loading: () => <BaseSkeleton /> },
);

export function TasksDataTable() {
  const columns = useGetColumns();

  const defaultColumnFilterFns = useMemo(
    () => getColumnFilterFns(columns),
    [columns],
  );

  const { filter, setFilter, resetFilter } = useTableFilter({
    defaultColumnFilterFns,
  });

  const getTasks = useGetTasks(convertDataTableParamsToTaskQuery(filter));
  const deleteTask = useDeleteTask();

  return (
    <Stack spacing={2}>
      <HeaderMenuTypography />
      <DataTable
        columns={columns}
        getQuery={getTasks}
        deleteMutation={deleteTask}
        filter={filter}
        setFilter={setFilter}
        resetFilter={resetFilter}
      />
    </Stack>
  );
}
