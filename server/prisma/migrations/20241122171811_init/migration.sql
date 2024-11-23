-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `gender` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `medi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `locationId` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `medi` VARCHAR(191) NOT NULL,
    `stock` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`locationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pill` (
    `pillId` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`pillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
