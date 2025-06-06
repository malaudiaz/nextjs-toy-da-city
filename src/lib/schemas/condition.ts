import { z } from 'zod';

export const ConditionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(60, 'Name must be at most 50 characters'),
  description: z.string().max(200, 'Description must be at most 200 characters').optional(),
  isActive: z.boolean().optional().default(true)
});

export const PaginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    includeInactive: z.boolean().optional().default(false),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
  
export const ConditionUpdateSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "You must submit at least one field to update"
  });

export type ConditionInput = z.infer<typeof ConditionSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type ConditionUpdateInput = z.infer<typeof ConditionUpdateSchema>
