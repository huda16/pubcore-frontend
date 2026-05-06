import React from "react";

import { render, screen, waitFor } from "@/__tests__/test-utils";
import userEvent from "@testing-library/user-event";

import LoginPage from "@/app/login/page";
import RootPage from "@/app/page";
import RegisterPage from "@/app/register/page";

const mockPush = jest.fn();
const mockInitializeAuth = jest.fn();
const mockLogin = jest.fn();
const mockNotify = jest.fn();
const mockLoginRequest = jest.fn();
const mockRegisterRequest = jest.fn();

let mockIsAuthenticated = false;

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/providers/material-ui-provider", () => ({
  MaterialUiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@/hooks/useNotification", () => ({
  useNotification: () => mockNotify,
}));

jest.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: mockIsAuthenticated,
    initializeAuth: mockInitializeAuth,
    login: mockLogin,
  }),
}));

jest.mock("@/lib/api", () => ({
  authApi: {
    login: (...args: unknown[]) => mockLoginRequest(...args),
    register: (...args: unknown[]) => mockRegisterRequest(...args),
  },
}));

describe("RootPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockInitializeAuth.mockClear();
    mockLogin.mockClear();
    mockNotify.mockClear();
    mockLoginRequest.mockClear();
    mockRegisterRequest.mockClear();
    mockIsAuthenticated = false;
  });

  it("redirects unauthenticated visitors to login", async () => {
    render(<RootPage />);

    await waitFor(() => {
      expect(mockInitializeAuth).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects authenticated visitors to dashboard", async () => {
    mockIsAuthenticated = true;

    render(<RootPage />);

    await waitFor(() => {
      expect(mockInitializeAuth).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockInitializeAuth.mockClear();
    mockLogin.mockClear();
    mockNotify.mockClear();
    mockLoginRequest.mockClear();
    mockRegisterRequest.mockClear();
    mockIsAuthenticated = false;
  });

  it("submits credentials and redirects after a successful login", async () => {
    const user = userEvent.setup();
    const response = {
      user: { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
      token: "token-123",
    };

    mockLoginRequest.mockResolvedValue(response);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret12");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLoginRequest).toHaveBeenCalledWith({
        email: "ada@example.com",
        password: "secret12",
      });
      expect(mockLogin).toHaveBeenCalledWith(response.user, response.token);
      expect(mockNotify).toHaveBeenCalledWith("Login successful!", "success");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});

describe("RegisterPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockInitializeAuth.mockClear();
    mockLogin.mockClear();
    mockNotify.mockClear();
    mockLoginRequest.mockClear();
    mockRegisterRequest.mockClear();
    mockIsAuthenticated = false;
  });

  it("submits registration data and redirects after success", async () => {
    const user = userEvent.setup();
    const response = {
      user: { id: 2, name: "Grace Hopper", email: "grace@example.com" },
      token: "token-456",
    };

    mockRegisterRequest.mockResolvedValue(response);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/username/i), "grace");
    await user.type(screen.getByLabelText(/email/i), "grace@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret12");
    await user.type(
      screen.getByLabelText(/bio \(optional\)/i),
      "Publisher admin",
    );
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockRegisterRequest).toHaveBeenCalledWith({
        username: "grace",
        email: "grace@example.com",
        password: "secret12",
        bio: "Publisher admin",
      });
      expect(mockLogin).toHaveBeenCalledWith(response.user, response.token);
      expect(mockNotify).toHaveBeenCalledWith(
        "Registration successful!",
        "success",
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
