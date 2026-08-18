"use client";

import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { getCouponColumns } from "@/features/coupons/components/coupon-columns";
import { CouponFormDialog } from "@/features/coupons/components/coupon-form-dialog";
import { DeleteCouponDialog } from "@/features/coupons/components/delete-coupon-dialog";
import { useCoupons } from "@/features/coupons/queries";
import type { Coupon } from "@/features/coupons/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/shared/components/data-table";
import { ListPagination } from "@/shared/components/list-pagination";

const PAGE_SIZE = 10;

export function CouponsPage() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const couponsQuery = useCoupons({ page, limit: PAGE_SIZE });

  const columns = useMemo(
    () =>
      getCouponColumns({
        onEdit: (coupon) => {
          setEditingCoupon(coupon);
          setFormOpen(true);
        },
        onDelete: setCouponToDelete,
      }),
    [],
  );

  const coupons = couponsQuery.data?.coupons ?? [];
  const pagination = couponsQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Coupons
          </h1>
          <p className="text-sm text-muted-foreground">
            Create store-wide discounts. Fixed amounts are stored in cents.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingCoupon(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon />
          Add coupon
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
        {couponsQuery.isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : couponsQuery.isError ? (
          <div className="p-6 text-sm text-destructive">
            Could not load coupons. Check that the API is running.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={coupons}
            emptyMessage="No coupons yet. Create the first one."
          />
        )}
      </div>

      <ListPagination
        page={page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.total ?? 0}
        pageSize={PAGE_SIZE}
        isLoading={couponsQuery.isLoading}
        onPageChange={setPage}
        emptyLabel="No coupons"
      />

      <CouponFormDialog
        open={formOpen}
        coupon={editingCoupon}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingCoupon(null);
          }
        }}
      />
      <DeleteCouponDialog
        coupon={couponToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCouponToDelete(null);
          }
        }}
      />
    </div>
  );
}
