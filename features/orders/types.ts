export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type UpdateableOrderStatus = Exclude<OrderStatus, "pending">;

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  sku: string | null;
  variantLabel: string | null;
  unitPriceInMinorUnits: number;
  quantity: number;
  lineTotal: number;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  building: string | null;
  notes: string | null;
  country: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type OrderListParams = {
  page: number;
  limit: number;
  status?: OrderStatus;
};

export const STATUS_TRANSITIONS: Record<OrderStatus, UpdateableOrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
