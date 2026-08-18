import { apiClient } from "@/lib/api/client";
import type {
  ApiSuccess,
  CreateProductInput,
  PaginatedSuccess,
  Product,
  ProductListParams,
  UpdateProductInput,
} from "@/lib/api/types";

type ProductResponse = ApiSuccess<{ product: Product }>;
type ProductsResponse = PaginatedSuccess<{ products: Product[] }>;

export async function getProducts(params: ProductListParams) {
  const response = await apiClient.get<ProductsResponse>("/products", {
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
