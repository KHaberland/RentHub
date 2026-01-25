-- AlterTable
ALTER TABLE "ApartRent" RENAME CONSTRAINT "Prompt_pkey" TO "ApartRent_pkey";

-- CreateTable
CREATE TABLE "RentHub" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentHub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RentHub_userId_createdAt_idx" ON "RentHub"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RentHub_isPublic_createdAt_idx" ON "RentHub"("isPublic", "createdAt");

-- CreateIndex
CREATE INDEX "RentHub_isFavorite_createdAt_idx" ON "RentHub"("isFavorite", "createdAt");

-- AddForeignKey
ALTER TABLE "RentHub" ADD CONSTRAINT "RentHub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
