import { z } from 'zod';

export const LikesToySchema = z.object({
  isActive: z.boolean().optional().default(true)
});

export const LikesCommentsSchema = z.object({
    isActive: z.boolean().optional().default(true)
  });

export type LikesToyInput = z.infer<typeof LikesToySchema>;
export type LikesCommentsInput = z.infer<typeof LikesCommentsSchema>;
