import { apiClient } from "@/shared/api/client";
import type { ApiSuccess, PaginatedSuccess } from "@/shared/api/types";
import type {
  Coupon,
  CouponListParams,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/features/coupons/types";

type CouponResponse = ApiSuccess<{ coupon: Coupon }>;
type CouponsResponse = PaginatedSuccess<{ coupons: Coupon[] }>;

export async function getAdminCoupons(params: CouponListParams) {
  const response = await apiClient.get<CouponsResponse>("/admin/coupons", {
    params: {
      page: params.page,
      limit: params.limit,
    },
  });

  return {
    coupons: response.data.data.coupons,
    pagination: response.data.pagination,
  };
}

export async function createCoupon(input: CreateCouponInput) {
  const response = await apiClient.post<CouponResponse>(
    "/admin/coupons",
    input,
  );
  return response.data.data.coupon;
}

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  const response = await apiClient.patch<CouponResponse>(
    `/admin/coupons/${id}`,
    input,
  );
  return response.data.data.coupon;
}

export async function deleteCoupon(id: string) {
  await apiClient.delete(`/admin/coupons/${id}`);
}
