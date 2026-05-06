"use client";

import React from "react";

import { Pagination, Stack, Typography } from "@mui/material";

import type { PaginationMeta } from "@/types/entities";

interface PaginationComponentProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  meta,
  onPageChange,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ mt: 3 }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {meta.from} to {meta.to} of {meta.total} results
      </Typography>
      <Pagination
        count={meta.lastPage}
        page={meta.currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
      />
    </Stack>
  );
};
