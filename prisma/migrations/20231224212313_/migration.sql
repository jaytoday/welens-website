/*
  Warnings:

  - Added the required column `status` to the `ProductIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductIntegration" ADD COLUMN     "status" TEXT NOT NULL;
