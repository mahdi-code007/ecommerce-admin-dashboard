import axios from "axios";
import { env } from "@/shared/lib/env";
import { clearAccessToken, getAccessToken } from "@/shared/auth/storage";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";

      if (!requestUrl.includes("/auth/login")) {
        clearAccessToken();
      }
    }

    return Promise.reject(error);
  },
);
