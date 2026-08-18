import axios from "axios";
import { env } from "@/lib/env";
import { clearAccessToken, getAccessToken } from "@/lib/auth/storage";

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
