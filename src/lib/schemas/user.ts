import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(2, "Name must have at least 3 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone").optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type UserInput = z.infer<typeof UserSchema>;

export const UserUpdateSchema = z.object({
  name: z.string().min(2).max(300).optional(),
  email: z.string().optional(),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone").optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "You must submit at least one field to update"
});