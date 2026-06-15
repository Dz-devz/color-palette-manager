import { z } from "zod";
import { request } from "@/api/client";
import {
  paletteSchema,
  palettesResponseSchema,
  type Palette,
  type PaletteInput,
} from "@/lib/schemas";

export function getPalettes(): Promise<Palette[]> {
  return request("/palettes", palettesResponseSchema);
}

export function getSpecificPalette(id: number): Promise<Palette> {
  return request(`/palettes/${id}`, paletteSchema);
}

export function createPalette(input: PaletteInput): Promise<Palette> {
  return request("/palettes", paletteSchema, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePalette(
  id: number,
  input: PaletteInput,
): Promise<Palette> {
  return request(`/palettes/${id}`, paletteSchema, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deletePalette(id: number): Promise<void> {
  return request(`/palettes/${id}`, z.void(), { method: "DELETE" });
}
