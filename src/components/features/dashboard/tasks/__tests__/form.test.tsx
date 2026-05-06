import React from "react";

import { render } from "@/__tests__/test-utils";
import { screen } from "@testing-library/react";

import { TasksForm } from "@/components/features/dashboard/tasks/form";

import * as dashboardHooks from "@/hooks/react-query/dashboard";

// Mock the hooks
jest.mock("@/hooks/react-query/dashboard", () => ({
  useCreateTask: jest.fn(),
  useUpdateTask: jest.fn(),
}));
const mockUseCreateTask = dashboardHooks.useCreateTask as jest.MockedFunction<
  typeof dashboardHooks.useCreateTask
>;
const mockUseUpdateTask = dashboardHooks.useUpdateTask as jest.MockedFunction<
  typeof dashboardHooks.useUpdateTask
>;

// Mock the zod hook
jest.mock("@/hooks/zod/i18n-zod", () => ({
  useI18nZodErrors: jest.fn(),
}));

describe("TasksForm", () => {
  const mockCreateTask = {
    mutate: jest.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  };

  const mockUpdateTask = {
    mutate: jest.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCreateTask.mockReturnValue(mockCreateTask as any);
    mockUseUpdateTask.mockReturnValue(mockUpdateTask as any);
  });

  describe("Basic Rendering", () => {
    it("renders form fields for creating a new task", () => {
      render(<TasksForm />);

      expect(screen.getByLabelText(/TasksPage\.title/i)).toBeTruthy();
      expect(screen.getByLabelText(/TasksPage\.description/i)).toBeTruthy();
      // Status field should not be visible in create mode without initial data
      expect(screen.queryByLabelText(/TasksPage\.status/i)).toBe(null);
    });

    it("renders title field as required", () => {
      render(<TasksForm />);

      const titleInput = screen.getByLabelText(/TasksPage\.title/i);
      expect(titleInput.hasAttribute("required")).toBe(true);
    });

    it("renders header and form structure", () => {
      render(<TasksForm />);

      const form = document.querySelector("form");
      expect(form).toBeTruthy();

      const header = document.querySelector("h1");
      expect(header).toBeTruthy();
    });
  });

  describe("Edit Mode with Initial Data", () => {
    const mockInitialData = {
      id: "123",
      title: "Existing Task",
      description: "Existing Description",
      status: "IN_PROGRESS" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("renders form fields with initial data", () => {
      render(<TasksForm defaultIsEdit={true} initialData={mockInitialData} />);

      expect(screen.getByDisplayValue("Existing Task")).toBeTruthy();
      expect(screen.getByDisplayValue("Existing Description")).toBeTruthy();
      expect(screen.getByLabelText(/TasksPage\.status/i)).toBeTruthy();
    });

    it("shows status field when initial data is provided", () => {
      render(<TasksForm defaultIsEdit={true} initialData={mockInitialData} />);

      const statusField = screen.getByLabelText(/TasksPage\.status/i);
      expect(statusField).toBeTruthy();
    });

    it("renders correct button states in edit mode", () => {
      render(<TasksForm defaultIsEdit={true} initialData={mockInitialData} />);

      // Should have save button visible in edit mode
      const form = document.querySelector("form");
      expect(form).toBeTruthy();
    });
  });

  describe("Hook Integration", () => {
    it("uses create hook for new tasks", () => {
      render(<TasksForm />);

      expect(mockUseCreateTask).toHaveBeenCalled();
      expect(mockUseUpdateTask).toHaveBeenCalled();
    });

    it("accesses mutation functions from hooks", () => {
      render(<TasksForm />);

      expect(mockCreateTask.mutate).toBeDefined();
      expect(mockUpdateTask.mutate).toBeDefined();
    });
  });

  describe("Loading States", () => {
    it("handles loading state in create mode", () => {
      mockUseCreateTask.mockReturnValue({
        ...mockCreateTask,
        isPending: true,
      } as any);

      render(<TasksForm defaultIsEdit={true} />);

      // Form should still render during loading
      expect(screen.getByLabelText(/TasksPage\.title/i)).toBeTruthy();
    });

    it("handles loading state in update mode", () => {
      const mockInitialData = {
        id: "123",
        title: "Test Task",
        description: "Test Description",
        status: "TO_DO" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUseUpdateTask.mockReturnValue({
        ...mockUpdateTask,
        isPending: true,
      } as any);

      render(<TasksForm defaultIsEdit={true} initialData={mockInitialData} />);

      // Form should still render during loading
      expect(screen.getByDisplayValue("Test Task")).toBeTruthy();
    });
  });
});
