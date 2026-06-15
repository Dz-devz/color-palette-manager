import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:8080"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten());
  throw new Error("Invalid environment variables");
}

/** Backend origin http://localhost:8080 */
export const API_URL = parsed.data.VITE_API_URL;

/** Backend API all endpoints are /api */
export const API_BASE_URL = `${API_URL}/api`;
