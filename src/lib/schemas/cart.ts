// src/schemas/cart.ts
import { z } from "zod";

export const CartItemSchema = z.object({
  toyId: z.string(),   //toyId: z.string().uuid("Invalid toy ID"), no lo puedo poner con el seed que tengo
  quantity: z.number().int().positive("The amount must be positive").default(1),
  selected: z.union([
    z.boolean(),
    z.string().transform(val => val === 'true')
  ]).default(true)
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
  selected: z.union([
    z.boolean(),
    z.string().transform(val => val === 'true')
  ]).default(true)
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type CartInput = z.infer<typeof CartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
