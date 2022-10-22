/*
  Warnings:

  - You are about to drop the column `amount` on the `ShopPayment` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `UserPayment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopPayment" DROP COLUMN "amount",
ADD COLUMN     "balanced" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserPayment" DROP COLUMN "amount",
ADD COLUMN     "balanced" DOUBLE PRECISION NOT NULL DEFAULT 0;
