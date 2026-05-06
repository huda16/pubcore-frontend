"use client";

import React, { ReactNode } from "react";

import { useTranslations } from "next-intl";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  PaperTypeMap,
  Stack,
} from "@mui/material";

import { HeaderTypography } from "@/components/common/typography/header-typography";

type CardFormProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  headerText: string;
  menu: string;
  isEdit: boolean;
  isLoading: boolean;
  onBack: () => void;
  children: ReactNode;
  paperProps?: PaperTypeMap<Record<string, any>, "div">["props"];
  onApprove?: () => void;
  disabledSaveButton?: boolean;
  approveIsLoading?: boolean;
};

export function CardForm({
  onSubmit,
  headerText,
  menu,
  isEdit,
  isLoading,
  onBack,
  children,
  paperProps,
  onApprove,
  disabledSaveButton,
  approveIsLoading,
}: CardFormProps) {
  const t = useTranslations();

  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      <Stack direction="column" gap={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <HeaderTypography>
            {headerText} {menu}
          </HeaderTypography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-end"
            justifyContent="flex-end"
            marginLeft="auto"
          >
            <Button
              variant={isEdit ? "outlined" : "contained"}
              startIcon={isEdit ? <CloseIcon /> : <EditIcon />}
              onClick={onBack}
            >
              {isEdit ? t("Common.cancel") : t("Common.edit")}
            </Button>
            {isEdit && (
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={isLoading || disabledSaveButton}
              >
                {t("Common.save")}
              </Button>
            )}
            {onApprove && isEdit && (
              <Button
                variant="contained"
                color="info"
                startIcon={
                  approveIsLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
                disabled={approveIsLoading || disabledSaveButton}
                onClick={onApprove}
              >
                {t("Common.saveAndApprove")}
              </Button>
            )}
          </Stack>
        </Stack>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
          {...paperProps}
        >
          {children}
        </Paper>
      </Stack>
    </Box>
  );
}
