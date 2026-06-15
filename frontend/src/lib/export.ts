import type { Palette } from "@/lib/schemas";

type ExportablePalette = Pick<Palette, "name" | "colors">;

export function paletteToJson(palette: ExportablePalette): string {
  return JSON.stringify(
    { name: palette.name, colors: palette.colors },
    null,
    2,
  );
}

export function downloadPaletteJson(palette: ExportablePalette): void {
  const blob = new Blob([paletteToJson(palette)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slugify(palette.name) || "palette"}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
