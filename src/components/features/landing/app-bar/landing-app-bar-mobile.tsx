"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Divider, Drawer, IconButton, MenuItem } from "@mui/material";

export function LandingMobileAppBar() {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
      <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: "var(--template-frame-height, 0rem)",
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
          <MenuItem>{t("LandingPage.features")}</MenuItem>
          <MenuItem>{t("LandingPage.testimonials")}</MenuItem>
          <MenuItem>{t("LandingPage.highlights")}</MenuItem>
          <MenuItem>{t("LandingPage.pricing")}</MenuItem>
          <MenuItem>{t("LandingPage.faq")}</MenuItem>
          <MenuItem>{t("LandingPage.blog")}</MenuItem>
          <Divider sx={{ my: 3 }} />
        </Box>
      </Drawer>
    </Box>
  );
}
