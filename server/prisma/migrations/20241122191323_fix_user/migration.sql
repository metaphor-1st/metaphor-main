/*
  Warnings:

  - You are about to drop the column `medi` on the `user` table. All the data in the column will be lost.
  - Added the required column `description` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disease` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `medi`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `disease` ENUM('RESPIRATORYDISEASE', 'HEADACHE', 'ABDOMINALPAIN') NOT NULL,
    ADD COLUMN `severity` ENUM('WEAK', 'MEDIUM', 'HARD') NOT NULL;
