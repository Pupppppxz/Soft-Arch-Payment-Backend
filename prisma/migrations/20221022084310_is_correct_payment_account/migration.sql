/*
  Warnings:

  - A unique constraint covering the columns `[accountID,accountNumber,isAllowPayment]` on the table `UserPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserPayment_accountID_accountNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountID_accountNumber_isAllowPayment_key" ON "UserPayment"("accountID", "accountNumber", "isAllowPayment");
