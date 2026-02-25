-- AlterTable: add optional addressId FK to Order
ALTER TABLE "Order" ADD COLUMN "addressId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Order_addressId_idx" ON "Order"("addressId");
