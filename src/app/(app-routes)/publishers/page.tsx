"use client";

import { Stack, Typography } from "@mui/material";

import { PublishersDataTable } from "@/components/features/publishers";

export default function PublishersPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Publishers
      </Typography>
      <PublishersDataTable />
    </Stack>
  );
}
