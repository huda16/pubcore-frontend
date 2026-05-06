import { getTranslations } from "next-intl/server";

import { Grid, Stack } from "@mui/material";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { TasksDataTable } from "@/components/features/dashboard/tasks/data-table";

export async function generateMetadata() {
  const t = await getTranslations("Menu");

  return {
    title: t("Tasks"),
  };
}

export default async function TasksPage() {
  return (
    <Stack gap={2}>
      <Breadcrumbs />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TasksDataTable />
        </Grid>
      </Grid>
    </Stack>
  );
}
