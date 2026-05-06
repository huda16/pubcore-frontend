"use client";

import { Stack, Typography } from "@mui/material";

import { AuthorsDataTable } from "@/components/features/authors";

export default function AuthorsPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Authors
      </Typography>
      <AuthorsDataTable />
    </Stack>
  );
}
