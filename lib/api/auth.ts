import { apiClient } from "@/lib/api/client";
import type { ApiSuccess, AuthUser } from "@/lib/api/types";

type LoginResponse = ApiSuccess<{
  user: AuthUser;
  token: string;
}>;

type MeResponse = ApiSuccess<{
  user: AuthUser;
}>;

export async function loginRequest(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; token: string }> {
  const response = await apiClient.post<LoginResponse>("/auth/login", input);
  return response.data.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<MeResponse>("/auth/me");
  return response.data.data.user;
}
