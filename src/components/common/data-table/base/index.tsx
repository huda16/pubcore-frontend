"use client";

import {
  JSX,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { EXPORT_FILE_TYPES } from "@/constants/app-constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { json2csv } from "json-2-csv";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowData,
  MRT_RowSelectionState,
  MRT_TableInstance,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_ID } from "material-react-table/locales/id";
import { enqueueSnackbar } from "notistack";
import * as XLSX from "xlsx";

import { useTableFilter } from "@/hooks/nuqs/table-filter";
import { useBasicStateTableFilter } from "@/hooks/nuqs/table-filter/basic-state";

import { assign } from "@/utils/helpers/server";

import {
  MRT_ColumnFiltersStateSchema,
  MRT_SortingStateType,
} from "@/validations/common/data-table";

import { RowActions as BaseRowActions } from "./row-actions";
import { TopToolbar as BaseTopToolbar, TopToolbarProps } from "./top-toolbar";

type DataTableProps = {
  columns: MRT_ColumnDef<any>[];
  getQuery: UseQueryResult<TaskResponse<any>>;
  deleteMutation?: UseMutationResult<any, CommonErrorResponse, any, unknown>;
  restoreMutation?: UseMutationResult<any, CommonErrorResponse, any, unknown>;
  tableOptions?: Partial<MRT_TableOptions<any>>;
  hideCreateButton?: boolean;
  tabs?: TabsConfig<unknown>;
  defaultSorting?: MRT_SortingStateType;
  filter: ReturnType<typeof useTableFilter>["filter"];
  disableEdit?: (row: MRT_Row<any & MRT_RowData>) => boolean;
  setFilter:
    | ReturnType<typeof useTableFilter>["setFilter"]
    | ReturnType<typeof useBasicStateTableFilter>["setFilter"];
  resetFilter:
    | ReturnType<typeof useTableFilter>["resetFilter"]
    | ReturnType<typeof useBasicStateTableFilter>["resetFilter"];
  Grid?: (props: {
    row: MRT_Row<any & MRT_RowData>;
    pathname: string;
  }) => JSX.Element;
  RowActions?: (props: {
    row: MRT_Row<any & MRT_RowData>;
    pathname: string;
    disableEdit?: (row: MRT_Row<any & MRT_RowData>) => boolean;
  }) => JSX.Element;
  TopToolbar?: (props: TopToolbarProps) => JSX.Element;
};

