import { z } from "zod";
import { slugSchema } from "@/lib/validation/common";

export const createLocationInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(150),
  city: z.string().trim().min(1).max(100),
});

export type CreateLocationInput = z.infer<typeof createLocationInputSchema>;
