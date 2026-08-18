import { z } from "zod";

const requiredNumberString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${fieldName} must be a number`,
    });

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters"),
  price: requiredNumberString("Price").refine((value) => Number(value) > 0, {
    message: "Price must be greater than zero",
  }),
  stock: requiredNumberString("Stock").refine(
    (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
    {
      message: "Stock must be a whole number of 0 or more",
    },
  ),
  categoryId: z.string().uuid("Select a category"),
  brandId: z.string(),
  image: z.string(),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  brandId: "",
  image: "",
  isActive: true,
};
