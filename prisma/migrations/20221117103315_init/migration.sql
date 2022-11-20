/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber,QRRef]` on the table `QRShopPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QRShopPayment_accountNumber_QRRef_key" ON "QRShopPayment"("accountNumber", "QRRef");
