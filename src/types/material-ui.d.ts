// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ThemeProviderProps } from "@mui/material/styles";

declare module "@mui/material" {
  interface ThemeProviderProps {
    forceThemeRerender: boolean;
  }
}
