import colorsRouter from "./colors/routes";
import paletteRouter from "./palette/routes";

export const routes = [paletteRouter, colorsRouter] as const;

export type Route = (typeof routes)[number];
