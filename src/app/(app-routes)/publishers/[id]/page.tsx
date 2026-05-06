"use client";

import React from "react";

import { notFound, useParams } from "next/navigation";

import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { PublishersForm } from "@/components/features/publishers";

import { publishersApi } from "@/lib/api";

export default function PublisherDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const {
    data: publisher,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publisher", id],
    queryFn: () => publishersApi.detail(id),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !publisher) {
    return <Alert severity="error">Failed to load publisher details</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs customLastPath={`Edit ${publisher.name}`} />
      <PublishersForm pageMode initialData={publisher} />
    </Stack>
  );
}
