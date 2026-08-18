"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  updateCoupon,
} from "@/features/coupons/api";
import type {
  CouponListParams,
  UpdateCouponInput,
} from "@/features/coupons/types";
import { queryKeys } from "@/shared/api/query-keys";

export function useCoupons(params: CouponListParams) {
  return useQuery({
    queryKey: queryKeys.coupons.list(params),
    queryFn: () => getAdminCoupons(params),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoupon,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
      ]);
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateCouponInput;
    }) => updateCoupon(id, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
      ]);
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
      ]);
    },
  });
}
