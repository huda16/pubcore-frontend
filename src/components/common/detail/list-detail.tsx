"use client";

import { useMemo } from "react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { FormatType, formatListDetailValue } from "@/utils/helpers/client";
import {
  camelToPascalWithSpaces,
  getPathnameToTitle,
} from "@/utils/helpers/server";

import { HeaderTypography } from "../typography/header-typography";

type CustomFormatter = (value: any) => string | number;

type FieldFormat =
  | FormatType
  | {
      formatType: FormatType;
      customFormatter?: CustomFormatter;
    };

type ListDetailProps<T extends Record<string, any>> = {
  data: T | undefined;
  hideFields?: (keyof T)[];
  fieldFormats?: Partial<Record<keyof T, FieldFormat>>;
  translationPath?: string;
  title?: string;
  defaultExpanded?: boolean;
};

const DEFAULT_HIDDEN_FIELDS = new Set([
  "createdBy",
  "updatedBy",
  "deletedBy",
  "createdAt",
  "updatedAt",
  "deletedAt",
]);

const isCustomFormatted = (
  fieldFormat: FieldFormat | undefined,
): fieldFormat is {
  formatType: FormatType;
  customFormatter?: CustomFormatter;
} =>
  typeof fieldFormat === "object" &&
  fieldFormat !== null &&
  "formatType" in fieldFormat;

export function ListDetail<T extends Record<string, any>>({
  data,
  hideFields = [],
  fieldFormats = {},
  translationPath,
  title,
  defaultExpanded = false,
}: ListDetailProps<T>) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();

  const hiddenFieldsSet = useMemo(() => {
    const customHidden = hideFields.map(String);
    return new Set([...customHidden, ...DEFAULT_HIDDEN_FIELDS]);
  }, [hideFields]);

  const menu = useMemo(
    () => t(`Menu.${getPathnameToTitle(pathname)}`),
    [pathname, t],
  );

  const filteredEntries = useMemo(() => {
    if (!data) return [];

    return Object.entries(data).filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        typeof value !== "object" &&
        !hiddenFieldsSet.has(key),
    );
  }, [data, hiddenFieldsSet]);

  if (!data || filteredEntries.length === 0) return null;

  return (
    <Stack direction="column" gap={2} mb={4}>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="detail-content"
          id="detail-header"
        >
          <HeaderTypography>
            {title || `${t("Common.detail")} ${menu}`}
          </HeaderTypography>
        </AccordionSummary>

        <TableContainer component={Paper} sx={{ py: 2 }}>
          <Table size="small" aria-label="detail table">
            <TableBody>
              {filteredEntries.map(([key, value]) => {
                const fieldFormat = fieldFormats[key as keyof T];
                const formatType = isCustomFormatted(fieldFormat)
                  ? fieldFormat.formatType
                  : ((fieldFormat as FormatType) ?? "default");
                const customFormatter = isCustomFormatted(fieldFormat)
                  ? fieldFormat.customFormatter
                  : undefined;

                const label =
                  translationPath && t.has(`${translationPath}.${key}`)
                    ? t(`${translationPath}.${key}`)
                    : camelToPascalWithSpaces(key);

                return (
                  <TableRow
                    key={key}
                    sx={{ "td, th": { border: 0, py: 0.5, px: 2 } }}
                  >
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{label}</TableCell>
                    <TableCell align="left">:</TableCell>
                    <TableCell width="100%">
                      {formatListDetailValue({
                        value,
                        key,
                        formatType,
                        locale,
                        customFormatter,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Accordion>
    </Stack>
  );
}
