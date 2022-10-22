/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber,isAllowPayment]` on the table `ShopPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShopPayment_accountNumber_isAllowPayment_key" ON "ShopPayment"("accountNumber", "isAllowPayment");
