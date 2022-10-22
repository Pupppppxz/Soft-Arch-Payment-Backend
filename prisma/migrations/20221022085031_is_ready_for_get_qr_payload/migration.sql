/*
  Warnings:

  - A unique constraint covering the columns `[accountID,isAllowPayment]` on the table `UserPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountID_isAllowPayment_key" ON "UserPayment"("accountID", "isAllowPayment");
