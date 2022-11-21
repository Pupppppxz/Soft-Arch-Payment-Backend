/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber,isAllowPayment]` on the table `ShopPayment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountNumber,isAllowPayment]` on the table `UserPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShopPayment_accountNumber_isAllowPayment_deleted_at_key";

-- DropIndex
DROP INDEX "UserPayment_accountNumber_isAllowPayment_deleted_at_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShopPayment_accountNumber_isAllowPayment_key" ON "ShopPayment"("accountNumber", "isAllowPayment");

-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountNumber_isAllowPayment_key" ON "UserPayment"("accountNumber", "isAllowPayment");
