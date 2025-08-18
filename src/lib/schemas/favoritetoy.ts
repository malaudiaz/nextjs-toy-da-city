import { z } from 'zod';

export const FavoriteToySchema = z.object({
  toyId: z.string().uuid("Invalid toy ID")
});

export type FavoriteToyInput = z.infer<typeof FavoriteToySchema>;
