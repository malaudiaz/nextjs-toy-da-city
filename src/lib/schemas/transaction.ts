import { z } from "zod";

export const TransactionSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  description: z.string().optional(),
});

