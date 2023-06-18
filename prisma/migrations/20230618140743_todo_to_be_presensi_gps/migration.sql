/*
  Warnings:

  - You are about to drop the column `name` on the `role` table. All the data in the column will be lost.
  - You are about to drop the `_tagtotodo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userrole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nama]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nama` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_tagtotodo` DROP FOREIGN KEY `_TagToToDo_A_fkey`;

-- DropForeignKey
ALTER TABLE `_tagtotodo` DROP FOREIGN KEY `_TagToToDo_B_fkey`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `ToDo_username_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_roleName_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_userName_fkey`;

-- DropIndex
DROP INDEX `Role_name_key` ON `role`;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `name`,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_tagtotodo`;

-- DropTable
DROP TABLE `tag`;

-- DropTable
DROP TABLE `todo`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userrole`;

-- CreateTable
CREATE TABLE `Divisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(10) NULL,
    `nama` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Divisi_kode_key`(`kode`),
    UNIQUE INDEX `Divisi_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `divisiName` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('Pria', 'Wanita') NOT NULL DEFAULT 'Pria',
    `alamat` VARCHAR(191) NULL,
    `no_hp` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `foto` VARCHAR(191) NOT NULL,
    `in_active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lastLogin` DATETIME(3) NULL,

    UNIQUE INDEX `Employee_nama_key`(`nama`),
    UNIQUE INDEX `Employee_nik_key`(`nik`),
    UNIQUE INDEX `Employee_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeRole` (
    `employeeNik` VARCHAR(191) NOT NULL,
    `roleName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`employeeNik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Office` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `jarak` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkingTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jam_masuk` TIME NOT NULL,
    `jam_keluar` TIME NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Presence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `tanggal` DATE NOT NULL,
    `waktu` TIME NOT NULL,
    `gps` VARCHAR(191) NOT NULL,
    `jarak` DOUBLE NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `presensiMasuk` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Status_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `presenceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeName` VARCHAR(191) NOT NULL,
    `presenceHistory` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PresenceToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PresenceToStatus_AB_unique`(`A`, `B`),
    INDEX `_PresenceToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Role_nama_key` ON `Role`(`nama`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_divisiName_fkey` FOREIGN KEY (`divisiName`) REFERENCES `Divisi`(`nama`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeRole` ADD CONSTRAINT `EmployeeRole_employeeNik_fkey` FOREIGN KEY (`employeeNik`) REFERENCES `Employee`(`nik`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeRole` ADD CONSTRAINT `EmployeeRole_roleName_fkey` FOREIGN KEY (`roleName`) REFERENCES `Role`(`nama`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Information` ADD CONSTRAINT `Information_presenceId_fkey` FOREIGN KEY (`presenceId`) REFERENCES `Presence`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_employeeName_fkey` FOREIGN KEY (`employeeName`) REFERENCES `Employee`(`nama`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_presenceHistory_fkey` FOREIGN KEY (`presenceHistory`) REFERENCES `Presence`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PresenceToStatus` ADD CONSTRAINT `_PresenceToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Presence`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PresenceToStatus` ADD CONSTRAINT `_PresenceToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
