// traslation.schema.ts
import { z } from "zod";

export const TraslationSchema = z.object({
  key: z.string().min(3, "Key must have at least 3 characters"),
  value: z.string(),
});

export type TraslationInput = z.infer<typeof TraslationSchema>;
