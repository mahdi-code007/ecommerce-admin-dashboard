"use client";

import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DeleteProductDialog } from "@/features/products/components/delete-product-dialog";
import { getProductColumns } from "@/features/products/components/product-columns";
import { ProductFormDialog } from "@/features/products/components/product-form-dialog";
import { useProducts } from "@/features/products/queries";
import type { Product } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/shared/components/data-table";
import { ListPagination } from "@/shared/components/list-pagination";

const PAGE_SIZE = 10;

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
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

      <ListPagination
        page={page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.total ?? 0}
        pageSize={PAGE_SIZE}
        isLoading={productsQuery.isLoading}
        onPageChange={setPage}
        emptyLabel="No products"
      />

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
