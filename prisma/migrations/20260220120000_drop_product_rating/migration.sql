-- Drop the static rating column from Product.
-- Rating is now derived on-demand from the ProductReview aggregate.
ALTER TABLE "Product" DROP COLUMN "rating";
