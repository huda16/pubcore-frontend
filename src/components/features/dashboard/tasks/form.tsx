"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";

import { SEARCH_PARAMS_IS_EDIT_KEY } from "@/constants/app-constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { AutocompleteElement, TextFieldElement } from "react-hook-form-mui";

import { CardForm } from "@/components/common/form/card";

import { useCreateTask, useUpdateTask } from "@/hooks/react-query/dashboard";
import { useI18nZodErrors } from "@/hooks/zod/i18n-zod";

import { handleFormErrorValidation, onError } from "@/utils/helpers/client";
import { getPathnameToTitle } from "@/utils/helpers/server";

import {
  TaskStatusEnum,
  TasksType,
  tasksSchema,
} from "@/validations/dashboard";

type TasksFormProps = {
  defaultIsEdit?: boolean;
  initialData?: TasksType;
};

export function TasksForm({ defaultIsEdit, initialData }: TasksFormProps) {
  const t = useTranslations();
  useI18nZodErrors("TasksPage");

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [isEdit] = useQueryState(
    SEARCH_PARAMS_IS_EDIT_KEY,
    parseAsBoolean.withDefault(!!defaultIsEdit),
  );

  const isLoading = createTask.isPending || updateTask.isPending;

  const form = useForm({
    resolver: zodResolver(tasksSchema),
    mode: "onChange",
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title,
      status: initialData?.status,
      description: initialData?.description,
    },
  });

  const menu = useMemo(
    () => t(`Menu.${getPathnameToTitle(pathname)}`),
    [pathname, t],
  );

  const headerText = useMemo(() => {
    if (initialData) {
      return isEdit ? t("Common.edit") : t("Common.detail");
    }
    return t("Common.create");
  }, [initialData, isEdit, t]);

  const onSubmit = async (data: TasksType) => {
    if (initialData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...dataWithoutId } = data;
      updateTask.mutate(
        { id: String(params.id), data: dataWithoutId },
        {
          onSuccess: () => {
            enqueueSnackbar(
              t("Common.baseSnackbarSuccessUpdateMessage", { menu }),
              { variant: "success" },
            );
            router.push(pathname.split("/").join("/"));
          },
          onError: (error) => {
            console.log("error", error);
            handleFormErrorValidation(error, form.setError);
          },
        },
      );
    } else {
      createTask.mutate(
        { data },
        {
          onSuccess: () => {
            enqueueSnackbar(
              t("Common.baseSnackbarSuccessCreateMessage", { menu }),
              { variant: "success" },
            );
            router.push(pathname.split("/").slice(0, -1).join("/"));
          },
          onError: (error) => handleFormErrorValidation(error, form.setError),
        },
      );
    }
  };

  return (
    <CardForm
      onSubmit={form.handleSubmit(onSubmit, onError)}
      headerText={headerText}
      menu={menu}
      isEdit={isEdit}
      isLoading={isLoading}
      onBack={() => router.back()}
    >
      <Grid container rowSpacing={3} columnSpacing={2} padding={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <TextFieldElement
            name="title"
            label={t("TasksPage.title")}
            control={form.control}
            fullWidth
            required
          />
        </Grid>
        {initialData && (
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <AutocompleteElement
              name="status"
              label={t("TasksPage.status")}
              control={form.control}
              options={
                TaskStatusEnum.options.map((item) => ({
                  id: item,
                  label: item,
                })) ?? []
              }
              autocompleteProps={{
                fullWidth: true,
              }}
              matchId
              required
            />
          </Grid>
        )}
        <Grid size={{ xs: 12 }} p={0}>
          <TextFieldElement
            name="description"
            label={t("TasksPage.description")}
            control={form.control}
            multiline
            rows={4}
            fullWidth
          />
        </Grid>
      </Grid>
    </CardForm>
  );
}
