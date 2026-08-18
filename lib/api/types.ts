export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type ProductCategorySummary = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type ProductBrandSummary = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceInMinorUnits: number;
  stock: number;
  categoryId: string;
  brandId: string | null;
  image: string | null;
  isActive: boolean;
  ratingAverage: number;
  ratingsCount: number;
  createdAt: string;
  updatedAt: string;
  category: ProductCategorySummary;
  brand: ProductBrandSummary | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type ApiSuccess<T> = {
  status: "success";
  data: T;
  message?: string;
};

export type PaginatedSuccess<T> = ApiSuccess<T> & {
  pagination: Pagination;
};

export type ProductListParams = {
  page: number;
  limit: number;
  search?: string;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  priceInMinorUnits: number;
  stock: number;
  categoryId: string;
  brandId?: string | null;
  image?: string;
  isActive?: boolean;
};

export type UpdateProductInput = Partial<CreateProductInput>;
