"use client";

import React, { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import LinkIcon from "@mui/icons-material/Link";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import Cookies from "js-cookie";

const COOKIE_KEY = "apiBaseUrl";
const DEFAULT_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://task.koreacentral.cloudapp.azure.com";

export function ApiConfig() {
  const t = useTranslations("Common");

  // Toggle visibility via env: NEXT_PUBLIC_ENABLE_API_CONFIG=true
  const enabled = process.env.NEXT_PUBLIC_ENABLE_API_CONFIG === "true";

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState(DEFAULT_URL);

  useEffect(() => {
    const savedUrl = Cookies.get(COOKIE_KEY);
    if (savedUrl) {
      setApiUrl(savedUrl);
    }
  }, []);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSave = () => {
    Cookies.set(COOKIE_KEY, apiUrl, { expires: 365 });
    setDialogOpen(false);
    setSnackbarOpen(true);

    window.location.reload();
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (!enabled) return null;

  return (
    <>
      <Tooltip title="Change API Base URL">
        <IconButton color="primary" onClick={handleOpenDialog}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("apiConfiguration")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t("apiConfigurationDescription")}
          </DialogContentText>
          <TextField
            margin="dense"
            id="api-url"
            label="API Base URL"
            type="url"
            fullWidth
            variant="outlined"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("cancel")}</Button>
          <Button onClick={handleSave} variant="contained">
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("baseSnackbarSuccessUpdateMessage", { menu: "API Base URL" })}
        </Alert>
      </Snackbar>
    </>
  );
}
