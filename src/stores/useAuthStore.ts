import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import {
  clearAuthToken,
  getAuthToken,
  isTokenValid,
  setAuthToken,
} from "@/lib/axios-client";

import type { AuthUser } from "@/types/entities";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setLoading: (isLoading) => set({ isLoading }),

        login: (user, token) => {
          setAuthToken(token);
          set({
            user,
            token,
            isAuthenticated: true,
          });
        },

        logout: () => {
          clearAuthToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        },

        initializeAuth: () => {
          const token = getAuthToken();
          if (token && token !== "undefined" && isTokenValid(token)) {
            set({
              token,
              isAuthenticated: true,
            });
          } else {
            clearAuthToken();
            set({
              token: null,
              isAuthenticated: false,
              user: null,
            });
          }
        },
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "auth-store" },
  ),
);
