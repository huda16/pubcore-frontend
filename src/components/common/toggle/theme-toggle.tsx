"use client";

import { useTranslations } from "next-intl";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip, useColorScheme } from "@mui/material";

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const t = useTranslations("Common");

  if (!mode) {
    return null;
  }

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Tooltip title={t("toggleDarkMode")}>
      <IconButton color="primary" onClick={toggleTheme} size="large">
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}
