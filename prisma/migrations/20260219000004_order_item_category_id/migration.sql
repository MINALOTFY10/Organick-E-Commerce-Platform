-- Add categoryId to OrderItem.
-- Allows category revenue to be aggregated entirely in the DB (groupBy/SUM)
-- instead of fetching all order rows into Node.js memory.

ALTER TABLE "OrderItem" ADD COLUMN "categoryId" TEXT;

-- Backfill existing rows from the related Product.
UPDATE "OrderItem" oi
SET "categoryId" = p."categoryId"
FROM "Product" p
WHERE oi."productId" = p.id;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "OrderItem_categoryId_idx" ON "OrderItem"("categoryId");
