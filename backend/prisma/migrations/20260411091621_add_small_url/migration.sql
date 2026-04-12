/*
  Warnings:

  - Added the required column `small_url` to the `collection_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collection_images" ADD COLUMN "small_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "collection_images" ALTER COLUMN "small_url" DROP DEFAULT;
