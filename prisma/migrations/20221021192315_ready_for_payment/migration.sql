/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber,isAllowPayment]` on the table `UserPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountNumber_isAllowPayment_key" ON "UserPayment"("accountNumber", "isAllowPayment");
