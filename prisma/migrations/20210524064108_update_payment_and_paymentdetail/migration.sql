/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PaymentDetail` table. All the data in the column will be lost.
  - Added the required column `index` to the `PaymentDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `isactive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `PaymentDetail` DROP COLUMN `createdAt`,
    ADD COLUMN `index` INTEGER NOT NULL;
