-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'ROOM', 'STUDIO', 'COMMERCIAL');

-- AlterTable
ALTER TABLE "RentHub" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "propertyType" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rooms" INTEGER,
ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "district" TEXT,
ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "showContacts" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "RentHub_city_price_idx" ON "RentHub"("city", "price");

-- CreateIndex
CREATE INDEX "RentHub_propertyType_price_idx" ON "RentHub"("propertyType", "price");
