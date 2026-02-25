-- Fix product, order, and order-item prices that were stored as dollar values
-- instead of cent values.  Multiply by 100 to convert dollars → cents.
--
-- Guard: only touch rows whose price looks like a dollar amount (< 10 000).
-- Any row already in cents (e.g. 42 000 for $420) will NOT be touched.

UPDATE "Product"
   SET "price" = "price" * 100
 WHERE "price" < 10000;

UPDATE "Order"
   SET "total" = "total" * 100
 WHERE "total" < 10000;

UPDATE "OrderItem"
   SET "price" = "price" * 100
 WHERE "price" < 10000;
