/*
  Warnings:

  - You are about to drop the column `parentFolderId` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "parentFolderId",
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
