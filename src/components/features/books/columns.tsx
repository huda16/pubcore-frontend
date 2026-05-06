import { MRT_ColumnDef } from "material-react-table";

import type { Book } from "@/types/entities";

export const useGetColumns = (): MRT_ColumnDef<Book>[] => {
  return [
    {
      accessorKey: "title",
      filterVariant: "autocomplete",
      header: "Title",
    },
    {
      accessorKey: "isbn",
      filterVariant: "autocomplete",
      header: "ISBN",
    },
    {
      accessorKey: "genre",
      filterVariant: "autocomplete",
      header: "Genre",
    },
    {
      accessorKey: "year",
      // Use text filter for numeric year to avoid dropdown string sorting (localeCompare)
      filterVariant: "text",
      header: "Year",
      sortingFn: (rowA, rowB, columnId) => {
        const valueA = Number(rowA.getValue<number>(columnId) ?? 0);
        const valueB = Number(rowB.getValue<number>(columnId) ?? 0);

        return valueA - valueB;
      },
    },
    {
      accessorKey: "author.name",
      filterVariant: "autocomplete",
      header: "Author",
    },
    {
      accessorKey: "publisher.name",
      filterVariant: "autocomplete",
      header: "Publisher",
    },
  ];
};
