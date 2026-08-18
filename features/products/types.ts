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

export type Brand = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
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
