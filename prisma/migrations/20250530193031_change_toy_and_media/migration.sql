/*
  Warnings:

  - You are about to drop the column `caption` on the `Toy` table. All the data in the column will be lost.
  - Added the required column `description` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" DROP COLUMN "caption",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
