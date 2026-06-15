import { z } from "zod";
import { HEX_COLOR_REGEX } from "../utils/regex";

const hexColor = z.string().regex(HEX_COLOR_REGEX, "Invalid hex color");

export const createPaletteSchema = z.object({
  name: z.string().min(1, "Palette name is required"),
  colors: z.array(hexColor).min(1, "A palette must contain at least one color"),
});

export const updatePaletteSchema = createPaletteSchema;

export const paletteIdSchema = z.coerce.number().int().positive();

export type CreatePaletteInput = z.infer<typeof createPaletteSchema>;
export type UpdatePaletteInput = z.infer<typeof updatePaletteSchema>;
