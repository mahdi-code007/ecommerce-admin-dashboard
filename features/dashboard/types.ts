import type { OrderStatus } from "@/features/orders/types";

export type StatsRange = "7d" | "30d" | "90d";

export type StatsOverviewParams = {
  range: StatsRange;
};

export type OverviewKpis = {
  revenue: number;
  ordersCount: number;
  cancelledOrdersCount: number;
  averageOrderValue: number;
  discountTotal: number;
  pendingOrdersCount: number;
  productsCount: number;
  inactiveProductsCount: number;
  lowStockCount: number;
  activeCouponsCount: number;
};

export type SeriesPoint = {
  date: string;
  revenue: number;
  ordersCount: number;
  cancelledOrdersCount: number;
};

export type StatusBreakdownItem = {
  status: OrderStatus;
  count: number;
};

export type PaymentStatusBreakdownItem = {
  paymentStatus: "unpaid" | "paid";
  count: number;
};

export type TopProduct = {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  ordersCount: number;
};

export type TopCity = {
  city: string;
  ordersCount: number;
  revenue: number;
};

export type TopCoupon = {
  couponId: string | null;
  code: string;
  ordersCount: number;
  discountTotal: number;
  revenue: number;
};

export type LowStockProduct = {
  id: string;
  name: string;
  stock: number;
  isActive: boolean;
  productType: "simple" | "variable";
};

export type StatsOverview = {
  from: string;
  to: string;
  timezone: string;
  range: StatsRange | null;
  granularity: "day" | "week";
  kpis: OverviewKpis;
  series: {
    granularity: "day" | "week";
    points: SeriesPoint[];
  };
  statusBreakdown: StatusBreakdownItem[];
  paymentStatusBreakdown: PaymentStatusBreakdownItem[];
  topProducts: TopProduct[];
  topCities: TopCity[];
  topCoupons: TopCoupon[];
  lowStockProducts: LowStockProduct[];
};
