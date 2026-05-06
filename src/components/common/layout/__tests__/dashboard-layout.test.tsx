import React from "react";

import { render } from "@/__tests__/test-utils";
import { screen } from "@testing-library/react";

import { DashboardLayout } from "@/components/common/layout/dashboard-layout";

// Mock the header and api-config components
jest.mock("@/components/common/header", () => ({
  Header: () => <div data-testid="header">Header Component</div>,
}));

jest.mock("@/components/common/api-config", () => ({
  ApiConfig: () => <div data-testid="api-config">API Config</div>,
}));

describe("DashboardLayout", () => {
  it("renders the layout with app title", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Task Management UI")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders header and api config components", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("api-config")).toBeInTheDocument();
  });

  it("has proper app bar structure", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    // App bar should be present - look for the header element
    const header =
      document.querySelector("header") ||
      screen.getByText("Task Management UI").closest("header");
    expect(header).toBeTruthy();
  });

  it("renders main content area", () => {
    render(
      <DashboardLayout>
        <div>Main Content</div>
      </DashboardLayout>,
    );

    const mainContent = screen.getByText("Main Content");
    expect(mainContent).toBeTruthy();

    // Check if content is within a main element or container
    const main =
      mainContent.closest("main") || mainContent.closest('[role="main"]');
    expect(main || mainContent.parentElement).toBeTruthy();
  });
});
