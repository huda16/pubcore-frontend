"use client";

import { useMemo } from "react";

import { useLocale } from "next-intl";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { getTheme } from "@/styles/theme";

type MaterialUiProviderProps = {
  children: React.ReactNode;
  defaultMode?: "light" | "dark" | "system";
  modeStorageKey?: string;
  colorSchemeStorageKey?: string;
};

export function MaterialUiProvider({
  children,
  defaultMode = "system",
  modeStorageKey,
  colorSchemeStorageKey,
}: MaterialUiProviderProps) {
  const locale = useLocale();

  const theme = useMemo(() => getTheme({ locale }), [locale]);

  return (
    <>
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider
          theme={theme}
          defaultMode={defaultMode}
          modeStorageKey={modeStorageKey ? modeStorageKey : undefined}
          colorSchemeStorageKey={
            colorSchemeStorageKey ? colorSchemeStorageKey : undefined
          }
          forceThemeRerender
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={locale === "en" ? "en-gb" : locale}
          >
            <CssBaseline />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  );
}
