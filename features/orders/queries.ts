"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrder,
  getAdminOrders,
  updateOrderStatus,
} from "@/features/orders/api";
import type {
  OrderListParams,
  UpdateableOrderStatus,
} from "@/features/orders/types";
import { queryKeys } from "@/shared/api/query-keys";

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => getAdminOrders(params),
  });
}

export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ""),
    queryFn: () => getAdminOrder(orderId ?? ""),
    enabled: Boolean(orderId),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: UpdateableOrderStatus;
    }) => updateOrderStatus(orderId, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
      ]);
    },
  });
}
