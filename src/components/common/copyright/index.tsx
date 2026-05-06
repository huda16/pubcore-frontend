import Link from "next/link";

import { Typography, TypographyProps } from "@mui/material";

type CopyrightProps = TypographyProps;

export function Copyright(props: CopyrightProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      &copy;{" "}
      <Link color="inherit" href="https://www.jne.co.id">
        JNE
      </Link>{" "}
      {new Date().getFullYear()}
      {"."} v{process.env.NPM_PACKAGE_VERSION}
    </Typography>
  );
}
