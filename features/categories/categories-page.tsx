"use client";

import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { getCategoryColumns } from "@/features/categories/components/category-columns";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { DeleteCategoryDialog } from "@/features/categories/components/delete-category-dialog";
import {
  useCategories,
  useCategoryOptions,
} from "@/features/categories/queries";
import type { Category } from "@/features/categories/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/shared/components/data-table";
import { ListPagination } from "@/shared/components/list-pagination";

const PAGE_SIZE = 10;

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const categoriesQuery = useCategories({ page, limit: PAGE_SIZE });
  const optionsQuery = useCategoryOptions();

  const parentNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of optionsQuery.data ?? []) {
      map.set(category.id, category.name);
    }
    return map;
  }, [optionsQuery.data]);

  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: (category) => {
          setEditingCategory(category);
          setFormOpen(true);
        },
        onDelete: setCategoryToDelete,
        getParentName: (parentId) => parentNameById.get(parentId) ?? "Unknown",
      }),
    [parentNameById],
  );

  const categories = categoriesQuery.data?.categories ?? [];
  const pagination = categoriesQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize products into root categories and subcategories.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon />
          Add category
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
        {categoriesQuery.isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : categoriesQuery.isError ? (
          <div className="p-6 text-sm text-destructive">
            Could not load categories. Check that the API is running.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={categories}
            emptyMessage="No categories yet. Create the first one."
          />
        )}
      </div>

      <ListPagination
        page={page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.total ?? 0}
        pageSize={PAGE_SIZE}
        isLoading={categoriesQuery.isLoading}
        onPageChange={setPage}
        emptyLabel="No categories"
      />

      <CategoryFormDialog
        open={formOpen}
        category={editingCategory}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingCategory(null);
          }
        }}
      />
      <DeleteCategoryDialog
        category={categoryToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null);
          }
        }}
      />
    </div>
  );
}
