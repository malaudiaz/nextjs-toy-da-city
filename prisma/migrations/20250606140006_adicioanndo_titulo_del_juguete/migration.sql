/*
  Warnings:

  - Added the required column `title` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" ADD COLUMN     "title" TEXT NOT NULL;
