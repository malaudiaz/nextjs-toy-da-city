/*
  Warnings:

  - You are about to drop the column `description` on the `Toy` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Toy` table. All the data in the column will be lost.
  - Added the required column `caption` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" DROP COLUMN "description",
DROP COLUMN "price",
ADD COLUMN     "caption" TEXT NOT NULL;
