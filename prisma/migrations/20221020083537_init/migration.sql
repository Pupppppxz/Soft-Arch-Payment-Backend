-- AlterTable
ALTER TABLE "QRShopPayment" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shopPayment" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "userPayment" ALTER COLUMN "deleted_at" DROP NOT NULL;
