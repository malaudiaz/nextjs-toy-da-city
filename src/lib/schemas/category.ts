import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  description: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar"
});