/*
  Warnings:

  - Added the required column `price` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
