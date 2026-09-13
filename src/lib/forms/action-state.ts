import type { z } from "zod";

export type ActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export function zodFlattenErrors(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
