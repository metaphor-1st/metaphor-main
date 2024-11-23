/*
  Warnings:

  - Added the required column `endTime` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `locationName` VARCHAR(191) NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL;
