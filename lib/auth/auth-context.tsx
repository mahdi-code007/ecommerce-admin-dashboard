"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { getCurrentUser, loginRequest } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/types";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from "@/lib/auth/storage";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const authUserQueryKey = ["auth", "me"] as const;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    subscribeToAccessToken,
    getAccessToken,
    () => null,
  );

  const meQuery = useQuery({
    queryKey: authUserQueryKey,
    queryFn: async () => {
      const currentUser = await getCurrentUser();

      if (currentUser.role !== "admin") {
        clearAccessToken();
        throw new Error("This dashboard is for admin accounts only");
      }

      return currentUser;
    },
    enabled: Boolean(token),
    retry: false,
  });

  const status: AuthStatus = !token
    ? "unauthenticated"
    : meQuery.isPending
      ? "loading"
      : meQuery.isSuccess
        ? "authenticated"
        : "unauthenticated";

  const value = useMemo<AuthContextValue>(
    () => ({
      user: status === "authenticated" ? (meQuery.data ?? null) : null,
      status,
      login: async (email, password) => {
        const result = await loginRequest({ email, password });

        if (result.user.role !== "admin") {
          throw new Error("This dashboard is for admin accounts only");
        }

        queryClient.setQueryData(authUserQueryKey, result.user);
        setAccessToken(result.token);
      },
      logout: () => {
        clearAccessToken();
        queryClient.removeQueries({ queryKey: authUserQueryKey });
      },
    }),
    [meQuery.data, queryClient, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
