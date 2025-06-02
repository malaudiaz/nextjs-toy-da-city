/*
  Warnings:

  - Added the required column `location` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedAge` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "recommendedAge" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;
