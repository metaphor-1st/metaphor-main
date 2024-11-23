/*
  Warnings:

  - Added the required column `pillName` to the `Pill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pill` ADD COLUMN `pillName` VARCHAR(191) NOT NULL;
