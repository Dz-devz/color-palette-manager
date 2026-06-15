import { Request, Response } from "express";
import {
  createPalette,
  deletePalette,
  getPaletteById,
  getPalettes,
  updatePalette,
} from "../../data/index";
import {
  createPaletteSchema,
  paletteIdSchema,
  updatePaletteSchema,
} from "../../schemas/palette";

export async function listPalettesController(_req: Request, res: Response) {
  const palettes = await getPalettes();
  res.json(palettes);
}

export async function getPaletteController(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = paletteIdSchema.parse(req.params.id);
  const palette = await getPaletteById(id);
  res.json(palette);
}

export async function createPaletteController(req: Request, res: Response) {
  const { name, colors } = createPaletteSchema.parse(req.body);
  const palette = await createPalette(name, colors);
  res.status(201).json(palette);
}

export async function updatePaletteController(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = paletteIdSchema.parse(req.params.id);
  const { name, colors } = updatePaletteSchema.parse(req.body);
  const palette = await updatePalette(id, name, colors);
  res.json(palette);
}

export async function deletePaletteController(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = paletteIdSchema.parse(req.params.id);
  await deletePalette(id);
  res.status(204).send();
}
