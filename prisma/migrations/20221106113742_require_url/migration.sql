/*
  Warnings:

  - Made the column `qrURL` on table `QRShopPayment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QRShopPayment" ALTER COLUMN "qrURL" SET NOT NULL;
