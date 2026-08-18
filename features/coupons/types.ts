export type DiscountType = "fixed_amount" | "percentage";
export type CouponScope = "all" | "category" | "product";

export type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  timesUsed: number;
  scope: CouponScope;
  categoryIds: string[];
  productIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CouponListParams = {
  page: number;
  limit: number;
};

export type CreateCouponInput = {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  scope: CouponScope;
  isActive?: boolean;
  categoryIds?: string[];
  productIds?: string[];
};

export type UpdateCouponInput = Partial<CreateCouponInput>;
