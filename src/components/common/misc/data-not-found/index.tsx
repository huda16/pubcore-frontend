import { useTranslations } from "next-intl";

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Box, SxProps, Theme, Typography } from "@mui/material";

type DataNotFoundProps = {
  menu?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function DataNotFound({
  menu = "Data",
  icon = <SentimentDissatisfiedIcon sx={{ fontSize: 64, mb: 2 }} />,
  sx,
}: DataNotFoundProps) {
  const t = useTranslations("Common");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
        color: "text.secondary",
        ...sx,
      }}
      aria-live="polite"
      role="alert"
    >
      {icon}
      <Typography variant="h6" component="div" gutterBottom>
        {t("dataNotFound", { menu })}
      </Typography>
      <Typography variant="body1">
        {t("dataNotFoundSubtitle", { menu })}
      </Typography>
    </Box>
  );
}
