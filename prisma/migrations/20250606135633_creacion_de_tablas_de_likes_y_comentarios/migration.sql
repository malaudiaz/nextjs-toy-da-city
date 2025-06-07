/*
  Warnings:

  - You are about to drop the column `recommendedAge` on the `Toy` table. All the data in the column will be lost.
  - Added the required column `conditionId` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forChanges` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forGifts` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forOthers` to the `Toy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forSell` to the `Toy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toy" DROP COLUMN "recommendedAge",
ADD COLUMN     "conditionId" INTEGER NOT NULL,
ADD COLUMN     "forChanges" BOOLEAN NOT NULL,
ADD COLUMN     "forGifts" BOOLEAN NOT NULL,
ADD COLUMN     "forOthers" BOOLEAN NOT NULL,
ADD COLUMN     "forSell" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Condition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToyLikes" (
    "id" TEXT NOT NULL,
    "toyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToyLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToyComments" (
    "id" TEXT NOT NULL,
    "toyId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToyComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentsLikes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentsLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentsComments" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentsComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Condition_name_key" ON "Condition"("name");

-- AddForeignKey
ALTER TABLE "Toy" ADD CONSTRAINT "Toy_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToyLikes" ADD CONSTRAINT "ToyLikes_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToyComments" ADD CONSTRAINT "ToyComments_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsLikes" ADD CONSTRAINT "CommentsLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ToyComments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsComments" ADD CONSTRAINT "CommentsComments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ToyComments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
