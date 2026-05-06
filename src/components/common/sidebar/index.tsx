"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useNotification } from "@/hooks/useNotification";

import { authApi } from "@/lib/api";

import { useAuthStore } from "@/stores/useAuthStore";

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Authors", href: "/authors", icon: PeopleIcon },
  { label: "Publishers", href: "/publishers", icon: BusinessIcon },
  { label: "Books", href: "/books", icon: MenuBookIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onMobileClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const notify = useNotification();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    notify("Logged out successfully", "success");
    router.push("/login");
  };

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {user?.username || "User"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email || ""}
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.href);
                  onMobileClose?.();
                }}
                selected={isActive}
                sx={{
                  backgroundColor: isActive
                    ? "rgba(25, 118, 210, 0.08)"
                    : "transparent",
                  color: isActive ? "primary.main" : "inherit",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon>
                  <Icon
                    sx={{
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Permanent drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
          display: { xs: "none", sm: "block" },
        }}
      >
        {content}
      </Drawer>

      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={!!mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};

export const DRAWER_WIDTH_VALUE = DRAWER_WIDTH;
