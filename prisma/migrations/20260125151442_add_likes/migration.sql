-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rentHubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Like_rentHubId_idx" ON "Like"("rentHubId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_rentHubId_key" ON "Like"("userId", "rentHubId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_rentHubId_fkey" FOREIGN KEY ("rentHubId") REFERENCES "RentHub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
