import { request } from "@/api/client";
import { colorsResponseSchema, type Color } from "@/lib/schemas";

export function getColors(): Promise<Color[]> {
  return request("/colors", colorsResponseSchema);
}
