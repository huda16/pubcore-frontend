import { MRT_ColumnDef } from "material-react-table";

export const columns: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "name",
    filterVariant: "autocomplete",
    header: "Name",
  },
  {
    accessorKey: "username",
    filterVariant: "autocomplete",
    header: "Username",
  },
  {
    accessorKey: "email",
    filterVariant: "autocomplete",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    filterVariant: "datetime",
    header: "Created At",
    Cell: ({ cell }) => {
      if (!cell.getValue<Date>()) return null;
      return new Date(cell.getValue<Date>()).toLocaleString("en-GB");
    },
  },
  {
    accessorKey: "updated_at",
    filterVariant: "datetime",
    header: "Updated At",
    Cell: ({ cell }) => {
      if (!cell.getValue<Date>()) return null;
      return new Date(cell.getValue<Date>()).toLocaleString("en-GB");
    },
  },
];
