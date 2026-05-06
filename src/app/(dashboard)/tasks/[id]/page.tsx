import { getTranslations } from "next-intl/server";

import { SEARCH_PARAMS_IS_EDIT_KEY } from "@/constants/app-constants";
import { Grid, Stack } from "@mui/material";
import { SearchParams } from "nuqs";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { TasksDetail } from "@/components/features/dashboard/tasks/detail";

type TasksDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata(props: TasksDetailPageProps) {
  const t = await getTranslations();
  const searchParams = await props.searchParams;
  const isEdit = searchParams[SEARCH_PARAMS_IS_EDIT_KEY] === "true";

  return {
    title: `${isEdit ? t("Common.edit") : t("Common.detail")} ${t("Menu.Tasks")}`,
  };
}

export default async function TasksDetailPage(props: TasksDetailPageProps) {
  const t = await getTranslations();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isEdit = searchParams[SEARCH_PARAMS_IS_EDIT_KEY] === "true";

  return (
    <Stack gap={2}>
      <Breadcrumbs
        customLastPath={`${isEdit ? t("Common.edit") : t("Common.detail")} ${t("Menu.Tasks")}`}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TasksDetail id={params.id} defaultIsEdit={isEdit} />
        </Grid>
      </Grid>
    </Stack>
  );
}
