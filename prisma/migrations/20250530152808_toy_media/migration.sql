-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "toyId" INTEGER NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
