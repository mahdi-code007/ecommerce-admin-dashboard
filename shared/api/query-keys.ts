import type { ListParams } from "@/shared/api/types";

type OrderListParams = ListParams & {
  status?: string;
};

type CouponListParams = ListParams & {
  isActive?: boolean;
};

type StatsOverviewParams = {
  range: "7d" | "30d" | "90d";
};

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params: ListParams) => ["products", "list", params] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (params: ListParams) => ["categories", "list", params] as const,
    options: ["categories", "options"] as const,
  },
  brands: {
    options: ["brands", "options"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params: OrderListParams) => ["orders", "list", params] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
  coupons: {
    all: ["coupons"] as const,
    list: (params: CouponListParams) => ["coupons", "list", params] as const,
  },
  stats: {
    all: ["stats"] as const,
    overview: (params: StatsOverviewParams) =>
      ["stats", "overview", params] as const,
  },
};
