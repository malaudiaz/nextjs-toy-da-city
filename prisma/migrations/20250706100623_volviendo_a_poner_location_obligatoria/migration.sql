/*
  Warnings:

  - Made the column `location` on table `Toy` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Toy" ALTER COLUMN "location" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
