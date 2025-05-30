// schemas/toy.ts
import { z } from 'zod'

export const ToySchema = z.object({
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  location: z.string().optional(),
  recommendedAge: z.number().int().positive('La edad recomendada debe ser un número positivo'),
  categoryId: z.number().int().positive('La categoría es requerida'),
  statusId: z.number().int().positive('El estado es requerido'),
})

export const ToyUpdateSchema = z.object({
    description: z.string().optional(),
    price: z.number().positive('El precio debe ser positivo'),
    location: z.string().optional(),
    recommendedAge: z.number().int().positive('La edad recomendada debe ser un número positivo'),
    categoryId: z.number().int().positive('La categoría es requerida'),
    statusId: z.number().int().positive('El estado es requerido'),
  }).refine(data => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar"
  });

export type JugueteInput = z.infer<typeof ToySchema>

export const PaginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
  });
