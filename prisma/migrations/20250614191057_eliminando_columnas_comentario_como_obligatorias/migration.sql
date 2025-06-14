-- DropForeignKey
ALTER TABLE "CommentsComments" DROP CONSTRAINT "CommentsComments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentsLikes" DROP CONSTRAINT "CommentsLikes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "ToyComments" DROP CONSTRAINT "ToyComments_toyId_fkey";

-- DropForeignKey
ALTER TABLE "ToyLikes" DROP CONSTRAINT "ToyLikes_toyId_fkey";

-- AlterTable
ALTER TABLE "CommentsComments" ALTER COLUMN "commentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CommentsLikes" ALTER COLUMN "commentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Toy" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "forChanges" SET DEFAULT true,
ALTER COLUMN "forGifts" SET DEFAULT true,
ALTER COLUMN "forSell" SET DEFAULT true;

-- AlterTable
ALTER TABLE "ToyComments" ALTER COLUMN "toyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ToyLikes" ALTER COLUMN "toyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ToyLikes" ADD CONSTRAINT "ToyLikes_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToyComments" ADD CONSTRAINT "ToyComments_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "Toy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsLikes" ADD CONSTRAINT "CommentsLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ToyComments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsComments" ADD CONSTRAINT "CommentsComments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ToyComments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
