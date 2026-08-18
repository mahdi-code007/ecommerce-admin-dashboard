"use client";

import { useMemo, useState } from "react";
import { getOrderColumns } from "@/features/orders/components/order-columns";
import { OrderDetailsSheet } from "@/features/orders/components/order-details-sheet";
import { useOrders } from "@/features/orders/queries";
import { ORDER_STATUSES, type OrderStatus } from "@/features/orders/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/shared/components/data-table";
import { ListPagination } from "@/shared/components/list-pagination";

const PAGE_SIZE = 10;
const ALL_STATUSES = "all";

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>(ALL_STATUSES);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const ordersQuery = useOrders({
    page,
    limit: PAGE_SIZE,
    status: status === ALL_STATUSES ? undefined : (status as OrderStatus),
  });

  const columns = useMemo(
    () =>
      getOrderColumns({
        onView: (order) => setSelectedOrderId(order.id),
      }),
    [],
  );

  const orders = ordersQuery.data?.orders ?? [];
  const pagination = ordersQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          Review store orders and move them through fulfillment.
        </p>
      </div>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
          {ORDER_STATUSES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
        {ordersQuery.isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : ordersQuery.isError ? (
          <div className="p-6 text-sm text-destructive">
            Could not load orders. Check that the API is running.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={orders}
            emptyMessage="No orders yet."
          />
        )}
      </div>

      <ListPagination
        page={page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.total ?? 0}
        pageSize={PAGE_SIZE}
        isLoading={ordersQuery.isLoading}
        onPageChange={setPage}
        emptyLabel="No orders"
      />

      <OrderDetailsSheet
        orderId={selectedOrderId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
      />
    </div>
  );
}
