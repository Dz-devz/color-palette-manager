import { queryOptions } from "@tanstack/react-query";
import { getColors } from "@/api/colors";
import { getSpecificPalette, getPalettes } from "@/api/palettes";

export const colorsQuery = queryOptions({
  queryKey: ["colors"],
  queryFn: getColors,
  staleTime: 30 * 60 * 1000,
});

export const palettesQuery = queryOptions({
  queryKey: ["palettes"],
  queryFn: getPalettes,
});

export const paletteQuery = (id: number) =>
  queryOptions({
    queryKey: ["palettes", id],
    queryFn: () => getSpecificPalette(id),
  });
