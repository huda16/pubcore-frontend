"use client";

import { SnackbarProvider as BaseSnackbarProvider } from "notistack";

type SnackbarProviderProps = {
  children: React.ReactNode;
};

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  return (
    <BaseSnackbarProvider
      maxSnack={Number.MAX_SAFE_INTEGER}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      style={{ maxWidth: 300, wordBreak: "break-word" }}
    >
      {children}
    </BaseSnackbarProvider>
  );
}
