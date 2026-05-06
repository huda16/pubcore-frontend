import { useCallback } from "react";

import { useSnackbar } from "notistack";

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    (
      message: string,
      variant: "success" | "error" | "info" | "warning" = "info",
    ) => {
      enqueueSnackbar(message, {
        variant,
        autoHideDuration: 4000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    },
    [enqueueSnackbar],
  );
};
