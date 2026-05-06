"use client";

import React from "react";

import { notFound, useParams } from "next/navigation";

import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { AuthorsForm } from "@/components/features/authors";

import { authorsApi } from "@/lib/api";

export default function AuthorDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const {
    data: author,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["author", id],
    queryFn: () => authorsApi.detail(id),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !author) {
    return <Alert severity="error">Failed to load author details</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs customLastPath={`Edit ${author.name}`} />
      <AuthorsForm pageMode initialData={author} />
    </Stack>
  );
}
