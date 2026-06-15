import { Router } from "express";
import {
  createPaletteController,
  deletePaletteController,
  getPaletteController,
  listPalettesController,
  updatePaletteController,
} from ".";

const paletteRouter = Router();

paletteRouter.get("/palettes", listPalettesController);
paletteRouter.get("/palettes/:id", getPaletteController);
paletteRouter.post("/palettes", createPaletteController);
paletteRouter.put("/palettes/:id", updatePaletteController);
paletteRouter.delete("/palettes/:id", deletePaletteController);

export default paletteRouter;
