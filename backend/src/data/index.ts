import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../env";
import { PrismaClient } from "../generated/prisma/client";
import { NotFoundError } from "../utils/errors";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function getPalettes() {
  return prisma.palette.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaletteById(id: number) {
  const palette = await prisma.palette.findUnique({
    where: { id },
  });

  if (!palette) {
    throw new NotFoundError("Palette not found");
  }

  return palette;
}

export async function createPalette(name: string, colors: string[]) {
  return prisma.palette.create({
    data: { name, colors },
  });
}

export async function updatePalette(
  id: number,
  name: string,
  colors: string[],
) {
  await getPaletteById(id);

  return prisma.palette.update({
    where: { id },
    data: { name, colors },
  });
}

export async function deletePalette(id: number) {
  await getPaletteById(id);

  return prisma.palette.delete({
    where: { id },
  });
}
