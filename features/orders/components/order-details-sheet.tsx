"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { useOrder, useUpdateOrderStatus } from "@/features/orders/queries";
import {
  STATUS_TRANSITIONS,
  type UpdateableOrderStatus,
} from "@/features/orders/types";
import { getApiErrorMessage } from "@/shared/api/errors";
import { formatMoney } from "@/shared/lib/money";
import { useState } from "react";

type OrderDetailsSheetProps = {
  orderId: string | null;
  onOpenChange: (open: boolean) => void;
};

export function OrderDetailsSheet({
  orderId,
  onOpenChange,
}: OrderDetailsSheetProps) {
  const orderQuery = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const [nextStatus, setNextStatus] = useState<string>("");
  const order = orderQuery.data;
  const allowedStatuses = order ? STATUS_TRANSITIONS[order.status] : [];

  return (
    <Sheet open={Boolean(orderId)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Order details</SheetTitle>
          <SheetDescription>
            {orderId ? `ID ${orderId.slice(0, 8)}` : "Select an order"}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-5 p-4">
          {orderQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading order...</p>
          ) : orderQuery.isError || !order ? (
            <p className="text-sm text-destructive">Could not load this order.</p>
          ) : (
            <>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <OrderStatusBadge status={order.status} />
                </p>
                <p>
                  <span className="text-muted-foreground">Payment:</span>{" "}
                  {order.paymentStatus} / {order.paymentMethod}
                </p>
                <p>
                  <span className="text-muted-foreground">Total:</span>{" "}
                  {formatMoney(order.total)}
                </p>
                {order.couponCode ? (
                  <p>
                    <span className="text-muted-foreground">Coupon:</span>{" "}
                    {order.couponCode}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium">Shipping</p>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.district},{" "}
                  {order.shippingAddress.city}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Items</p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span>
                      {item.productName}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""} ×{" "}
                      {item.quantity}
                    </span>
                    <span>{formatMoney(item.lineTotal)}</span>
                  </div>
                ))}
              </div>

              {allowedStatuses.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Change status</p>
                  <Select value={nextStatus} onValueChange={setNextStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select next status" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    disabled={!nextStatus || updateStatus.isPending}
                    onClick={async () => {
                      if (!nextStatus || !orderId) {
                        return;
                      }

                      try {
                        await updateStatus.mutateAsync({
                          orderId,
                          status: nextStatus as UpdateableOrderStatus,
                        });
                        toast.success("Order status updated");
                        setNextStatus("");
                      } catch (error) {
                        toast.error(getApiErrorMessage(error));
                      }
                    }}
                  >
                    Update status
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This order has no further status changes.
                </p>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
