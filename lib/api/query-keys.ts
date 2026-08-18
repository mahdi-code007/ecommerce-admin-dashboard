import type { ProductListParams } from "@/lib/api/types";

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params: ProductListParams) =>
      ["products", "list", params] as const,
  },
  categories: {
    all: ["categories"] as const,
    options: ["categories", "options"] as const,
  },
  brands: {
    all: ["brands"] as const,
    options: ["brands", "options"] as const,
  },
};
