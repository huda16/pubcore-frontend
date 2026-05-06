"use client";

import { Stack, Typography } from "@mui/material";

import { BooksDataTable } from "@/components/features/books";

export default function BooksPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Books
      </Typography>
      <BooksDataTable />
    </Stack>
  );
}
