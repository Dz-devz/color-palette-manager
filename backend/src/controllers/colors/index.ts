import { Request, Response } from "express";
import { getColors } from "../../data/colors";

export async function listColorsController(_req: Request, res: Response) {
  const colors = await getColors();
  res.json(colors);
}
