"use client";

import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { Header } from "@/components/common/header";
import { DRAWER_WIDTH_VALUE, Sidebar } from "@/components/common/sidebar";

import { MaterialUiProvider } from "@/providers/material-ui-provider";

import { ApiConfig } from "../api-config";
import { AuthGuard } from "./auth-guard";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MaterialUiProvider>
      <AuthGuard>
        <Box sx={{ display: "flex" }}>
          <AppBar
            position="fixed"
            sx={(theme) => ({
              backgroundColor: theme.palette.background.paper,
              zIndex: theme.zIndex.drawer + 1,
              width: { sm: `calc(100% - ${DRAWER_WIDTH_VALUE}px)` },
              ml: { sm: `${DRAWER_WIDTH_VALUE}px` },
            })}
          >
            <Toolbar sx={{ pr: "1.5rem" }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="primary"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                PubCore
              </Typography>
              <Stack direction="row" spacing={0.1} alignItems="center">
                <ApiConfig />
                <Header />
              </Stack>
            </Toolbar>
          </AppBar>

          <Sidebar
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minHeight: "100vh",
              overflow: "auto",
              width: { sm: `calc(100% - ${DRAWER_WIDTH_VALUE}px)` },
            }}
          >
            <Toolbar />
            <Container maxWidth={false} sx={{ my: 4 }}>
              {children}
            </Container>
          </Box>
        </Box>
      </AuthGuard>
    </MaterialUiProvider>
  );
}
