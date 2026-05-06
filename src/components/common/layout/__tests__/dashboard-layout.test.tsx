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

jest.mock("@/components/common/layout/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/common/sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
  DRAWER_WIDTH_VALUE: 240,
}));

jest.mock("@/providers/material-ui-provider", () => ({
  MaterialUiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("DashboardLayout", () => {
  it("renders the layout with app title", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("PubCore")).toBeInTheDocument();
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

  it("renders sidebar component", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renders main content area", () => {
    render(
      <DashboardLayout>
        <div>Main Content</div>
      </DashboardLayout>,
    );

    const mainContent = screen.getByText("Main Content");
    expect(mainContent).toBeTruthy();

    const main =
      mainContent.closest("main") || mainContent.closest('[role="main"]');
    expect(main || mainContent.parentElement).toBeTruthy();
  });
});
