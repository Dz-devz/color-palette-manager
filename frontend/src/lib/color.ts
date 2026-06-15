export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export const COLOR_FORMATS = ["HEX", "RGB", "RGBA", "HSL", "HSLA"] as const;
export type ColorFormatLabel = (typeof COLOR_FORMATS)[number];

export interface ColorFormat {
  label: ColorFormatLabel;
  value: string;
}

export function hexToRgb(hex: string): Rgb | null {
  const cleaned = hex.replace(/^#/, "").trim();

  const expanded =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

export function rgbToHsl({ r, g, b }: Rgb): {
  h: number;
  s: number;
  l: number;
} {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / delta + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function normalizeHex(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex.toUpperCase();
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function colorFormats(hex: string): ColorFormat[] {
  if (!hexToRgb(hex)) return [{ label: "HEX", value: hex.toUpperCase() }];
  return COLOR_FORMATS.map((label) => ({
    label,
    value: formatColor(hex, label),
  }));
}

export function formatColor(hex: string, label: ColorFormatLabel): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex.toUpperCase();

  const { r, g, b } = rgb;
  const { h, s, l } = rgbToHsl(rgb);

  switch (label) {
    case "HEX":
      return normalizeHex(hex);
    case "RGB":
      return `rgb(${r}, ${g}, ${b})`;
    case "RGBA":
      return `rgba(${r}, ${g}, ${b}, 1)`;
    case "HSL":
      return `hsl(${h}, ${s}%, ${l}%)`;
    case "HSLA":
      return `hsla(${h}, ${s}%, ${l}%, 1)`;
  }
}
