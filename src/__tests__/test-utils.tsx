import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RenderOptions, render as rtlRender } from "@testing-library/react";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

// Mock form data for testing
export const mockTaskFormData = {
  title: "Test Task",
  description: "Test task description",
  status: "pending" as const,
};

export const mockTask = {
  id: "1",
  title: "Test Task",
  description: "Test task description",
  status: "pending" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Helper to create mock form props
export const createMockFormProps = (overrides = {}) => ({
  defaultIsEdit: false,
  initialData: undefined,
  ...overrides,
});
