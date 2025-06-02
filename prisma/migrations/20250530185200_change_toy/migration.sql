/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedAge` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Toy` table. All the data in the column will be lost.
  - Added the required column `caption` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Toy" DROP CONSTRAINT "Toy_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Toy" DROP CONSTRAINT "Toy_statusId_fkey";

-- AlterTable
ALTER TABLE "Toy" DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "price",
DROP COLUMN "recommendedAge",
DROP COLUMN "statusId",
DROP COLUMN "userId",
ADD COLUMN     "caption" TEXT NOT NULL;
