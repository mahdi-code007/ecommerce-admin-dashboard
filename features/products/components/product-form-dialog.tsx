"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryOptions } from "@/features/categories/queries";
import {
  useBrandOptions,
  useCreateProduct,
  useUpdateProduct,
} from "@/features/products/queries";
import {
  emptyProductFormValues,
  productFormSchema,
  type ProductFormValues,
} from "@/features/products/schema";
import type { CreateProductInput, Product } from "@/features/products/types";
import { getApiErrorMessage } from "@/shared/api/errors";
import { majorToMinorUnits, minorUnitsToMajor } from "@/shared/lib/money";

type ProductFormDialogProps = {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
};

const NO_BRAND_VALUE = "none";

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description ?? "",
    price: String(minorUnitsToMajor(product.priceInMinorUnits)),
    stock: String(product.stock),
    categoryId: product.categoryId,
    brandId: product.brandId ?? "",
    image: product.image ?? "",
    isActive: product.isActive,
  };
}

function toApiInput(values: ProductFormValues): CreateProductInput {
  return {
    name: values.name,
    description: values.description.trim() || undefined,
    priceInMinorUnits: majorToMinorUnits(Number(values.price)),
    stock: Number(values.stock),
    categoryId: values.categoryId,
    brandId: values.brandId || undefined,
    image: values.image.trim() || undefined,
    isActive: values.isActive,
  };
}

export function ProductFormDialog({
  open,
  product,
  onOpenChange,
}: ProductFormDialogProps) {
  const isEditing = Boolean(product);
  const categoriesQuery = useCategoryOptions();
  const brandsQuery = useBrandOptions();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyProductFormValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(product ? toFormValues(product) : emptyProductFormValues);
  }, [form, open, product]);

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const input = toApiInput(values);

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          input: {
            ...input,
            brandId: values.brandId ? values.brandId : null,
          },
        });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(input);
        toast.success("Product created");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit product" : "Create product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the catalog details for this product."
              : "Add a new product to the store catalog."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FieldGroup className="gap-4">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="product-name">Name</FieldLabel>
              <Input
                id="product-name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="product-description">Description</FieldLabel>
              <Textarea
                id="product-description"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!form.formState.errors.price}>
                <FieldLabel htmlFor="product-price">Price (USD)</FieldLabel>
                <Input
                  id="product-price"
                  inputMode="decimal"
                  placeholder="19.99"
                  aria-invalid={!!form.formState.errors.price}
                  {...form.register("price")}
                />
                <FieldError errors={[form.formState.errors.price]} />
              </Field>
              <Field data-invalid={!!form.formState.errors.stock}>
                <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
                <Input
                  id="product-stock"
                  inputMode="numeric"
                  placeholder="10"
                  aria-invalid={!!form.formState.errors.stock}
                  {...form.register("stock")}
                />
                <FieldError errors={[form.formState.errors.stock]} />
              </Field>
            </div>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {(categoriesQuery.data ?? []).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Brand</FieldLabel>
                  <Select
                    value={field.value || NO_BRAND_VALUE}
                    onValueChange={(value) =>
                      field.onChange(value === NO_BRAND_VALUE ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No brand" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value={NO_BRAND_VALUE}>No brand</SelectItem>
                      {(brandsQuery.data ?? []).map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Field data-invalid={!!form.formState.errors.image}>
              <FieldLabel htmlFor="product-image">Image URL</FieldLabel>
              <Input
                id="product-image"
                placeholder="https://..."
                aria-invalid={!!form.formState.errors.image}
                {...form.register("image")}
              />
              <FieldError errors={[form.formState.errors.image]} />
            </Field>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Active</FieldTitle>
                    <FieldDescription>
                      Inactive products stay hidden from the public catalog.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Create product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
