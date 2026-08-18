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

export type CategoryListParams = {
  page: number;
  limit: number;
};

export type CreateCategoryInput = {
  name: string;
  description?: string;
  image?: string;
  parentId?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
