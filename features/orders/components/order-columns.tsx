"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/features/orders/types";
import { formatMoney } from "@/shared/lib/money";

type OrderColumnActions = {
  onView: (order: Order) => void;
};

export function getOrderColumns({
  onView,
}: OrderColumnActions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "Order",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id.slice(0, 8)}</span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => row.original.shippingAddress.fullName,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => formatMoney(row.original.total),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-US"),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onView(row.original)}
        >
          <EyeIcon />
          <span className="sr-only">View order</span>
        </Button>
      ),
    },
  ];
}
