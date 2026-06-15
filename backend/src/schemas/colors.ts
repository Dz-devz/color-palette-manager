import { z } from "zod";

// we only get the fields we need from the api to avoid cluttered
export const prolookColorSchema = z.object({
  id: z.number(),
  name: z.string(),
  color_code: z.string().nullable().optional(),
  hex_code: z.string(),
  active: z.number(),
  order: z.number().nullable().optional(),
});

export const prolookResponseSchema = z.object({
  success: z.boolean(),
  colors: z.array(prolookColorSchema),
});
