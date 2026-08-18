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
import { useDeleteProduct } from "@/features/products/queries";
import type { Product } from "@/features/products/types";
import { getApiErrorMessage } from "@/shared/api/errors";

type DeleteProductDialogProps = {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteProductDialog({
  product,
  onOpenChange,
}: DeleteProductDialogProps) {
  const deleteProduct = useDeleteProduct();

  return (
    <AlertDialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {product?.name}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteProduct.isPending}
            onClick={async (event) => {
              event.preventDefault();

              if (!product) {
                return;
              }

              try {
                await deleteProduct.mutateAsync(product.id);
                toast.success("Product deleted");
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
