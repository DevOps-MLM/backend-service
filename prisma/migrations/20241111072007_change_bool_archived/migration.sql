/*
  Warnings:

  - The `archived` column on the `Notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "archived",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
