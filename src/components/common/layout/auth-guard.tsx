"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Box, CircularProgress } from "@mui/material";

import { useAuthStore } from "@/stores/useAuthStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    initializeAuth();
    setChecked(true);
  }, [initializeAuth]);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      router.replace("/login");
    }
  }, [checked, isAuthenticated, router]);

  if (!checked || !isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
