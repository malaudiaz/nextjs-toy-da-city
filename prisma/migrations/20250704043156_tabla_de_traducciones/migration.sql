/*
  Warnings:

  - A unique constraint covering the columns `[languageId,key,categoryId,conditionId,statusId]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Translation_languageId_key_categoryId_conditionId_statusId_key" ON "Translation"("languageId", "key", "categoryId", "conditionId", "statusId");
