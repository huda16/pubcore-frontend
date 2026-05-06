import React from "react";

import { render, screen } from "@/__tests__/test-utils";

import AuthorDetailPage from "@/app/(app-routes)/authors/[id]/page";
import AuthorsCreatePage from "@/app/(app-routes)/authors/create/page";
import AuthorsPage from "@/app/(app-routes)/authors/page";
import BookDetailPage from "@/app/(app-routes)/books/[id]/page";
import BooksCreatePage from "@/app/(app-routes)/books/create/page";
import BooksPage from "@/app/(app-routes)/books/page";
import DashboardPage from "@/app/(app-routes)/dashboard/page";
import PublisherDetailPage from "@/app/(app-routes)/publishers/[id]/page";
import PublishersCreatePage from "@/app/(app-routes)/publishers/create/page";
import PublishersPage from "@/app/(app-routes)/publishers/page";

const mockUseParams = jest.fn();
const mockNotFound = jest.fn();
const mockUseQuery = jest.fn();

jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
  useParams: () => mockUseParams(),
}));

// Mock actual QueryClient but custom useQuery
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock("@/components/common/breadcrumbs", () => ({
  Breadcrumbs: ({ customLastPath }: { customLastPath?: string }) => (
    <div data-testid="breadcrumbs">{customLastPath ?? "Breadcrumbs"}</div>
  ),
}));

jest.mock("@/components/features/dashboard/overview", () => ({
  DashboardOverview: () => (
    <div data-testid="dashboard-overview">Dashboard</div>
  ),
}));

jest.mock("@/components/features/authors", () => ({
  AuthorsDataTable: () => (
    <div data-testid="authors-data-table">Authors table</div>
  ),
  AuthorsForm: ({
    initialData,
    pageMode,
  }: {
    initialData?: { name?: string };
    pageMode?: boolean;
  }) => (
    <div data-testid="authors-form">
      {pageMode && !initialData ? "create" : "edit"}
      {initialData?.name ? `:${initialData.name}` : ""}
    </div>
  ),
}));

jest.mock("@/components/features/books", () => ({
  BooksDataTable: () => <div data-testid="books-data-table">Books table</div>,
  BooksForm: ({
    initialData,
    pageMode,
  }: {
    initialData?: { title?: string };
    pageMode?: boolean;
  }) => (
    <div data-testid="books-form">
      {pageMode && !initialData ? "create" : "edit"}
      {initialData?.title ? `:${initialData.title}` : ""}
    </div>
  ),
}));

jest.mock("@/components/features/publishers", () => ({
  PublishersDataTable: () => (
    <div data-testid="publishers-data-table">Publishers table</div>
  ),
  PublishersForm: ({
    initialData,
    pageMode,
  }: {
    initialData?: { name?: string };
    pageMode?: boolean;
  }) => (
    <div data-testid="publishers-form">
      {pageMode && !initialData ? "create" : "edit"}
      {initialData?.name ? `:${initialData.name}` : ""}
    </div>
  ),
}));

describe("app route pages", () => {
  beforeEach(() => {
    mockNotFound.mockClear();
    mockUseParams.mockReset();
    mockUseQuery.mockReset();
    mockUseParams.mockReturnValue({ id: "1" });
  });

  it("renders the dashboard overview page", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("dashboard-overview")).toBeInTheDocument();
  });

  it("renders the authors list page", () => {
    render(<AuthorsPage />);

    expect(
      screen.getByRole("heading", { name: /authors/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("authors-data-table")).toBeInTheDocument();
  });

  it("renders the books list page", () => {
    render(<BooksPage />);

    expect(screen.getByRole("heading", { name: /books/i })).toBeInTheDocument();
    expect(screen.getByTestId("books-data-table")).toBeInTheDocument();
  });

  it("renders the publishers list page", () => {
    render(<PublishersPage />);

    expect(
      screen.getByRole("heading", { name: /publishers/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("publishers-data-table")).toBeInTheDocument();
  });

  it("renders the authors create page", () => {
    render(<AuthorsCreatePage />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Create Author",
    );
    expect(screen.getByTestId("authors-form")).toHaveTextContent("create");
  });

  it("renders the books create page", () => {
    render(<BooksCreatePage />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Create Book");
    expect(screen.getByTestId("books-form")).toHaveTextContent("create");
  });

  it("renders the publishers create page", () => {
    render(<PublishersCreatePage />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Create Publisher",
    );
    expect(screen.getByTestId("publishers-form")).toHaveTextContent("create");
  });

  it("renders the author detail page with data", () => {
    mockUseQuery.mockReturnValue({
      data: { name: "Ada Lovelace" },
      error: null,
      isLoading: false,
    });

    render(<AuthorDetailPage />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Edit Ada Lovelace",
    );
    expect(screen.getByTestId("authors-form")).toHaveTextContent(
      "edit:Ada Lovelace",
    );
  });

  it("shows loading state for author detail page", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    render(<AuthorDetailPage />);
    expect(document.querySelector("svg")).toBeTruthy(); // CircularProgress
  });

  it("shows error state for author detail page", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: new Error("Failed to load"),
      isLoading: false,
    });

    render(<AuthorDetailPage />);
    expect(screen.getByText(/Failed to load author details/i)).toBeTruthy();
  });

  it("renders the book detail page with data", () => {
    mockUseQuery.mockReturnValue({
      data: { title: "The Art of Testing" },
      error: null,
      isLoading: false,
    });

    render(<BookDetailPage />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Edit The Art of Testing",
    );
    expect(screen.getByTestId("books-form")).toHaveTextContent(
      "edit:The Art of Testing",
    );
  });

  it("shows error state for book detail page", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: new Error("Failed to load"),
      isLoading: false,
    });

    render(<BookDetailPage />);
    expect(screen.getByText(/Failed to load book details/i)).toBeTruthy();
  });

  it("renders the publisher detail page with data", () => {
    mockUseQuery.mockReturnValue({
      data: { name: "ACME Publishing" },
      error: null,
      isLoading: false,
    });

    render(<PublisherDetailPage />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Edit ACME Publishing",
    );
    expect(screen.getByTestId("publishers-form")).toHaveTextContent(
      "edit:ACME Publishing",
    );
  });

  it("shows error state for publisher detail page", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: new Error("Failed to load"),
      isLoading: false,
    });

    render(<PublisherDetailPage />);
    expect(screen.getByText(/Failed to load publisher details/i)).toBeTruthy();
  });
});
