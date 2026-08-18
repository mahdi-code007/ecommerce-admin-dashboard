"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCoupon } from "@/features/coupons/queries";
import type { Coupon } from "@/features/coupons/types";
import { getApiErrorMessage } from "@/shared/api/errors";

type DeleteCouponDialogProps = {
  coupon: Coupon | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCouponDialog({
  coupon,
  onOpenChange,
}: DeleteCouponDialogProps) {
  const deleteCoupon = useDeleteCoupon();

  return (
    <AlertDialog open={Boolean(coupon)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete coupon</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{coupon?.code}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteCoupon.isPending}
            onClick={async (event) => {
              event.preventDefault();

              if (!coupon) {
                return;
              }

              try {
                await deleteCoupon.mutateAsync(coupon.id);
                toast.success("Coupon deleted");
                onOpenChange(false);
              } catch (error) {
                toast.error(getApiErrorMessage(error));
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
