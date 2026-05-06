// Jest setup file
import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/dashboard/tasks",
  useParams: () => ({ id: "1" }),
  useSearchParams: () => new URLSearchParams(),
  useServerInsertedHTML: jest.fn(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useLocale: () => "en",
}));

// Mock notistack
jest.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
    closeSnackbar: jest.fn(),
  }),
}));

// Mock nuqs
jest.mock("nuqs", () => ({
  parseAsBoolean: {
    withDefault: jest.fn(() => ({ serialize: jest.fn(), parse: jest.fn() })),
  },
  useQueryState: jest.fn(() => [false, jest.fn()]),
}));

// Mock @tanstack/react-query hooks
jest.mock("@/hooks/react-query/dashboard", () => ({
  useCreateTask: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useUpdateTask: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Global test utilities
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Suppress console warnings during tests unless explicitly testing them
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});
