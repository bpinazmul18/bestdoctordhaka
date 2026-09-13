import { z } from "zod";
import { slugSchema } from "@/lib/validation/common";

export const createSpecialtyInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(500).optional(),
});

export type CreateSpecialtyInput = z.infer<typeof createSpecialtyInputSchema>;
