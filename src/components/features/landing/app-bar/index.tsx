import { getTranslations } from "next-intl/server";

import {
  AppBar as BaseAppBar,
  Box,
  Button,
  Container,
  Toolbar,
} from "@mui/material";

import { LandingMobileAppBar } from "./landing-app-bar-mobile";

export async function AppBar() {
  const t = await getTranslations();

  return (
    <BaseAppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0rem) + 1.75rem)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: `0.75rem`,
            backdropFilter: "blur(24px)",
            padding: "0.5rem 0.75rem",
          }}
        >
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button variant="text" color="info">
                {t("LandingPage.features")}
              </Button>
              <Button variant="text" color="info">
                {t("LandingPage.testimonials")}
              </Button>
              <Button variant="text" color="info">
                {t("LandingPage.highlights")}
              </Button>
              <Button variant="text" color="info">
                {t("LandingPage.pricing")}
              </Button>
              <Button variant="text" color="info" sx={{ minWidth: 0 }}>
                {t("LandingPage.faq")}
              </Button>
              <Button variant="text" color="info" sx={{ minWidth: 0 }}>
                {t("LandingPage.blog")}
              </Button>
            </Box>
          </Box>
          <LandingMobileAppBar />
        </Toolbar>
      </Container>
    </BaseAppBar>
  );
}
