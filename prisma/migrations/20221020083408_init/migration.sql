-- CreateTable
CREATE TABLE "userPayment" (
    "accountNumber" TEXT NOT NULL,
    "accountID" TEXT NOT NULL,
    "amountLimit" DOUBLE PRECISION NOT NULL DEFAULT 500000,
    "refNumber" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAllowPayment" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userPayment_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateTable
CREATE TABLE "shopPayment" (
    "accountNumber" TEXT NOT NULL,
    "shopID" TEXT NOT NULL,
    "amountLimit" DOUBLE PRECISION NOT NULL DEFAULT 1000000,
    "refNumber" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAllowPayment" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopPayment_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateTable
CREATE TABLE "QRShopPayment" (
    "QRRef" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountNumber" TEXT NOT NULL,
    "expiredTime" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRShopPayment_pkey" PRIMARY KEY ("QRRef")
);

-- CreateIndex
CREATE UNIQUE INDEX "userPayment_accountNumber_key" ON "userPayment"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "userPayment_accountID_key" ON "userPayment"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "userPayment_accountID_accountNumber_key" ON "userPayment"("accountID", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shopPayment_accountNumber_key" ON "shopPayment"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shopPayment_shopID_key" ON "shopPayment"("shopID");

-- CreateIndex
CREATE UNIQUE INDEX "shopPayment_accountNumber_shopID_key" ON "shopPayment"("accountNumber", "shopID");
