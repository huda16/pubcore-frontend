import React from "react";

import { render } from "@/__tests__/test-utils";
import { screen } from "@testing-library/react";

import { Breadcrumbs } from "@/components/common/breadcrumbs";

// Mock next/navigation
const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

describe("Breadcrumbs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Functionality", () => {
    it("renders breadcrumbs for single path segment", () => {
      mockPathname.mockReturnValue("/dashboard");
      render(<Breadcrumbs />);

      const nav = document.querySelector("nav");
      expect(nav).toBeTruthy();
      expect(screen.getByText("Dashboard")).toBeTruthy();
    });

    it("renders breadcrumbs for multiple path segments", () => {
      mockPathname.mockReturnValue("/dashboard/tasks");
      render(<Breadcrumbs />);

      // Should show both Dashboard (as link) and Tasks (as current page)
      const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
      expect(dashboardLink).toBeTruthy();
      expect(dashboardLink.getAttribute("href")).toBe("/dashboard");

      // Current page should be text, not a link
      const tasksText = screen.getByText("Tasks");
      expect(tasksText).toBeTruthy();
      expect(tasksText.tagName).toBe("P"); // Typography renders as p tag
    });

    it("renders breadcrumbs for deeply nested paths", () => {
      mockPathname.mockReturnValue("/dashboard/tasks/create");
      render(<Breadcrumbs />);

      // Should show Dashboard and Tasks as links, Create as current page
      const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
      expect(dashboardLink.getAttribute("href")).toBe("/dashboard");

      const tasksLink = screen.getByRole("link", { name: /Tasks/i });
      expect(tasksLink.getAttribute("href")).toBe("/dashboard/tasks");

      const createText = screen.getByText("Create");
      expect(createText).toBeTruthy();
      expect(createText.tagName).toBe("P");
    });

    it("handles root path correctly", () => {
      mockPathname.mockReturnValue("/");
      render(<Breadcrumbs />);

      // Should render empty breadcrumbs for root path
      const breadcrumbsContainer = document.querySelector("nav");
      expect(breadcrumbsContainer).toBeTruthy();
    });
  });

  describe("Custom Last Path", () => {
    it("uses custom last path when provided", () => {
      mockPathname.mockReturnValue("/dashboard/tasks/123");
      render(<Breadcrumbs customLastPath="Task Details" />);

      // Should show custom text instead of translated path segment
      expect(screen.getByText("Task Details")).toBeInTheDocument();
      expect(screen.queryByText("123")).not.toBeInTheDocument();
    });

    it("only affects the last breadcrumb item", () => {
      mockPathname.mockReturnValue("/dashboard/tasks/create");
      render(<Breadcrumbs customLastPath="New Task" />);

      // Previous breadcrumbs should still be normal
      expect(
        screen.getByRole("link", { name: /Dashboard/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Tasks/i })).toBeInTheDocument();

      // Only last item should use custom text
      expect(screen.getByText("New Task")).toBeInTheDocument();
      expect(screen.queryByText("Create")).not.toBeInTheDocument();
    });
  });

  describe("Path Parsing", () => {
    it("handles paths with hyphens correctly", () => {
      mockPathname.mockReturnValue("/dashboard/user-management");
      render(<Breadcrumbs />);

      // Should convert kebab-case to title case
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    it("handles paths with multiple segments containing hyphens", () => {
      mockPathname.mockReturnValue("/dashboard/user-management/create-user");
      render(<Breadcrumbs />);

      const userManagementLink = screen.getByRole("link", {
        name: /User Management/i,
      });
      expect(userManagementLink).toHaveAttribute(
        "href",
        "/dashboard/user-management",
      );

      expect(screen.getByText("Create User")).toBeInTheDocument();
    });

    it("filters out empty path segments", () => {
      mockPathname.mockReturnValue("//dashboard//tasks//");
      render(<Breadcrumbs />);

      // Should handle multiple slashes gracefully
      expect(
        screen.getByRole("link", { name: /Dashboard/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Tasks")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper aria-label for navigation", () => {
      mockPathname.mockReturnValue("/dashboard/tasks");
      render(<Breadcrumbs />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "breadcrumb");
    });

    it("renders links with proper hover behavior", () => {
      mockPathname.mockReturnValue("/dashboard/tasks/create");
      render(<Breadcrumbs />);

      const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
      expect(dashboardLink).toHaveStyle({ textDecoration: "none" }); // MUI Link with underline="hover"
    });

    it("distinguishes between clickable and non-clickable breadcrumbs", () => {
      mockPathname.mockReturnValue("/dashboard/tasks");
      render(<Breadcrumbs />);

      // Dashboard should be a clickable link
      const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
      expect(dashboardLink).toBeInTheDocument();

      // Tasks should be text (current page)
      const tasksText = screen.getByText("Tasks");
      expect(tasksText).toBeInTheDocument();
      expect(tasksText.closest("a")).toBeNull(); // Should not be wrapped in a link
    });
  });

  describe("Translation Integration", () => {
    it("uses translation keys for path segments", () => {
      mockPathname.mockReturnValue("/dashboard/tasks");
      render(<Breadcrumbs />);

      // The component should call t() with "Dashboard" and "Tasks"
      // In our mock setup, it just returns the key
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Tasks")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles single character path segments", () => {
      mockPathname.mockReturnValue("/a/b/c");
      render(<Breadcrumbs />);

      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();
    });

    it("handles numeric path segments", () => {
      mockPathname.mockReturnValue("/dashboard/tasks/123");
      render(<Breadcrumbs />);

      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("handles special characters in path segments", () => {
      mockPathname.mockReturnValue("/dashboard/tasks-list");
      render(<Breadcrumbs />);

      expect(screen.getByText("Tasks List")).toBeInTheDocument();
    });
  });
});
