import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/features/orders/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
  shipped: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-400",
  delivered:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("capitalize", STATUS_STYLES[status], className)}
    >
      {status}
    </Badge>
  );
}
