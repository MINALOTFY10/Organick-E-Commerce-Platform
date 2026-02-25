-- Revert the previous incorrect migration that multiplied prices by 100.
-- Divide all prices back by 100 to restore the correct cent values.

UPDATE "Product"
   SET "price" = "price" / 100
 WHERE "price" >= 100;

UPDATE "Order"
   SET "total" = "total" / 100
 WHERE "total" >= 100;

UPDATE "OrderItem"
   SET "price" = "price" / 100
 WHERE "price" >= 100;
