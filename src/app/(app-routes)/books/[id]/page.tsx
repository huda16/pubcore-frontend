"use client";

import React from "react";

import { notFound, useParams } from "next/navigation";

import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BooksForm } from "@/components/features/books";

import { booksApi } from "@/lib/api";

export default function BookDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => booksApi.detail(id),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !book) {
    return <Alert severity="error">Failed to load book details</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs customLastPath={`Edit ${book.title}`} />
      <BooksForm pageMode initialData={book} />
    </Stack>
  );
}
