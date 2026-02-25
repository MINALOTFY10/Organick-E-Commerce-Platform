-- Deduplicate any existing CartItem rows with the same (cartId, productId)
-- before adding the unique constraint.
WITH dedup AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY "cartId", "productId" ORDER BY quantity DESC) AS rn
  FROM "CartItem"
)
DELETE FROM "CartItem"
WHERE id IN (SELECT id FROM dedup WHERE rn > 1);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");
