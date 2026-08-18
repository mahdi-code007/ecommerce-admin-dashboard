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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategoryOptions,
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/queries";
import {
  categoryFormSchema,
  emptyCategoryFormValues,
  type CategoryFormValues,
} from "@/features/categories/schema";
import type { Category, CreateCategoryInput } from "@/features/categories/types";
import { getApiErrorMessage } from "@/shared/api/errors";

type CategoryFormDialogProps = {
  open: boolean;
  category: Category | null;
  onOpenChange: (open: boolean) => void;
};

const NO_PARENT_VALUE = "none";

function toFormValues(category: Category): CategoryFormValues {
  return {
    name: category.name,
    description: category.description ?? "",
    image: category.image ?? "",
    parentId: category.parentId ?? "",
  };
}

function toApiInput(values: CategoryFormValues): CreateCategoryInput {
  return {
    name: values.name,
    description: values.description.trim() || undefined,
    image: values.image.trim() || undefined,
    parentId: values.parentId || null,
  };
}

export function CategoryFormDialog({
  open,
  category,
  onOpenChange,
}: CategoryFormDialogProps) {
  const isEditing = Boolean(category);
  const optionsQuery = useCategoryOptions();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyCategoryFormValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(category ? toFormValues(category) : emptyCategoryFormValues);
  }, [category, form, open]);

  const parentOptions = (optionsQuery.data ?? []).filter(
    (item) => item.id !== category?.id && !item.parentId,
  );

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const input = toApiInput(values);

    try {
      if (category) {
        await updateCategory.mutateAsync({
          id: category.id,
          input,
        });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(input);
        toast.success("Category created");
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
            {isEditing ? "Edit category" : "Create category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this category."
              : "Add a category or subcategory to the catalog."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FieldGroup className="gap-4">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input
                id="category-name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="category-description">Description</FieldLabel>
              <Textarea
                id="category-description"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
            <Controller
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Parent category</FieldLabel>
                  <Select
                    value={field.value || NO_PARENT_VALUE}
                    onValueChange={(value) =>
                      field.onChange(value === NO_PARENT_VALUE ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Root category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value={NO_PARENT_VALUE}>
                        Root category
                      </SelectItem>
                      {parentOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="category-image">Image URL</FieldLabel>
              <Input
                id="category-image"
                placeholder="https://..."
                {...form.register("image")}
              />
            </Field>
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
                "Create category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
