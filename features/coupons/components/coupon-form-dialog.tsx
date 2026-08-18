"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCoupon,
  useUpdateCoupon,
} from "@/features/coupons/queries";
import {
  couponFormSchema,
  emptyCouponFormValues,
  type CouponFormValues,
} from "@/features/coupons/schema";
import type { Coupon, CreateCouponInput } from "@/features/coupons/types";
import { getApiErrorMessage } from "@/shared/api/errors";
import { majorToMinorUnits, minorUnitsToMajor } from "@/shared/lib/money";

type CouponFormDialogProps = {
  open: boolean;
  coupon: Coupon | null;
  onOpenChange: (open: boolean) => void;
};

function toFormValues(coupon: Coupon): CouponFormValues {
  return {
    code: coupon.code,
    name: coupon.name,
    description: coupon.description ?? "",
    discountType: coupon.discountType,
    discountValue:
      coupon.discountType === "percentage"
        ? String(coupon.discountValue)
        : String(minorUnitsToMajor(coupon.discountValue)),
    isActive: coupon.isActive,
  };
}

function toDiscountValue(
  discountType: CouponFormValues["discountType"],
  value: string,
): number {
  const amount = Number(value);
  return discountType === "percentage" ? Math.round(amount) : majorToMinorUnits(amount);
}

export function CouponFormDialog({
  open,
  coupon,
  onOpenChange,
}: CouponFormDialogProps) {
  const isEditing = Boolean(coupon);
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: emptyCouponFormValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(coupon ? toFormValues(coupon) : emptyCouponFormValues);
  }, [coupon, form, open]);

  const isSubmitting = createCoupon.isPending || updateCoupon.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const input: CreateCouponInput = {
      code: values.code,
      name: values.name,
      description: values.description.trim() || undefined,
      discountType: values.discountType,
      discountValue: toDiscountValue(values.discountType, values.discountValue),
      isActive: values.isActive,
      scope: coupon?.scope ?? "all",
      ...(coupon?.scope === "category"
        ? { categoryIds: coupon.categoryIds }
        : {}),
      ...(coupon?.scope === "product"
        ? { productIds: coupon.productIds }
        : {}),
    };

    try {
      if (coupon) {
        await updateCoupon.mutateAsync({ id: coupon.id, input });
        toast.success("Coupon updated");
      } else {
        await createCoupon.mutateAsync(input);
        toast.success("Coupon created");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit coupon" : "Create coupon"}
          </DialogTitle>
          <DialogDescription>
            New coupons apply store-wide. Category and product scopes can stay
            on existing coupons when you edit them.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FieldGroup className="gap-4">
            <Field data-invalid={!!form.formState.errors.code}>
              <FieldLabel htmlFor="coupon-code">Code</FieldLabel>
              <Input
                id="coupon-code"
                aria-invalid={!!form.formState.errors.code}
                {...form.register("code")}
              />
              <FieldError errors={[form.formState.errors.code]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="coupon-name">Name</FieldLabel>
              <Input
                id="coupon-name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="coupon-description">Description</FieldLabel>
              <Textarea
                id="coupon-description"
                {...form.register("description")}
              />
            </Field>
            <Controller
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Discount type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed amount</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Field data-invalid={!!form.formState.errors.discountValue}>
              <FieldLabel htmlFor="coupon-discount">
                Discount value
              </FieldLabel>
              <Input
                id="coupon-discount"
                inputMode="decimal"
                placeholder="10"
                aria-invalid={!!form.formState.errors.discountValue}
                {...form.register("discountValue")}
              />
              <FieldError errors={[form.formState.errors.discountValue]} />
            </Field>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Active</FieldTitle>
                    <FieldDescription>
                      Inactive coupons cannot be applied at checkout.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Create coupon"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
