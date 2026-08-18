import { apiClient } from "@/lib/api/client";
import type { Category, PaginatedSuccess } from "@/lib/api/types";

type CategoriesResponse = PaginatedSuccess<{ categories: Category[] }>;

export async function getCategoryOptions() {
  const response = await apiClient.get<CategoriesResponse>("/categories", {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return response.data.data.categories;
}
