import Image from "next/image";

import AuthLayoutIllustration from "@/public/auth-layout-illustration.webp";
import { Box, Grid } from "@mui/material";

import { MaterialUiProvider } from "@/providers/material-ui-provider";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <MaterialUiProvider>
      <Grid container component="main" sx={{ height: "100vh" }}>
        {children}
        <Grid size={{ xs: false, sm: 4, md: 7 }}>
          <Box position="relative" width="auto" height="100%">
            <Image
              fill
              src={AuthLayoutIllustration}
              placeholder="blur"
              alt="background"
              sizes="auto"
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Grid>
      </Grid>
    </MaterialUiProvider>
  );
}
