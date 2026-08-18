import { apiClient } from "@/shared/api/client";
import type { ApiSuccess, PaginatedSuccess } from "@/shared/api/types";
import type {
  Category,
  CategoryListParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/categories/types";

type CategoryResponse = ApiSuccess<{ category: Category }>;
type CategoriesResponse = PaginatedSuccess<{ categories: Category[] }>;

export async function getCategories(params: CategoryListParams) {
  const response = await apiClient.get<CategoriesResponse>("/categories", {
    params: {
      page: params.page,
      limit: params.limit,
    },
  });

  return {
    categories: response.data.data.categories,
    pagination: response.data.pagination,
  };
}

export async function getCategoryOptions() {
  const response = await apiClient.get<CategoriesResponse>("/categories", {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return response.data.data.categories;
}

export async function createCategory(input: CreateCategoryInput) {
  const response = await apiClient.post<CategoryResponse>(
    "/categories",
    input,
  );
  return response.data.data.category;
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const response = await apiClient.patch<CategoryResponse>(
    `/categories/${id}`,
    input,
  );
  return response.data.data.category;
}

export async function deleteCategory(id: string) {
  await apiClient.delete(`/categories/${id}`);
}
