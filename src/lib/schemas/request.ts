import { z } from 'zod';

export const GiftRequestSchema = z.object({
  toyId: z.string().uuid("Invalid toy ID")  
});

// Esquema para paginación
export const PaginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  });
  

export type GiftRequestInput = z.infer<typeof GiftRequestSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
