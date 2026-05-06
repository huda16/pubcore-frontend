import { ReactNode } from "react";

import { Typography } from "@mui/material";

type HeaderTypographyProps = {
  children: ReactNode;
};

export function HeaderTypography({ children }: HeaderTypographyProps) {
  return (
    <Typography component="h1" variant="h5" textTransform="capitalize">
      {children}
    </Typography>
  );
}
