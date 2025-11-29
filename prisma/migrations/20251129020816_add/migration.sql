-- CreateTable
CREATE TABLE "gift_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toyId" TEXT NOT NULL,
    "forGifts" BOOLEAN NOT NULL DEFAULT true,
    "forChanges" BOOLEAN NOT NULL DEFAULT true,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exchangeToyId" TEXT,

    CONSTRAINT "gift_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gift_requests_toyId_userId_key" ON "gift_requests"("toyId", "userId");

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "toys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_exchangeToyId_fkey" FOREIGN KEY ("exchangeToyId") REFERENCES "toys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
