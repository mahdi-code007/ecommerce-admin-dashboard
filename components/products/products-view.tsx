"use client";

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { getProductColumns } from "@/components/products/product-columns";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/lib/api/types";

const PAGE_SIZE = 10;

export function ProductsView() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = searchInput.trim();
      setSearch(nextSearch);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const productsQuery = useProducts({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const columns = useMemo(
    () =>
      getProductColumns({
        onEdit: (product) => {
          setEditingProduct(product);
          setFormOpen(true);
        },
        onDelete: setProductToDelete,
      }),
    [],
  );

  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the store catalog. Prices are stored in cents on the API.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon />
          Add product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search products"
          className="pl-8"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
        {productsQuery.isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : productsQuery.isError ? (
          <div className="p-6 text-sm text-destructive">
            Could not load products. Check that the API is running on port 8000.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={products}
            emptyMessage={
              search
                ? "No products match this search."
                : "No products yet. Create the first one."
            }
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? "No products" : `Showing ${from}-${to} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || productsQuery.isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeftIcon />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages || productsQuery.isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <ProductFormDialog
        open={formOpen}
        product={editingProduct}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingProduct(null);
          }
        }}
      />
      <DeleteProductDialog
        product={productToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
          }
        }}
      />
    </div>
  );
}
