import { apiClient } from "@/shared/api/client";
import type { ApiSuccess, PaginatedSuccess } from "@/shared/api/types";
import type {
  Brand,
  CreateProductInput,
  Product,
  ProductListParams,
  UpdateProductInput,
} from "@/features/products/types";

type ProductResponse = ApiSuccess<{ product: Product }>;
type ProductsResponse = PaginatedSuccess<{ products: Product[] }>;
type BrandsResponse = PaginatedSuccess<{ brands: Brand[] }>;

export async function getAdminProducts(params: ProductListParams) {
  const response = await apiClient.get<ProductsResponse>("/admin/products", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search ? { search: params.search } : {}),
    },
  });

  return {
    products: response.data.data.products,
    pagination: response.data.pagination,
  };
}

export async function createProduct(input: CreateProductInput) {
  const response = await apiClient.post<ProductResponse>("/products", input);
  return response.data.data.product;
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const response = await apiClient.patch<ProductResponse>(
    `/products/${id}`,
    input,
  );
  return response.data.data.product;
}

export async function deleteProduct(id: string) {
  await apiClient.delete(`/products/${id}`);
}

export async function getBrandOptions() {
  const response = await apiClient.get<BrandsResponse>("/brands", {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return response.data.data.brands;
}
