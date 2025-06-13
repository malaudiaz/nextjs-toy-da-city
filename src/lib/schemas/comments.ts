import { z } from 'zod';

export const CommentsSchema = z.object({
  summary: z.string().min(3, 'Name must be at least 3 characters'),
  isActive: z.boolean().optional().default(true)
});

export const CommentsUpdateSchema = z.object({
    summary: z.string().min(3).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "You must submit at least one field to update"
  });

export const CommentsCommentsSchema = z.object({
    summary: z.string().min(3, 'Name must be at least 3 characters'),
    isActive: z.boolean().optional().default(true)
  });

export const CommentsCommentsUpdateSchema = z.object({
    summary: z.string().min(3).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "You must submit at least one field to update"
  });

export const PaginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    includeInactive: z.boolean().optional().default(false),
    sortBy: z.enum(['summary', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
  

export type CommentsInput = z.infer<typeof CommentsSchema>;
export type CommentsUpdateInput = z.infer<typeof CommentsUpdateSchema>

export type CommentsCommentsInput = z.infer<typeof CommentsCommentsSchema>;
export type CommentsCommentsUpdateInput = z.infer<typeof CommentsCommentsUpdateSchema>

export type PaginationInput = z.infer<typeof PaginationSchema>;