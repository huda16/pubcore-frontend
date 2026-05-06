import { render, screen } from "@testing-library/react";

import { useTableFilter } from "@/hooks/nuqs/table-filter";
import { useDeleteTask, useGetTasks } from "@/hooks/react-query/dashboard";

import { TasksDataTable } from "../data-table";

// Mock all hooks to prevent actual API calls and complex rendering
jest.mock("@/hooks/react-query/dashboard", () => ({
  useGetTasks: jest.fn(),
  useDeleteTask: jest.fn(),
}));

jest.mock("@/hooks/nuqs/table-filter", () => ({
  useTableFilter: jest.fn(),
}));

jest.mock("../columns", () => ({
  useGetColumns: jest.fn(() => [
    { id: "title", header: "Title" },
    { id: "description", header: "Description" },
    { id: "status", header: "Status" },
  ]),
}));

// Simple mock for the data table component to avoid complex rendering
jest.mock("@/components/common/data-table/base", () => ({
  DataTable: jest.fn(() => (
    <div data-testid="mock-data-table">Mock DataTable</div>
  )),
}));

describe("TasksDataTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useGetTasks
    (useGetTasks as jest.Mock).mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      isError: false,
    });

    // Mock useDeleteTask
    (useDeleteTask as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });

    // Mock useTableFilter with proper structure
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
    const { container } = render(<TasksDataTable />);
    expect(container).toBeTruthy();
  });

  it("renders the mock data table component", () => {
    render(<TasksDataTable />);
    expect(screen.getByTestId("mock-data-table")).toBeTruthy();
  });

  it("calls useGetTasks hook", () => {
    render(<TasksDataTable />);
    expect(useGetTasks).toHaveBeenCalled();
  });

  it("calls useDeleteTask hook", () => {
    render(<TasksDataTable />);
    expect(useDeleteTask).toHaveBeenCalled();
  });

  it("calls useTableFilter hook", () => {
    render(<TasksDataTable />);
    expect(useTableFilter).toHaveBeenCalled();
  });

  it("renders with loading state", () => {
    (useGetTasks as jest.Mock).mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: true,
      isError: false,
    });

    const { container } = render(<TasksDataTable />);
    expect(container).toBeTruthy();
  });

  it("renders with data available", () => {
    (useGetTasks as jest.Mock).mockReturnValue({
      data: {
        data: [{ id: "1", title: "Test Task" }],
        total: 1,
      },
      isLoading: false,
      isError: false,
    });

    const { container } = render(<TasksDataTable />);
    expect(container).toBeTruthy();
  });

  it("renders with error state", () => {
    (useGetTasks as jest.Mock).mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      isError: true,
      error: new Error("Test error"),
    });

    const { container } = render(<TasksDataTable />);
    expect(container).toBeTruthy();
  });

  it("passes correct parameters to useGetTasks", () => {
    render(<TasksDataTable />);

    // Should call with converted filter parameters
    expect(useGetTasks).toHaveBeenCalledWith({
      page: 1, // pageIndex 0 + 1
      limit: 10, // pageSize
      status: undefined,
    });
  });

  it("handles different pagination settings", () => {
    (useTableFilter as jest.Mock).mockReturnValue({
      filter: {
        pagination: { pageSize: 20, pageIndex: 2 },
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

    render(<TasksDataTable />);

    expect(useGetTasks).toHaveBeenCalledWith({
      page: 3, // pageIndex 2 + 1
      limit: 20, // pageSize
      status: undefined,
    });
  });

  it("handles status filter", () => {
    (useTableFilter as jest.Mock).mockReturnValue({
      filter: {
        pagination: { pageSize: 10, pageIndex: 0 },
        columnFilters: [{ id: "status", value: "TO_DO" }],
        columnFilterFns: {},
        sorting: [],
        globalFilter: "",
        isTrash: false,
        view: "list",
      },
      setFilter: jest.fn(),
      resetFilter: jest.fn(),
    });

    render(<TasksDataTable />);

    expect(useGetTasks).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      status: "TO_DO",
    });
  });
});
