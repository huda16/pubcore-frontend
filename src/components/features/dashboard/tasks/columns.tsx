import { useTranslations } from "next-intl";

import { MRT_ColumnDef } from "material-react-table";

import { TasksType } from "@/validations/dashboard";

export const useGetColumns = (): MRT_ColumnDef<TasksType>[] => {
  const t = useTranslations("TasksPage");

  return [
    {
      accessorKey: "title",
      filterVariant: "autocomplete",
      header: t("title"),
    },
    {
      accessorKey: "description",
      filterVariant: "autocomplete",
      header: t("description"),
    },
    {
      accessorKey: "status",
      filterVariant: "autocomplete",
      header: t("status"),
    },
  ];
};
