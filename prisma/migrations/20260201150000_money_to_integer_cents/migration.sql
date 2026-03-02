-- Convert monetary fields from DOUBLE PRECISION (dollars) to INTEGER (cents)
-- Existing rows are multiplied by 100 and rounded.

ALTER TABLE "Product"   ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;
ALTER TABLE "Order"     ALTER COLUMN "total" TYPE INTEGER USING ROUND("total" * 100)::INTEGER;
ALTER TABLE "OrderItem" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;
