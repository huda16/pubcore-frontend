"use client";

import { useEffect, useTransition } from "react";

import { useLocale } from "next-intl";

import { FormControl, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
// import "dayjs/locale/en";
import "dayjs/locale/en-gb";
import "dayjs/locale/id";

import { setUserLocale } from "@/actions/locale";

import { Locale } from "@/i18n/config";

export function LanguageSelect() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const onChange = (language: Locale) => {
    startTransition(() => {
      setUserLocale(language);
      dayjs.locale(language === "en" ? "en-gb" : language);
    });
  };

  useEffect(() => {
    dayjs.locale(locale === "en" ? "en-gb" : locale);
  }, [locale]);

  return (
    <FormControl>
      <Select
        labelId="language-select-label"
        id="language-select"
        displayEmpty
        size="small"
        slotProps={{ input: { "aria-label": "select language" } }}
        value={locale}
        onChange={(e) => onChange(e.target.value as Locale)}
        disabled={isPending}
        color="primary"
        sx={{
          mx: 1,
          fontSize: "0.75rem",
          ".MuiSvgIcon-root ": {
            fill: "primary !important",
          },
        }}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="id">ID</MenuItem>
      </Select>
    </FormControl>
  );
}
