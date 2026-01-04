/*
  Warnings:

  - A unique constraint covering the columns `[userId,parentId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentId_fkey";

-- DropIndex
DROP INDEX "Folder_name_key";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "parentId" DROP NOT NULL,
ALTER COLUMN "parentId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_parentId_name_key" ON "Folder"("userId", "parentId", "name");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
