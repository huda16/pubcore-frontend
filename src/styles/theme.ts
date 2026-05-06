"use client";

import * as locales from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

import { LinkBehaviour } from "@/components/common/link";

export const getTheme = ({ locale }: { locale: string }) => {
  return createTheme(
    {
      colorSchemes: {
        light: {
          palette: {
            mode: "light",
            background: {
              default: "#fdfdfd", // Softer white for a less harsh look
              // paper: "#ffffff", // White paper background
            },
            text: {
              primary: "#1a1a1a", // Deep gray for less contrast strain
              secondary: "#4a4a4a", // Medium gray
              disabled: "#9e9e9e", // Soft gray
            },
            primary: {
              main: "#006D77", // Teal for a calm look
              light: "rgb(51, 138, 146)", // Light teal
              dark: "rgb(0, 76, 83)", // Dark teal
              contrastText: "#fff", // White text
            },
            secondary: {
              main: "#5d4037", // Warm brown for contrast
              light: "#8b6b61", // Light brown
              dark: "#321911", // Dark chocolate
              contrastText: "#ffffff", // White
            },
            error: {
              main: "#b71c1c", // Darker strong red
              light: "#d32f2f", // Muted red
              dark: "#8c0000", // Deep dark red
              contrastText: "#ffffff", // White
            },
            warning: {
              main: "#e65100", // Deeper orange
              light: "#f57c00", // Muted orange
              dark: "#ac1900", // Dark burnt orange
              contrastText: "#ffffff", // White
            },
            info: {
              main: "#01579b", // Deep blue
              light: "#0288d1", // Muted blue
              dark: "#003c6e", // Navy blue
              contrastText: "#ffffff", // White
            },
            success: {
              main: "#1b5e20", // Dark forest green
              light: "#388e3c", // Muted green
              dark: "#003300", // Deep dark green
              contrastText: "#ffffff", // White
            },
            divider: "rgba(0, 0, 0, 0.12)", // Light gray divider
            AppBar: {
              defaultBg: "#ffffff", // White app bar
              darkBg: "#f4f4f4", // Light gray for contrast
              darkColor: "#1a1a1a", // Deep gray text
            },
          },
        },
        dark: {
          palette: {
            mode: "dark",
            background: {
              default: "#121212", // Standard dark mode
              // paper: "#1d1d1d", // Slightly lighter dark
            },
            text: {
              primary: "#e0e0e0", // Soft white text
              secondary: "#b0b0b0", // Muted gray
              disabled: "#808080", // Faint gray
            },
            primary: {
              main: "#80cbc4", // Soft teal
              light: "#b2fef7", // Very light teal
              dark: "#4f9a94", // Slightly darker teal
              contrastText: "#121212", // Dark text
            },
            secondary: {
              main: "#bcaaa4", // Light brown for warmth
              light: "#efdcd5", // Pale brown
              dark: "#8c7b75", // Deep warm brown
              contrastText: "#121212", // Dark text
            },
            error: {
              main: "#ef5350", // Bright red for attention
              light: "#e57373", // Soft red
              dark: "#d32f2f", // Deep red
              contrastText: "#121212", // Dark text
            },
            warning: {
              main: "#ff9800", // Bright orange
              light: "#ffb74d", // Warm light orange
              dark: "#e65100", // Rich orange
              contrastText: "#121212", // Dark text
            },
            info: {
              main: "#4fc3f7", // Sky blue
              light: "#81d4fa", // Lighter blue
              dark: "#0288d1", // Rich blue
              contrastText: "#121212", // Dark text
            },
            success: {
              main: "#66bb6a", // Fresh green
              light: "#a5d6a7", // Soft green
              dark: "#388e3c", // Forest green
              contrastText: "#121212", // Dark text
            },
            divider: "rgba(255, 255, 255, 0.12)", // Subtle white divider
            AppBar: {
              defaultBg: "#1d1d1d", // Deep gray app bar
              darkBg: "#121212", // Standard dark background
              darkColor: "#e0e0e0", // Soft white text
            },
          },
        },
      },
      cssVariables: {
        colorSchemeSelector: "class",
      },
      typography: {
        fontFamily: "var(--font-inter)",
      },
      components: {
        MuiLink: {
          defaultProps: {
            component: LinkBehaviour,
          },
        },
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: LinkBehaviour,
          },
        },
        MuiTextField: {
          defaultProps: {
            size: "small",
          },
        },
        MuiAutocomplete: {
          defaultProps: {
            size: "small",
          },
        },
        MuiFormControl: {
          defaultProps: {
            size: "small",
          },
        },
        MuiSelect: {
          defaultProps: {
            size: "small",
          },
        },
        MuiRadio: {
          defaultProps: {
            size: "small",
          },
        },
        MuiCheckbox: {
          defaultProps: {
            size: "small",
          },
        },
        MuiSwitch: {
          defaultProps: {
            size: "small",
          },
        },
        MuiButton: {
          defaultProps: {
            size: "small",
          },
        },
        MuiIconButton: {
          defaultProps: {
            size: "small",
          },
        },
        MuiIcon: {
          defaultProps: {
            baseClassName: "material-symbols-outlined",
            style: {
              fontVariationSettings:
                "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48",
            },
            fontSize: "small",
            sx: {
              fontSize: "1.25rem !important",
            },
          },
        },
        MuiSvgIcon: {
          defaultProps: {
            fontSize: "small",
            sx: {
              fontSize: "1.25rem !important",
            },
          },
        },
        MuiChip: {
          defaultProps: {
            size: "small",
          },
        },
        MuiToggleButtonGroup: {
          defaultProps: {
            size: "small",
          },
        },
        MuiFormHelperText: {
          styleOverrides: {
            root: {
              whiteSpace: "pre-line",
            },
          },
        },
        MuiMenuItem: {
          defaultProps: {
            dense: true,
          },
        },
        MuiListItemButton: {
          defaultProps: {
            dense: true,
          },
        },
        MuiStack: {
          defaultProps: {
            useFlexGap: true,
          },
        },
      },
    },
    locale === "id" ? locales.idID : locales.enUS,
  );
};
