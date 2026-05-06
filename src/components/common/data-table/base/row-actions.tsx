"use client";

import { useTranslations } from "next-intl";

import { SEARCH_PARAMS_IS_EDIT_KEY } from "@/constants/app-constants";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { MRT_Row, MRT_RowData } from "material-react-table";

type RowActionsProps = {
  row: MRT_Row<any & MRT_RowData>;
  pathname: string;
  disableEdit?: (row: MRT_Row<any & MRT_RowData>) => boolean;
};

export function RowActions({ row, pathname, disableEdit }: RowActionsProps) {
  const t = useTranslations("Common");

  return (
    <Stack direction="row" alignItems="center">
      {!disableEdit?.(row) && (
        <Tooltip title={t("edit")}>
          <IconButton
            color="warning"
            href={`${pathname}/${row.original.id}?${SEARCH_PARAMS_IS_EDIT_KEY}=true`}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
