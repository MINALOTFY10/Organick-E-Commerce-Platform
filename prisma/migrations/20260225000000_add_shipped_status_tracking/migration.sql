-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'SHIPPED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "shippedAt" TIMESTAMP(3),
ADD COLUMN "trackingNumber" TEXT;
