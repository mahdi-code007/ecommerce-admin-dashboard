import { z } from "zod";

export const couponFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters"),
  discountType: z.enum(["fixed_amount", "percentage"]),
  discountValue: z
    .string()
    .trim()
    .min(1, "Discount value is required")
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: "Discount value must be greater than zero",
    }),
  isActive: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;

export const emptyCouponFormValues: CouponFormValues = {
  code: "",
  name: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  isActive: true,
};
