import { Router } from "express";
import { listColorsController } from ".";

const colorsRouter = Router();

colorsRouter.get("/colors", listColorsController);

export default colorsRouter;
