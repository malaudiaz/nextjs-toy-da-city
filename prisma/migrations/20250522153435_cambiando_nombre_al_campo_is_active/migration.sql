/*
  Warnings:

  - You are about to drop the column `is_active` on the `Status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Status" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