export function DataTable({
  columns,
  getQuery,
  deleteMutation,
  restoreMutation,
  tableOptions,
  hideCreateButton,
  filter,
  disableEdit,
  setFilter,
  resetFilter,
  Grid,
  RowActions,
  TopToolbar,
}: DataTableProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();

  const [key, setKey] = useState(0);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenActionDialog, setIsOpenActionDialog] = useState(false);

  const open = useMemo(() => !!anchorEl, [anchorEl]);

  const type = useMemo(
    () => (filter.isTrash ? "restore" : "delete"),
    [filter.isTrash],
  );

  useEffect(() => {
    // initialize key on client after mount to avoid server/client mismatch
    setKey(Date.now());
  }, []);

  const handleClickExport = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleExport = useCallback(
    (type: (typeof EXPORT_FILE_TYPES)[number]) => {
      switch (type) {
        case "csv":
          const test = json2csv(getQuery.data?.data ?? []);
          const blob = new Blob([test], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "data.csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          break;
        case "xlsx":
          const ws = XLSX.utils.json_to_sheet(getQuery.data?.data ?? []);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb, "data.xlsx");
          break;
        default:
          break;
      }
      handleClose();
    },
    [getQuery.data?.data, handleClose],
  );

  const handleBulkAction = async (action: typeof type) => {
    if (!action) return;

    const id = Object.keys(rowSelection);

    const mutation = action === "delete" ? deleteMutation : restoreMutation;

    if (!mutation) return;

    mutation.mutate(
      { id },
      {
        onSettled: (data: PromiseSettledResult<any>[]) => {
          const successfulCount = data.filter(
            (result) => result.status === "fulfilled",
          ).length;
          const failedCount = data.filter(
            (result) => result.status === "rejected",
          ).length;
          if (successfulCount > 0) {
            enqueueSnackbar(
              t(
                action === "delete"
                  ? "Common.baseSnackbarSuccessBulkDeleteMessage"
                  : "Common.baseSnackbarSuccessBulkRestoreMessage",
                { count: successfulCount },
              ),
              { variant: "success" },
            );
          }

          if (failedCount > 0) {
            enqueueSnackbar(
              t(
                action === "delete"
                  ? "Common.baseSnackbarFailedBulkDeleteMessage"
                  : "Common.baseSnackbarFailedBulkRestoreMessage",
                { count: failedCount },
              ),
              { variant: "error" },
            );
          }
          setRowSelection({});
        },
      },
    );
  };

  const renderGrid = useCallback(
    ({ row, pathname }: { row: MRT_Row<any>; pathname: string }) => {
      if (Grid) return Grid({ row, pathname });
      return null;
    },
    [Grid],
  );

  const renderTopToolbar = useCallback(
    ({ table }: { table: MRT_TableInstance<any> }) => {
      if (TopToolbar) {
        return TopToolbar({
          table,
          enableRowSelection: true,
          filter,
          type,
          rowSelection,
          setIsOpenActionDialog,
          hideCreateButton,
          pathname,
          resetFilter,
          setKey,
          anchorEl,
          open,
          handleClickExport,
          handleClose,
          handleExport,
          Grid,
          setFilter,
          t,
          EXPORT_FILE_TYPES,
        });
      }
      return (
        <BaseTopToolbar
          table={table}
          enableRowSelection={true}
          filter={filter}
          type={type}
          rowSelection={rowSelection}
          setIsOpenActionDialog={setIsOpenActionDialog}
          hideCreateButton={hideCreateButton}
          pathname={pathname}
          resetFilter={resetFilter}
          setKey={setKey}
          anchorEl={anchorEl}
          open={open}
          handleClickExport={handleClickExport}
          handleClose={handleClose}
          handleExport={handleExport}
          Grid={Grid}
          setFilter={setFilter}
          t={t}
          EXPORT_FILE_TYPES={EXPORT_FILE_TYPES}
        />
      );
    },
    [
      TopToolbar,
      filter,
      type,
      rowSelection,
      hideCreateButton,
      pathname,
      resetFilter,
      anchorEl,
      open,
      handleClickExport,
      handleClose,
      handleExport,
      Grid,
      setFilter,
      t,
    ],
  );

  const renderBottomToolbarCustomActions = useCallback(
    ({ table }: { table: MRT_TableInstance<any> }) => {
      if (getQuery.isLoading) {
        return <Skeleton variant="text" height={40} width={200} />;
      }
      return (
        <Typography variant="body2">
          {t("Common.showing")}{" "}
          {Math.min(
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1,
            table.getRowCount(),
          ).toLocaleString(locale)}{" "}
          {t("Common.to")}{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getRowCount(),
          ).toLocaleString(locale)}{" "}
          {t("Common.of")} {table.getRowCount().toLocaleString(locale)}{" "}
          {t("Common.rows")}
        </Typography>
      );
    },
    [getQuery.isLoading, locale, t],
  );

  const tableOptionsDefault: MRT_TableOptions<any> = useMemo(
    () => ({
      columns,
      data: getQuery.data?.data ?? [],
      initialState: {
        showColumnFilters: true,
        showGlobalFilter: !!filter.globalFilter,
        columnPinning: {
          left: ["mrt-row-select", "mrt-row-actions"],
        },
      },
      state: {
        columnFilters: filter.columnFilters,
        globalFilter: filter.globalFilter,
        sorting: filter.sorting,
        pagination: filter.pagination,
        columnFilterFns: filter.columnFilterFns,
        rowSelection,
        isLoading: getQuery.isLoading,
        isSaving: deleteMutation?.isPending || restoreMutation?.isPending,
        showProgressBars: getQuery.isRefetching,
      },
      columnFilterModeOptions: [
        "contains",
        "equals",
        "notEquals",
        "between",
        "greaterThan",
        "lessThan",
        "empty",
        "notEmpty",
      ],
      enableColumnFilterModes: true,
      enableColumnOrdering: true,
      enableGrouping: true,
      enableColumnPinning: true,
      enableFacetedValues: true,
      enableRowActions: !filter.isTrash,
      enableRowSelection: true,
      enableColumnResizing: true,
      enableRowNumbers: true,
      enableKeyboardShortcuts: false,
      localization: locale === "id" ? MRT_Localization_ID : undefined,
      paginationDisplayMode: "pages",
      positionToolbarAlertBanner: "bottom",
      muiPaginationProps: {
        showFirstButton: true,
        showLastButton: true,
        rowsPerPageOptions: [
          {
            label: "5",
            value: 5,
          },
          {
            label: "10",
            value: 10,
          },
          {
            label: "20",
            value: 20,
          },
          {
            label: "30",
            value: 30,
          },
          {
            label: "100",
            value: 100,
          },
          {
            label: "All",
            value: Number.MAX_SAFE_INTEGER,
          },
        ],
      },
      muiTablePaperProps: {
        elevation: 1,
      },
      manualFiltering: true,
      manualSorting: true,
      manualPagination: true,
      rowCount: getQuery.data?.total ?? 0,
      enableStickyHeader: true,
      muiTableContainerProps: {
        sx: {
          maxHeight: "calc(65vh)",
        },
      },
      layoutMode: "grid",
      defaultColumn: {
        muiFilterDateTimePickerProps: {
          views: ["year", "month", "day", "hours", "minutes", "seconds"],
          timeSteps: {
            hours: 1,
            minutes: 1,
            seconds: 1,
          },
        },
      },
      displayColumnDefOptions: {
        "mrt-row-actions": {
          minSize: 100,
          grow: false,
          muiTableBodyCellProps: {
            align: "center",
          },
        },
        "mrt-row-expand": {
          minSize: 30,
          grow: false,
          muiTableBodyCellProps: {
            align: "center",
          },
        },
      },
      getRowId: (row) => row.id?.toString(),
      onColumnFiltersChange: (columnFilters) => {
        setFilter((prev) => {
          const newColumnFilters =
            typeof columnFilters === "function"
              ? columnFilters(prev.columnFilters)
              : columnFilters;
          const parsedColumnFilters =
            MRT_ColumnFiltersStateSchema.safeParse(newColumnFilters);
          return {
            ...prev,
            columnFilters: parsedColumnFilters.success
              ? parsedColumnFilters.data
              : [],
          };
        });
      },
      onGlobalFilterChange: (globalFilter) => {
        setFilter((prev) => ({ ...prev, globalFilter: globalFilter }));
      },
      onSortingChange: (sorting) => {
        setFilter((prev) => ({
          ...prev,
          sorting:
            typeof sorting === "function" ? sorting(prev.sorting) : sorting,
        }));
      },
      onPaginationChange: (pagination) => {
        setFilter((prev) => ({
          ...prev,
          pagination:
            typeof pagination === "function"
              ? pagination(prev.pagination)
              : pagination,
        }));
      },
      onColumnFilterFnsChange: (columnFilterFns) => {
        setFilter((prev) => ({
          ...prev,
          columnFilterFns:
            typeof columnFilterFns === "function"
              ? columnFilterFns(prev.columnFilterFns)
              : columnFilterFns,
        }));
      },
      onRowSelectionChange: setRowSelection,
      renderRowActions: ({ row }) => {
        if (RowActions) {
          return RowActions({
            row,
            pathname,
            disableEdit,
          });
        }
        return (
          <BaseRowActions
            row={row}
            pathname={pathname}
            disableEdit={disableEdit}
          />
        );
      },
      renderTopToolbar,
      renderBottomToolbarCustomActions,
    }),
    [
      RowActions,
      disableEdit,
      columns,
      deleteMutation?.isPending,
      filter.columnFilterFns,
      filter.columnFilters,
      filter.globalFilter,
      filter.isTrash,
      filter.pagination,
      filter.sorting,
      getQuery.data?.data,
      getQuery.data?.total,
      getQuery.isLoading,
      getQuery.isRefetching,
      locale,
      pathname,
      renderBottomToolbarCustomActions,
      renderTopToolbar,
      restoreMutation?.isPending,
      rowSelection,
      setFilter,
    ],
  );

  const parsedTableOptions = useMemo(
    () =>
      tableOptions
        ? assign(tableOptionsDefault, tableOptions as MRT_TableOptions<any>)
        : tableOptionsDefault,
    [tableOptions, tableOptionsDefault],
  );

  const table = useMaterialReactTable(parsedTableOptions);

  return (
    <Stack key={key} direction="column" gap={2} marginBottom={4}>
      {filter.view === "grid" ? (
        <Paper
          elevation={0}
          sx={({ palette }) => ({
            backgroundColor: palette.background.default,
          })}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {renderTopToolbar({ table })}
          </Stack>
          <ImageList
            gap={16}
            sx={{
              margin: 0,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(18.75rem, 1fr)) !important",
              transform: "translateZ(0)",
            }}
          >
            {table.getRowModel().rows.map((row) => {
              if (getQuery.isLoading) {
                return (
                  <ImageListItem key={row.original.id}>
                    <Skeleton variant="rounded" width="100%" height={250} />
                    <ImageListItemBar
                      title={<Skeleton variant="text" width="100%" />}
                      subtitle={<Skeleton variant="text" width="100%" />}
                    />
                  </ImageListItem>
                );
              }
              return renderGrid({ row, pathname });
            })}
          </ImageList>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingX={1}
            paddingY={2}
          >
            {renderBottomToolbarCustomActions({ table })}
            <Stack direction="row" justifyContent="flex-end" gap={1.5}>
              <Stack direction="row" gap={1.5}>
                <InputLabel
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {t("Common.rowsPerPage")}
                </InputLabel>
                <Select
                  variant="standard"
                  disableUnderline
                  value={filter.pagination.pageSize}
                  onChange={(event) => {
                    table.setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(event.target.value),
                      pageIndex: 0,
                    }));
                  }}
                >
                  {[5, 10, 20, 30, 100, Number.MAX_SAFE_INTEGER].map(
                    (pageSize) => (
                      <MenuItem key={pageSize} value={pageSize}>
                        {pageSize === Number.MAX_SAFE_INTEGER
                          ? "All"
                          : pageSize}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </Stack>
              <Pagination
                count={getQuery.data?.totalPages ?? 0}
                page={filter.pagination.pageIndex + 1}
                onChange={(_, page) => {
                  table.setPagination((prev) => ({
                    ...prev,
                    pageIndex: page - 1,
                  }));
                }}
                showFirstButton
                showLastButton
              />
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <MaterialReactTable table={table} />
      )}
      <Dialog
        open={isOpenActionDialog}
        onClose={() => {
          setIsOpenActionDialog((prev) => !prev);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle textTransform="capitalize">
          {t(`Common.${type}`)} data?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("Common.bulkActionTopToolbarDialogContent", {
              type: t(`Common.${type}`).toLowerCase(),
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpenActionDialog((prev) => !prev);
            }}
          >
            {t("Common.cancel")}
          </Button>
          <Button
            onClick={() => {
              handleBulkAction(type);
              setIsOpenActionDialog((prev) => !prev);
            }}
          >
            {t(`Common.${type}`)}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
