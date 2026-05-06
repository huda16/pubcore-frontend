"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";

import { Stack } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

import { BaseSkeleton } from "@/components/common/skeleton";

import { useTableFilter } from "@/hooks/nuqs/table-filter";

import { booksApi } from "@/lib/api";

import { getColumnFilterFns } from "@/utils/helpers/server";

import { useGetColumns } from "./columns";

const DataTable = dynamic(
  () =>
    import("@/components/common/data-table/base").then(
      ({ DataTable: DataTableTwo }) => DataTableTwo,
    ),
  { ssr: false, loading: () => <BaseSkeleton /> },
);

export function BooksDataTable() {
  const queryClient = useQueryClient();
  const columns = useGetColumns();

  const defaultColumnFilterFns = useMemo(
    () => getColumnFilterFns(columns),
    [columns],
  );

  const { filter, setFilter, resetFilter } = useTableFilter({
    defaultColumnFilterFns,
  });

  const queryParams = useMemo(() => {
    const params: any = {
      page: (filter.pagination?.pageIndex ?? 0) + 1,
      limit: filter.pagination?.pageSize ?? 10,
    };

    if (filter.sorting?.[0]?.id) {
      params.sort = filter.sorting[0].id;
      params.order = filter.sorting[0].desc ? "desc" : "asc";
    }

    const titleFilter = filter.columnFilters?.find(
      (f: any) => f.id === "title",
    )?.value;
    if (titleFilter) params.title = titleFilter;

    const genreFilter = filter.columnFilters?.find(
      (f: any) => f.id === "genre",
    )?.value;
    if (genreFilter) params.genre = genreFilter;

    return params;
  }, [filter]);

  const getBooks = useQuery({
    queryKey: ["books", queryParams],
    queryFn: async () => {
      const res = await booksApi.list(queryParams);
      return {
        data: res.data,
        total: res.meta?.total ?? 0,
        page: res.meta?.currentPage ?? 1,
        limit: res.meta?.limit ?? 10,
        totalPages: res.meta?.lastPage ?? 1,
      };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string[] }) => {
      const ids = id
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));

      return Promise.allSettled(ids.map((bookId) => booksApi.delete(bookId)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      enqueueSnackbar("Book deleted successfully", { variant: "success" });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete book";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  return (
    <Stack spacing={2}>
      <DataTable
        columns={columns}
        getQuery={getBooks}
        deleteMutation={deleteMutation}
        filter={filter}
        setFilter={setFilter}
        resetFilter={resetFilter}
      />
    </Stack>
  );
}
