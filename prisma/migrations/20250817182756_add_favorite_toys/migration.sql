/*
  Warnings:

  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentsComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentsLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToyLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_toyId_fkey";

-- DropForeignKey
ALTER TABLE "CommentsComments" DROP CONSTRAINT "CommentsComments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentsLikes" DROP CONSTRAINT "CommentsLikes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "ToyLikes" DROP CONSTRAINT "ToyLikes_toyId_fkey";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "CommentsComments";

-- DropTable
DROP TABLE "CommentsLikes";

-- DropTable
DROP TABLE "ToyLikes";

-- CreateTable
CREATE TABLE "FavoriteToy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteToy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteToy_userId_toyId_key" ON "FavoriteToy"("userId", "toyId");

-- AddForeignKey
ALTER TABLE "FavoriteToy" ADD CONSTRAINT "FavoriteToy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteToy" ADD CONSTRAINT "FavoriteToy_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
