import { apiClient } from "@/lib/api/client";
import type { Brand, PaginatedSuccess } from "@/lib/api/types";

type BrandsResponse = PaginatedSuccess<{ brands: Brand[] }>;

export async function getBrandOptions() {
  const response = await apiClient.get<BrandsResponse>("/brands", {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return response.data.data.brands;
}
