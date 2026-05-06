import { Skeleton, Stack } from "@mui/material";

export function BaseSkeleton() {
  return (
    <Stack gap={2}>
      <Skeleton variant="rounded" height={40} />
      <Skeleton variant="rounded" height={40} />
      <Skeleton variant="rounded" height={600} />
    </Stack>
  );
}
