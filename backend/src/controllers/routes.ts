import paletteRouter from "./palette/routes";

export const routes = [paletteRouter] as const;

export type Route = (typeof routes)[number];
