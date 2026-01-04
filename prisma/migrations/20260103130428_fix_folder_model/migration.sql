/*
  Warnings:

  - Made the column `parentId` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentId_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "parentId" SET NOT NULL,
ALTER COLUMN "parentId" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
