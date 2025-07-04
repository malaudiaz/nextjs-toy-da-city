/*
  Warnings:

  - You are about to drop the column `entity` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `Translation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "translation_condition_fk";

-- DropIndex
DROP INDEX "Translation_entity_entityId_languageId_key_key";

-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "entity",
DROP COLUMN "entityId",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "conditionId" INTEGER,
ADD COLUMN     "statusId" INTEGER;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
