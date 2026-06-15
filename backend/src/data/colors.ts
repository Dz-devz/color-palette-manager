import { env } from "../env";
import { prolookResponseSchema } from "../schemas/colors";

export interface Color {
  id: number;
  name: string;
  code: string;
  hex: string;
}

export async function getColors(): Promise<Color[]> {
  const response = await fetch(env.PROLOOK_COLORS_URL);

  if (!response.ok) {
    throw new Error(
      `Colors API responded with ${response.status} ${response.statusText}`,
    );
  }

  const { colors } = prolookResponseSchema.parse(await response.json());

  return colors
    .filter((color) => color.active === 1)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((color) => ({
      id: color.id,
      name: color.name,
      code: color.color_code ?? "",
      hex: `#${color.hex_code.replace(/^#/, "")}`,
    }));
}
