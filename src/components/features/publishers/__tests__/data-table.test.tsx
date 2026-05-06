import React from "react";

import { render, screen } from "@testing-library/react";

import { useTableFilter } from "@/hooks/nuqs/table-filter";

import { PublishersDataTable } from "../data-table";

jest.mock("@/lib/api");
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { data: [] },
    isLoading: false,
    isError: false,
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

jest.mock("@/hooks/nuqs/table-filter", () => ({
  useTableFilter: jest.fn(),
}));

jest.mock("../columns", () => ({
  useGetColumns: jest.fn(() => [
    { id: "name", header: "Name" },
    { id: "email", header: "Email" },
    { id: "phone", header: "Phone" },
    { id: "address", header: "Address" },
  ]),
}));

jest.mock("@/components/common/data-table/base", () => ({
  DataTable: jest.fn(() => (
    <div data-testid="mock-data-table">Mock DataTable</div>
  )),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (fn: () => Promise<any>) => {
    const Comp = (props: any) => {
      const [Component, setComponent] = React.useState<any>(null);
      React.useEffect(() => {
        fn().then((mod: any) => setComponent(mod.DataTable));
      }, []);
      return Component ? <Component {...props} /> : null;
    };
    return Comp;
  },
}));

describe("PublishersDataTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTableFilter as jest.Mock).mockReturnValue({
      filter: {
        pagination: { pageSize: 10, pageIndex: 0 },
        columnFilters: [],
        columnFilterFns: {},
        sorting: [],
        globalFilter: "",
        isTrash: false,
        view: "list",
      },
      setFilter: jest.fn(),
      resetFilter: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    const { container } = render(<PublishersDataTable />);
    expect(container).toBeTruthy();
  });

  it("calls useTableFilter hook", () => {
    render(<PublishersDataTable />);
    expect(useTableFilter).toHaveBeenCalled();
  });

  it("renders table structure", () => {
    render(<PublishersDataTable />);
    const container = document.querySelector("div");
    expect(container).toBeTruthy();
  });

  it("initializes with default table filter configuration", () => {
    render(<PublishersDataTable />);

    expect(useTableFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultColumnFilterFns: expect.any(Object),
      }),
    );
  });
});
