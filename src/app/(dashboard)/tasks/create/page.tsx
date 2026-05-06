import { getTranslations } from "next-intl/server";

import { Grid, Stack } from "@mui/material";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { TasksForm } from "@/components/features/dashboard/tasks/form";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${t("Common.create")} ${t("Menu.Tasks")}`,
  };
}

export default async function TasksCreatePage() {
  const t = await getTranslations();

  return (
    <Stack gap={2}>
      <Breadcrumbs
        customLastPath={`${t("Common.create")} ${t("Menu.Tasks")}`}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TasksForm defaultIsEdit />
        </Grid>
      </Grid>
    </Stack>
  );
}
