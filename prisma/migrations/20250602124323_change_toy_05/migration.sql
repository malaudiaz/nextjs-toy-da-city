/*
  Warnings:

  - Added the required column `categoryId` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Toy" ADD CONSTRAINT "Toy_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toy" ADD CONSTRAINT "Toy_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
