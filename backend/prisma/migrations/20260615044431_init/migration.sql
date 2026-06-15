-- CreateTable
CREATE TABLE "Palette" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "colors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Palette_pkey" PRIMARY KEY ("id")
);
