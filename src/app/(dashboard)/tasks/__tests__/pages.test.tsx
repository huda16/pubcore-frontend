import React from "react";

import { render, screen } from "@/__tests__/test-utils";
import { SEARCH_PARAMS_IS_EDIT_KEY } from "@/constants/app-constants";

import TasksDetailPage, {
  generateMetadata as generateTasksDetailMetadata,
} from "@/app/(dashboard)/tasks/[id]/page";
import TasksCreatePage, {
  generateMetadata as generateTasksCreateMetadata,
} from "@/app/(dashboard)/tasks/create/page";
import TasksPage, {
  generateMetadata as generateTasksMetadata,
} from "@/app/(dashboard)/tasks/page";

const mockGetTranslations = jest.fn();

jest.mock("next-intl/server", () => ({
  getTranslations: (...args: unknown[]) => mockGetTranslations(...args),
}));

jest.mock("@/components/common/breadcrumbs", () => ({
  Breadcrumbs: ({ customLastPath }: { customLastPath?: string }) => (
    <div data-testid="breadcrumbs">{customLastPath ?? "Breadcrumbs"}</div>
  ),
}));

jest.mock("@/components/features/dashboard/tasks/data-table", () => ({
  TasksDataTable: () => <div data-testid="tasks-data-table">Tasks table</div>,
}));

jest.mock("@/components/features/dashboard/tasks/form", () => ({
  TasksForm: ({ defaultIsEdit }: { defaultIsEdit?: boolean }) => (
    <div data-testid="tasks-form">{String(Boolean(defaultIsEdit))}</div>
  ),
}));

jest.mock("@/components/features/dashboard/tasks/detail", () => ({
  TasksDetail: ({
    id,
    defaultIsEdit,
  }: {
    id: string;
    defaultIsEdit?: boolean;
  }) => (
    <div data-testid="tasks-detail">
      {id}:{String(Boolean(defaultIsEdit))}
    </div>
  ),
}));

const createTranslations = () => jest.fn((key: string) => key);

describe("dashboard task pages", () => {
  beforeEach(() => {
    mockGetTranslations.mockReset();
    mockGetTranslations.mockResolvedValue(createTranslations());
  });

  it("generates metadata for the task list page", async () => {
    await expect(generateTasksMetadata()).resolves.toEqual({ title: "Tasks" });
  });

  it("renders the task list page", async () => {
    render(await TasksPage());

    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-data-table")).toBeInTheDocument();
  });

  it("generates metadata for the task create page", async () => {
    await expect(generateTasksCreateMetadata()).resolves.toEqual({
      title: "Common.create Menu.Tasks",
    });
  });

  it("renders the task create page", async () => {
    render(await TasksCreatePage());

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Common.create Menu.Tasks",
    );
    expect(screen.getByTestId("tasks-form")).toHaveTextContent("true");
  });

  it("generates metadata for the task detail page", async () => {
    await expect(
      generateTasksDetailMetadata({
        params: Promise.resolve({ id: "7" }),
        searchParams: Promise.resolve({ [SEARCH_PARAMS_IS_EDIT_KEY]: "true" }),
      }),
    ).resolves.toEqual({
      title: "Common.edit Menu.Tasks",
    });
  });

  it("renders the task detail page in view mode", async () => {
    render(
      await TasksDetailPage({
        params: Promise.resolve({ id: "7" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Common.detail Menu.Tasks",
    );
    expect(screen.getByTestId("tasks-detail")).toHaveTextContent("7:false");
  });

  it("renders the task detail page in edit mode", async () => {
    render(
      await TasksDetailPage({
        params: Promise.resolve({ id: "8" }),
        searchParams: Promise.resolve({ [SEARCH_PARAMS_IS_EDIT_KEY]: "true" }),
      }),
    );

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Common.edit Menu.Tasks",
    );
    expect(screen.getByTestId("tasks-detail")).toHaveTextContent("8:true");
  });
});
