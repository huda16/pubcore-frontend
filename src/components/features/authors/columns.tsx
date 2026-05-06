import { MRT_ColumnDef } from "material-react-table";

import type { Author } from "@/types/entities";

export const useGetColumns = (): MRT_ColumnDef<Author>[] => {
  return [
    {
      accessorKey: "name",
      filterVariant: "autocomplete",
      header: "Name",
    },
    {
      accessorKey: "bio",
      filterVariant: "autocomplete",
      header: "Bio",
    },
    {
      accessorKey: "nationality",
      filterVariant: "autocomplete",
      header: "Nationality",
    },
  ];
};
