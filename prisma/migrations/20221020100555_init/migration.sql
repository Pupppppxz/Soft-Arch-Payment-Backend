/*
  Warnings:

  - You are about to drop the `shopPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "shopPayment";

-- DropTable
DROP TABLE "userPayment";

-- CreateTable
CREATE TABLE "UserPayment" (
    "accountNumber" TEXT NOT NULL,
    "accountID" TEXT NOT NULL,
    "amountLimit" DOUBLE PRECISION NOT NULL DEFAULT 500000,
    "refNumber" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAllowPayment" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "UserPayment_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateTable
CREATE TABLE "ShopPayment" (
    "accountNumber" TEXT NOT NULL,
    "shopID" TEXT NOT NULL,
    "amountLimit" DOUBLE PRECISION NOT NULL DEFAULT 1000000,
    "refNumber" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAllowPayment" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ShopPayment_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountNumber_key" ON "UserPayment"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountID_key" ON "UserPayment"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "UserPayment_accountID_accountNumber_key" ON "UserPayment"("accountID", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ShopPayment_accountNumber_key" ON "ShopPayment"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ShopPayment_shopID_key" ON "ShopPayment"("shopID");

-- CreateIndex
CREATE UNIQUE INDEX "ShopPayment_accountNumber_shopID_key" ON "ShopPayment"("accountNumber", "shopID");

-- AddForeignKey
ALTER TABLE "QRShopPayment" ADD CONSTRAINT "QRShopPayment_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ShopPayment"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
