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
import { useDeleteCategory } from "@/features/categories/queries";
import type { Category } from "@/features/categories/types";
import { getApiErrorMessage } from "@/shared/api/errors";

type DeleteCategoryDialogProps = {
  category: Category | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCategoryDialog({
  category,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();

  return (
    <AlertDialog open={Boolean(category)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {category?.name}
            </span>
            . Categories with products or subcategories cannot be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteCategory.isPending}
            onClick={async (event) => {
              event.preventDefault();

              if (!category) {
                return;
              }

              try {
                await deleteCategory.mutateAsync(category.id);
                toast.success("Category deleted");
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
