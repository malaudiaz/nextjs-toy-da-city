// schemas/toy.ts
import { z } from "zod";

// Esquema para creación/actualización
export const ToySchema = z.object({
  description: z.string().min(3).max(500),
  title: z.string().min(3).max(500),
  price: z.number().min(0).max(10000),
  location: z
    .string()
    .optional()
    .or(z.literal("")) // ← Acepta string vacío también
    .refine(
      (val) => {
        if (!val || val === "") return true; // ← Vacío o undefined → válido
        const regex = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/;
        if (!regex.test(val)) return false;
        const [latStr, lngStr] = val.split(",");
        const lat = Number(latStr);
        const lng = Number(lngStr);
        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          Math.abs(lat) <= 90 &&
          Math.abs(lng) <= 180
        );
      },
      {
        message:
          'Formato inválido. Usa "latitud,longitud" con decimales. Ej: "40.7128,-74.0060". Latitud (-90 a 90), Longitud (-180 a 180).',
      }
    ),
  categoryId: z.number().min(0).max(10000),
  conditionId: z.number().min(0).max(10000),
  statusId: z.number().min(0).max(10000),
  forSell: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .default(true),
  forGifts: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .default(true),
  forChanges: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .default(true),
  media: z.array(z.string().url()).optional(),
});

// Esquema para filtros
export const ToyFilterSchema = z.object({
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().max(10000).optional(),
  forSell: z.string().optional(),
  forGifts: z.string().optional(),
  forChanges: z.string().optional(),
  categoryId: z.number().optional(),
  conditionId: z.number().optional(),
  conditions: z.string().optional(),
  locationRadius: z
    .object({
      lat: z.number(),
      lng: z.number(),
      radius: z.number().min(1).max(100), // en kilómetros
    })
    .optional(),
  search: z.string().optional(),
});

// Esquema para paginación
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Esquema de validación con Zod
export const toyFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "The title must have at least 3 characters")
      .max(100),
    description: z
      .string()
      .min(10, "The description must have at least 10 characters")
      .max(1000),
    price: z.number().min(0, "The price cannot be negative").optional(),
    categoryId: z
      .number()
      .int("Must be an integer")
      .min(1, "You must select a category"),
    conditionId: z
      .number()
      .int("Must be an integer")
      .min(1, "You must select a condition"),
    statusId: z.number().int('Must be an integer').min(1, 'You must select a status'),
    forSale: z.boolean(),
    forGift: z.boolean(),
    forChange: z.boolean(),
  })
  .refine((data) => !data.forSale || data.price !== undefined, {
    message: "Price is required when the toy is for sale",
    path: ["price"],
  });

export const toyFormEditSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  forSell: z.boolean(),
  forGifts: z.boolean(),
  forChanges: z.boolean(),
  price: z.number().min(0).optional(),
  categoryId: z.number(),
  conditionId: z.number(),
  // statusId: z.number(), // ← Si lo usas, descomenta
});

// Tipos inferidos
export type ToyInput = z.infer<typeof ToySchema>;
export type ToyFilterInput = z.infer<typeof ToyFilterSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type ToyFormValues = z.infer<typeof toyFormSchema>;
export type toyFormEditSchema = z.infer<typeof toyFormSchema>;
