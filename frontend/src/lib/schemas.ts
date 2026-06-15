import { z } from "zod";

export const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  hex: z.string(),
});
export const colorsResponseSchema = z.array(colorSchema);
export type Color = z.infer<typeof colorSchema>;

export const paletteSchema = z.object({
  id: z.number(),
  name: z.string(),
  colors: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const palettesResponseSchema = z.array(paletteSchema);
export type Palette = z.infer<typeof paletteSchema>;

export const paletteInputSchema = z.object({
  name: z.string().min(1, "Palette name is required"),
  colors: z
    .array(z.string().regex(HEX_COLOR_REGEX, "Invalid hex color"))
    .min(1, "A palette must contain at least one color"),
});
export type PaletteInput = z.infer<typeof paletteInputSchema>;

export const homeSearchSchema = z.object({
  edit: z.coerce.number().int().positive().optional(),
  q: z.string().optional(),
});
export type HomeSearch = z.infer<typeof homeSearchSchema>;
