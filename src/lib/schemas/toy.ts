// schemas/toy.ts
import { z } from "zod";

// Esquema para creación/actualización
export const ToySchema = z.object({
  description: z.string().min(3).max(500),
  title: z.string().min(3).max(500),
  price: z.number().min(0).max(10000),
  location: z.string()
    .regex(/^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/, {
      message: 'Formato inválido. Use "latitud,longitud" con decimales. Ejemplo: "40.7128,-74.0060"'
    })
    .refine(val => {
      const [lat, lng] = val.split(',').map(Number)
      return Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    }, {
      message: 'Valores inválidos. Latitud (-90 a 90) y Longitud (-180 a 180)'
  }),
  categoryId: z.number().min(0).max(10000),
  conditionId: z.number().min(0).max(10000),
  statusId: z.number().min(0).max(10000),
  forSell: z.boolean().default(true),
  forGifts: z.boolean().default(false),
  forChanges: z.boolean().default(false), 
  media: z.array(z.string().url()).optional(),
})

// Esquema para filtros
export const ToyFilterSchema = z.object({
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().max(10000).optional(),
  locationRadius: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().min(1).max(100) // en kilómetros
  }).optional(),
  search: z.string().optional()
})

// Esquema para paginación
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Esquema de validación con Zod
export const toyFormSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000),
  price: z.number().min(0, 'El precio no puede ser negativo').optional(),
  categoryId: z.number().int('Debe ser un número entero').min(1, 'Debes seleccionar una categoría'),
  statusId: z.number().int('Debe ser un número entero').min(1, 'Debes seleccionar un estado'),
  conditionId: z.number().int('Debe ser un número entero').min(1, 'Debes seleccionar una condición'),
  forSale: z.boolean(),
  forGift: z.boolean(),
  forChange: z.boolean(),
}).refine(data => !data.forSale || data.price !== undefined, {
  message: "El precio es requerido cuando el juguete está en venta",
  path: ["price"]
});



// Tipos inferidos
export type ToyInput = z.infer<typeof ToySchema>
export type ToyFilterInput = z.infer<typeof ToyFilterSchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
export type ToyFormValues = z.infer<typeof toyFormSchema>;
