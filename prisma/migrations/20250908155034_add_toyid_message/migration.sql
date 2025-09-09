-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "toyId" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "toys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
