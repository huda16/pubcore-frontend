import { MRT_ColumnDef } from "material-react-table";

import type { Publisher } from "@/types/entities";

export const useGetColumns = (): MRT_ColumnDef<Publisher>[] => {
  return [
    {
      accessorKey: "name",
      filterVariant: "autocomplete",
      header: "Name",
    },
    {
      accessorKey: "address",
      filterVariant: "autocomplete",
      header: "Address",
    },
    {
      accessorKey: "website",
      filterVariant: "autocomplete",
      header: "Website",
    },
  ];
};
