import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters"),
  image: z.string(),
  parentId: z.string(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const emptyCategoryFormValues: CategoryFormValues = {
  name: "",
  description: "",
  image: "",
  parentId: "",
};
