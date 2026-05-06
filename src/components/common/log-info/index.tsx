import { useTranslations } from "next-intl";

import { Badge, Box, Paper, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";

import { HeaderTypography } from "../typography/header-typography";

type LogInfoProps<T> = {
  data: T | undefined;
  table?: boolean;
};

type LogInfoData = {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return dayjs(date).format("LL HH:mm:ss");
};

const LogDetails = ({
  type,
  color,
  date,
}: {
  type: "C" | "U" | "D";
  color: "primary" | "info" | "error";
  date?: string;
}) => {
  if (!date) return null;
  return (
    <Typography variant="body2" component="div" sx={{ my: 1 }}>
      <Badge badgeContent={type} color={color} sx={{ mr: 2 }} />
      {formatDate(date)}
    </Typography>
  );
};

export const LogInfo = <T,>({ data, table = false }: LogInfoProps<T>) => {
  const t = useTranslations("Common");

  if (!data) return null;

  const { createdAt, updatedAt, deletedAt } = data as LogInfoData;

  const renderLogTooltip = () => (
    <Box>
      <LogDetails type="C" color="primary" date={createdAt} />
      <LogDetails type="U" color="info" date={updatedAt} />
      <LogDetails type="D" color="error" date={deletedAt} />
    </Box>
  );

  return (
    <Box>
      {table ? (
        <Box>
          {deletedAt ? (
            <>
              <Badge badgeContent="D" color="error" />
              <Typography component="span">{formatDate(deletedAt)}</Typography>
            </>
          ) : updatedAt ? (
            <>
              <Badge badgeContent="U" color="info" />
              <Typography component="span">{formatDate(updatedAt)}</Typography>
            </>
          ) : createdAt ? (
            <>
              <Badge badgeContent="C" color="primary" />
              <Typography component="span">{formatDate(createdAt)}</Typography>
            </>
          ) : null}
          <Tooltip title={renderLogTooltip()} arrow>
            <Typography
              component="span"
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {t("logInfo")}
            </Typography>
          </Tooltip>
        </Box>
      ) : (
        <Stack direction="column" gap={2}>
          <HeaderTypography>{t("logInfo")}</HeaderTypography>
          <Paper sx={{ px: 3, py: 1 }}>
            <LogDetails type="C" color="primary" date={createdAt} />
            <LogDetails type="U" color="info" date={updatedAt} />
            <LogDetails type="D" color="error" date={deletedAt} />
          </Paper>
        </Stack>
      )}
    </Box>
  );
};
