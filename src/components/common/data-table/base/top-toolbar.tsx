"use client";

import { JSX, MouseEvent } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import GridView from "@mui/icons-material/GridView";
import MenuIcon from "@mui/icons-material/Menu";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_RowData,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
} from "material-react-table";

import { useTableFilter } from "@/hooks/nuqs/table-filter";
import { useBasicStateTableFilter } from "@/hooks/nuqs/table-filter/basic-state";

export type TopToolbarProps = {
  table: MRT_TableInstance<any>;
  enableRowSelection: boolean | undefined;
  filter: ReturnType<typeof useTableFilter>["filter"];
  type: string;
  rowSelection: Record<string, boolean>;
  setIsOpenActionDialog: (val: (prev: boolean) => boolean) => void;
  hideCreateButton?: boolean;
  pathname: string;
  resetFilter?: () => void;
  setKey: (val: number) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClickExport: (event: MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  handleExport: (type: string) => void;
  Grid?: (props: {
    row: MRT_Row<any & MRT_RowData>;
    pathname: string;
  }) => JSX.Element;
  setFilter:
    | ReturnType<typeof useTableFilter>["setFilter"]
    | ReturnType<typeof useBasicStateTableFilter>["setFilter"];
  t: (...args: any[]) => string;
  EXPORT_FILE_TYPES: string[];
};

export const TopToolbar = ({
  table,
  enableRowSelection,
  filter,
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
}: TopToolbarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "0.5rem",
        p: "0.5rem",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {enableRowSelection && filter.view === "grid" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          }
          label={t("Common.selectAll")}
        />
      )}
      {enableRowSelection && !!Object.keys(rowSelection).length && (
        <Box>
          {filter.isTrash ? (
            <Tooltip arrow title={t("Common.bulkRestore")}>
              <IconButton
                id="bulk-restore-button"
                aria-haspopup="true"
                color="secondary"
                onClick={() => {
                  setIsOpenActionDialog((prev) => !prev);
                }}
              >
                <RestoreIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip arrow title={t("Common.bulkDelete")}>
              <IconButton
                id="bulk-delete-button"
                aria-haspopup="true"
                color="secondary"
                onClick={() => {
                  setIsOpenActionDialog((prev) => !prev);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginLeft: "auto",
        }}
      >
        {hideCreateButton ? null : (
          <Button
            variant="contained"
            href={`${pathname}/create`}
            sx={{ my: 1 }}
            startIcon={<AddIcon />}
          >
            {t("Common.create")}
          </Button>
        )}
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleGlobalFilterButton color="info" table={table} />
        <Tooltip arrow title={t("Common.resetFilter")}>
          <IconButton
            sx={{ my: 1 }}
            color="warning"
            onClick={() => {
              resetFilter?.();
              setKey(Date.now());
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {filter.view === "list" && (
          <>
            <MRT_ToggleFiltersButton color="primary" table={table} />
            <MRT_ShowHideColumnsButton color="primary" table={table} />
            <MRT_ToggleDensePaddingButton color="primary" table={table} />
            <MRT_ToggleFullScreenButton color="primary" table={table} />
          </>
        )}
        <Tooltip arrow title={t("Common.exportData")}>
          <IconButton
            id="download-button"
            aria-controls={open ? "download-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            color="primary"
            onClick={handleClickExport}
            sx={{ p: 0.5 }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="download-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              "aria-labelledby": "download-button",
            },
          }}
        >
          {EXPORT_FILE_TYPES.map((type) => (
            <MenuItem key={type} onClick={() => handleExport(type)}>
              {t("Common.exportAs")} {type.toUpperCase()}
            </MenuItem>
          ))}
        </Menu>
        {Grid && (
          <Tooltip arrow title={t("Common.toggleGridMode")}>
            <IconButton
              id="table-view-button"
              aria-haspopup="true"
              color="primary"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  view: prev.view === "list" ? "grid" : "list",
                }))
              }
              sx={{ py: 0.5, pr: 1, pl: 0.5 }}
            >
              {filter.view === "list" ? <GridView /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
