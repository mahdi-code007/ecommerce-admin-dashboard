import { apiClient } from "@/shared/api/client";
import type { ApiSuccess, PaginatedSuccess } from "@/shared/api/types";
import type {
  Order,
  OrderListParams,
  UpdateableOrderStatus,
} from "@/features/orders/types";

type OrderResponse = ApiSuccess<{ order: Order }>;
type OrdersResponse = PaginatedSuccess<{ orders: Order[] }>;

export async function getAdminOrders(params: OrderListParams) {
  const response = await apiClient.get<OrdersResponse>("/admin/orders", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.status ? { status: params.status } : {}),
    },
  });

  return {
    orders: response.data.data.orders,
    pagination: response.data.pagination,
  };
}

export async function getAdminOrder(orderId: string) {
  const response = await apiClient.get<OrderResponse>(
    `/admin/orders/${orderId}`,
  );
  return response.data.data.order;
}

export async function updateOrderStatus(
  orderId: string,
  status: UpdateableOrderStatus,
) {
  const response = await apiClient.patch<OrderResponse>(
    `/admin/orders/${orderId}/status`,
    { status },
  );
  return response.data.data.order;
}
