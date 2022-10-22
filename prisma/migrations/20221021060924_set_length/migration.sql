/*
  Warnings:

  - You are about to alter the column `accountNumber` on the `QRShopPayment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - The primary key for the `ShopPayment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountNumber` on the `ShopPayment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - The primary key for the `UserPayment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountNumber` on the `UserPayment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.

*/
-- DropForeignKey
ALTER TABLE "QRShopPayment" DROP CONSTRAINT "QRShopPayment_accountNumber_fkey";

-- AlterTable
ALTER TABLE "QRShopPayment" ALTER COLUMN "accountNumber" SET DATA TYPE CHAR(10);

-- AlterTable
ALTER TABLE "ShopPayment" DROP CONSTRAINT "ShopPayment_pkey",
ALTER COLUMN "accountNumber" SET DATA TYPE CHAR(10),
ADD CONSTRAINT "ShopPayment_pkey" PRIMARY KEY ("accountNumber");

-- AlterTable
ALTER TABLE "UserPayment" DROP CONSTRAINT "UserPayment_pkey",
ALTER COLUMN "accountNumber" SET DATA TYPE CHAR(10),
ADD CONSTRAINT "UserPayment_pkey" PRIMARY KEY ("accountNumber");

-- AddForeignKey
ALTER TABLE "QRShopPayment" ADD CONSTRAINT "QRShopPayment_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ShopPayment"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
