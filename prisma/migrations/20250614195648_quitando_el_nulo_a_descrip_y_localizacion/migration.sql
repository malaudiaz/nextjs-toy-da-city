/*
  Warnings:

  - Made the column `description` on table `Toy` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Toy` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Toy" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
