/*
  Warnings:

  - The primary key for the `Toy` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_toyId_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "toyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Toy" DROP CONSTRAINT "Toy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Toy_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Toy_id_seq";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
